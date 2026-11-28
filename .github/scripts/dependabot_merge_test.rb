require 'minitest/autorun'
require_relative 'dependabot_merge'

class DependabotMergeTest < Minitest::Test
  def test_checks_every_importer_and_uses_locked_versions_instead_of_stale_metadata
    before = lock('tool' => '4.1.17(peer@1.0.0)')
    after = lock('tool' => '4.3.5(peer@2.0.0)')
    assert DependabotMerge.eligible_versions?(metadata('tool'), before, after)
    refute DependabotMerge.eligible_versions?(metadata('tool'), before, lock('tool' => '5.0.0'))
    refute DependabotMerge.eligible_versions?(metadata('tool'), lock('tool' => '0.2.0'), lock('tool' => '0.2.1'))
    refute DependabotMerge.eligible_versions?(metadata('tool'), before, lock('tool' => '4.3.5-rc.1'))
  end

  def test_rejects_a_major_in_another_importer_of_a_targeted_package
    before = lock({ 'tool' => '1.0.0' }, { 'tool' => '1.0.0' })
    after = lock({ 'tool' => '1.0.1' }, { 'tool' => '2.0.0' })
    refute DependabotMerge.eligible_versions?(metadata('tool'), before, after)
  end

  def test_rejects_an_unlisted_direct_update_and_accepts_grouped_updates
    before = lock('tool' => '1.0.0', 'other' => '3.0.0')
    after = lock('tool' => '1.1.0', 'other' => '3.0.1')
    refute DependabotMerge.eligible_versions?(metadata('tool'), before, after)
    assert DependabotMerge.eligible_versions?(metadata('tool', 'other'), before, after)
  end

  def test_only_allows_the_expected_changeset_as_a_second_commit
    update = commit('dependabot[bot]', 'main', [{ 'filename' => 'pnpm-lock.yaml', 'status' => 'modified' }], verified: true)
    changeset = { 'filename' => '.changeset/dependabot-pr-326.md', 'status' => 'added' }
    followup = commit('github-actions[bot]', 'update', [changeset])
    assert DependabotMerge.dependency_commit([update, followup], 'main', 'head', 326)
    refute DependabotMerge.dependency_commit([update, followup], 'main', 'head', 325)
    followup['files'] << { 'filename' => 'package.json', 'status' => 'modified' }
    refute DependabotMerge.dependency_commit([update, followup], 'main', 'head', 326)
  end

  def test_approval_can_arrive_before_or_after_ci_but_a_stale_check_does_not_count
    approved = { 'reviewDecision' => 'APPROVED', 'mergeStateStatus' => 'CLEAN' }
    waiting_review = approved.merge('reviewDecision' => 'REVIEW_REQUIRED', 'mergeStateStatus' => 'BLOCKED')
    review = { 'author' => { '__typename' => 'User' }, 'state' => 'APPROVED', 'authorCanPushToRepository' => true }
    lint = check('Check-lint', 'head')
    changesets = check('validate-changesets', 'head')
    refute DependabotMerge.ready?(waiting_review, [], [lint, changesets], 'head')
    refute DependabotMerge.ready?(approved, [review], [lint, check('validate-changesets', 'old')], 'head')
    refute DependabotMerge.ready?(approved, [review], [lint, changesets.merge('conclusion' => 'skipped')], 'head')
    refute DependabotMerge.ready?(approved, [review.merge('author' => { '__typename' => 'Bot' })], [lint, changesets], 'head')
    refute DependabotMerge.ready?(approved, [review.merge('authorCanPushToRepository' => false)], [lint, changesets], 'head')
    assert DependabotMerge.ready?(approved, [review], [lint, changesets], 'head')
  end

  private

  def metadata(*names)
    names.map do |name|
      { 'dependency-name' => name, 'dependency-type' => 'direct:development', 'dependency-version' => '4.2.3' }
    end
  end

  def lock(root, workspace = {})
    extra_document = { 'importers' => { '.' => { 'packageManagerDependencies' => {} } } }
    dependencies = ->(versions) { { 'devDependencies' => versions.transform_values { |version| { 'version' => version } } } }
    YAML.dump(extra_document) + YAML.dump('importers' => { '.' => dependencies.call(root), 'packages/app' => dependencies.call(workspace) })
  end

  def commit(author, parent, files, verified: false)
    {
      'sha' => author == 'dependabot[bot]' ? 'update' : 'head',
      'author' => { 'login' => author }, 'parents' => [{ 'sha' => parent }], 'files' => files,
      'commit' => { 'verification' => { 'verified' => verified } }
    }
  end

  def check(name, sha)
    { 'name' => name, 'head_sha' => sha, 'status' => 'completed', 'conclusion' => 'success', 'app' => { 'id' => 15_368 } }
  end
end
