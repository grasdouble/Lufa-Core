#!/usr/bin/env node
/**
 * lufa-agents-sync
 *
 * Embeds the content of AGENTS.shared.md from @grasdouble/lufa_config_agents
 * directly into the consuming repo's AGENTS.md, between the markers:
 *
 *   <!-- BEGIN:AGENTS.shared -->
 *   <!-- END:AGENTS.shared -->
 *
 * Usage:
 *   pnpm sync:agents          (via "sync:agents": "lufa-agents-sync" in package.json)
 *   pnpm dlx @grasdouble/lufa_config_agents
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

export const BEGIN_MARKER = '<!-- BEGIN:AGENTS.shared -->'
export const END_MARKER = '<!-- END:AGENTS.shared -->'

/**
 * Builds the replacement block to inject between the markers.
 * @param {string} sharedContent - Content of AGENTS.shared.md (trimmed)
 * @param {string} version - Package version string
 * @returns {string}
 */
export function buildBlock(sharedContent, version) {
  const header =
    `${BEGIN_MARKER}\n` +
    `<!-- source: @grasdouble/lufa_config_agents@${version} — DO NOT EDIT this block manually, run \`pnpm sync:agents\` -->`
  return `${header}\n\n${sharedContent}\n\n${END_MARKER}`
}

/**
 * Injects `sharedContent` into `agentsMd` between the markers.
 *
 * @param {string} agentsMd - Current content of the target AGENTS.md
 * @param {string} sharedContent - Content of AGENTS.shared.md (trimmed)
 * @param {string} version - Package version string
 * @returns {{ updated: string; changed: boolean }} The new content and whether it differs
 * @throws {Error} If markers are missing or in the wrong order
 */
export function injectSharedBlock(agentsMd, sharedContent, version) {
  // Locate markers — search END after BEGIN to avoid matching a stale marker
  // inside a code block or documentation snippet that precedes the actual pair.
  const beginIdx = agentsMd.indexOf(BEGIN_MARKER)
  const endIdx = beginIdx === -1 ? -1 : agentsMd.indexOf(END_MARKER, beginIdx + BEGIN_MARKER.length)

  if (beginIdx === -1 || endIdx === -1) {
    throw new Error(
      `Markers not found in AGENTS.md.\n` +
        `Add the following markers where you want the shared rules injected:\n\n` +
        `${BEGIN_MARKER}\n` +
        `${END_MARKER}`
    )
  }

  const block = buildBlock(sharedContent, version)
  const before = agentsMd.slice(0, beginIdx)
  const after = agentsMd.slice(endIdx + END_MARKER.length)
  const updated = `${before}${block}${after}`

  return { updated, changed: updated !== agentsMd }
}

function main() {
  const __dirname = dirname(fileURLToPath(import.meta.url))
  const PACKAGE_DIR = resolve(__dirname, '..')
  const SHARED_MD = resolve(PACKAGE_DIR, 'AGENTS.shared.md')
  const PACKAGE_JSON = resolve(PACKAGE_DIR, 'package.json')
  const AGENTS_MD = resolve(process.cwd(), 'AGENTS.md')

  let sharedContent, version, agentsMd

  try {
    sharedContent = readFileSync(SHARED_MD, 'utf8').trimEnd()
  } catch {
    console.error(`❌ Cannot read AGENTS.shared.md from ${SHARED_MD}`)
    process.exit(1)
  }

  try {
    const raw = JSON.parse(readFileSync(PACKAGE_JSON, 'utf8')).version
    // When running from the source repo itself, PACKAGE_DIR is inside process.cwd(),
    // so the version number would always be stale (unreleased). Use "(local)" instead.
    const isSourceRepo = PACKAGE_DIR.startsWith(process.cwd())
    version = isSourceRepo ? 'local' : raw
  } catch {
    console.error(`❌ Cannot read package.json from ${PACKAGE_JSON}`)
    process.exit(1)
  }

  try {
    agentsMd = readFileSync(AGENTS_MD, 'utf8')
  } catch {
    console.error(
      `❌ Cannot read AGENTS.md in ${process.cwd()}\n` +
        `   Make sure you run this command from the root of your repository.`
    )
    process.exit(1)
  }

  let result
  try {
    result = injectSharedBlock(agentsMd, sharedContent, version)
  } catch (err) {
    console.error(`❌ ${err.message}`)
    process.exit(1)
  }

  if (!result.changed) {
    console.log(
      `✅ AGENTS.md is already up to date (@grasdouble/lufa_config_agents@${version}).`
    )
    return
  }

  writeFileSync(AGENTS_MD, result.updated, 'utf8')
  console.log(`✅ AGENTS.md synced from @grasdouble/lufa_config_agents@${version}.`)
}

// Only run when invoked directly (not imported as a module)
if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  main()
}
