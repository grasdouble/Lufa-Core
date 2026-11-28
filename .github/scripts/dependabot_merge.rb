require 'json'
require 'open3'
require 'yaml'

module DependabotMerge
  BOT = 'dependabot[bot]'.freeze
  ACTIONS_BOT = 'github-actions[bot]'.freeze
  ACTIONS_APP_ID = 15_368
  REQUIRED_CHECKS = %w[Check-lint validate-changesets].freeze
  DIRECT_TYPES = %w[direct:development direct:production].freeze
  SECTIONS = %w[dependencies devDependencies optionalDependencies].freeze
  VERSION = /\A[1-9]\d*\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\z/
  MANIFEST = %r{\A(?:packages/(?:[^/]+/)+)?package\.json\z}

  def self.dependency_commit(commits, base_sha, head_sha, number)
    return unless (1..2).cover?(commits.length) && commits.last['sha'] == head_sha

    update, changeset = commits
    return unless update.dig('author', 'login') == BOT && update.dig('commit', 'verification', 'verified') == true
    return unless update.fetch('parents').map { |parent| parent['sha'] } == [base_sha]

    files = update.fetch('files')
    return unless files.any? { |file| file['filename'] == 'pnpm-lock.yaml' }
    return unless files.all? do |file|
      path = file.fetch('filename')
      file['status'] == 'modified' && (path == 'pnpm-lock.yaml' || MANIFEST.match?(path))
    end

    if changeset
      return unless changeset.dig('author', 'login') == ACTIONS_BOT
      return unless changeset.fetch('parents').map { |parent| parent['sha'] } == [update['sha']]
      return unless changeset.fetch('files').map { |file| file.values_at('filename', 'status') } ==
                    [[".changeset/dependabot-pr-#{number}.md", 'added']]
    end

    update
  end

  def self.metadata(commit)
    fragment = commit.dig('commit', 'message').match(/^---\n(.*?)^\.\.\.$/m)
    fragment && YAML.safe_load(fragment[1]).fetch('updated-dependencies', nil)
  end

  def self.direct_versions(lock)
    # pnpm 12 puts package-manager and workspace data in separate YAML documents.
    documents = lock.split(/^---[ \t]*\r?$/).reject { |document| document.strip.empty? }
    documents.each_with_object({}) do |document, versions|
      YAML.safe_load(document).fetch('importers').each do |path, importer|
        SECTIONS.each do |section|
          importer.fetch(section, {}).each do |name, dependency|
            # Peer suffixes are not part of the installed package's own version.
            versions[[path, section, name]] = dependency.fetch('version').split('(', 2).first
          end
        end
      end
    end
  end

  def self.eligible_versions?(updates, parent_lock, head_lock)
    return false unless updates.is_a?(Array) && !updates.empty? && updates.all? do |update|
      update['dependency-name'].is_a?(String) && DIRECT_TYPES.include?(update['dependency-type'])
    end

    targets = updates.map { |update| update['dependency-name'] }.uniq.sort
    before = direct_versions(parent_lock)
    after = direct_versions(head_lock)
    changed = (before.keys | after.keys).select { |key| before[key] != after[key] }
    return false unless changed.map(&:last).uniq.sort == targets

    changed.all? do |key|
      from = before[key]
      to = after[key]
      VERSION.match?(from) && VERSION.match?(to) &&
        from.split('.', 2).first == to.split('.', 2).first && (from.split('.').map(&:to_i) <=> to.split('.').map(&:to_i)).negative?
    end
  end

  def self.protected?(rules)
    approval = rules.any? do |rule|
      rule['type'] == 'pull_request' && rule.dig('parameters', 'required_approving_review_count').to_i.positive?
    end
    strict_checks = rules.select do |rule|
      rule['type'] == 'required_status_checks' && rule.dig('parameters', 'strict_required_status_checks_policy') == true
    end.flat_map { |rule| rule.dig('parameters', 'required_status_checks') }
    approval && REQUIRED_CHECKS.all? do |name|
      strict_checks.any? { |check| check['context'] == name && check['integration_id'] == ACTIONS_APP_ID }
    end
  end

  def self.ready?(pr, latest_reviews, checks, sha)
    return false unless pr.values_at('reviewDecision', 'mergeStateStatus') == %w[APPROVED CLEAN]
    return false unless latest_reviews.any? do |review|
      review['state'] == 'APPROVED' && review.dig('author', '__typename') == 'User' &&
        review['authorCanPushToRepository'] == true
    end

    REQUIRED_CHECKS.all? do |name|
      check = checks.find { |entry| entry['name'] == name && entry.dig('app', 'id') == ACTIONS_APP_ID }
      check && check.values_at('head_sha', 'status', 'conclusion') == [sha, 'completed', 'success']
    end
  end

  def self.review_state(repository, number)
    owner, name = repository.split('/')
    query = <<~GRAPHQL
      query($owner: String!, $name: String!, $number: Int!) {
        repository(owner: $owner, name: $name) {
          pullRequest(number: $number) {
            headRefOid
            reviewDecision
            mergeStateStatus
            latestOpinionatedReviews(first: 100, writersOnly: true) {
              nodes {
                state
                authorCanPushToRepository
                author { __typename }
              }
            }
          }
        }
      }
    GRAPHQL
    response = gh('api', 'graphql', '-f', "query=#{query}", '-f', "owner=#{owner}", '-f', "name=#{name}", '-F', "number=#{number}")
    JSON.parse(response).fetch('data').fetch('repository').fetch('pullRequest')
  end

  def self.run(repository, scope)
    return unless /\A[1-9]\d*\z/.match?(scope)

    number = scope.to_i
    path = "pulls/#{number}"
    pr = api(repository, path)
    return unless pr.values_at('state', 'draft') == ['open', false] && pr.dig('user', 'login') == BOT &&
                  pr.dig('base', 'ref') == 'main' && pr.dig('head', 'repo', 'full_name') == repository &&
                  pr.dig('head', 'ref').start_with?('dependabot/npm_and_yarn/')

    sha = pr.dig('head', 'sha')
    return unless (1..2).cover?(pr['commits'])

    rules = api(repository, 'rules/branches/main?per_page=100')
    abort 'Pilot blocked: main does not require reviews and the strict Lufa CI checks.' unless protected?(rules)

    merge_state = review_state(repository, number)
    return unless merge_state['headRefOid'] == sha

    checks = api(repository, "commits/#{sha}/check-runs?filter=latest&per_page=100").fetch('check_runs')
    unless ready?(merge_state, merge_state.dig('latestOpinionatedReviews', 'nodes'), checks, sha)
      puts "PR ##{number} is waiting for review, CI, or branch protection."
      return
    end

    base = api(repository, 'git/ref/heads/main').dig('object', 'sha')
    commits = api(repository, "#{path}/commits").map { |commit| api(repository, "commits/#{commit.fetch('sha')}") }
    update = dependency_commit(commits, base, sha, number)
    unless update && eligible_versions?(metadata(update), raw_lock(repository, base), raw_lock(repository, sha))
      puts "PR ##{number} is outside the dependency merge policy or is no longer up to date."
      return
    end

    result = api(repository, "#{path}/merge", '-X', 'PUT', '-f', "sha=#{sha}", '-f', 'merge_method=squash')
    abort 'GitHub did not merge the validated revision.' unless result['merged'] == true

    puts "Merged reviewed and validated commit #{sha} for PR ##{number}."
  end

  def self.raw_lock(repository, sha)
    gh('api', "repos/#{repository}/contents/pnpm-lock.yaml?ref=#{sha}", '-H', 'Accept: application/vnd.github.raw+json')
  end

  def self.api(repository, path, *options)
    JSON.parse(gh('api', "repos/#{repository}/#{path}", *options))
  end

  def self.gh(*args)
    output, error, status = Open3.capture3('gh', *args)
    abort error unless status.success?

    output
  end
end

if $PROGRAM_NAME == __FILE__
  DependabotMerge.run(ENV.fetch('GITHUB_REPOSITORY'), ENV.fetch('DEPENDABOT_AUTOMATION'))
end
