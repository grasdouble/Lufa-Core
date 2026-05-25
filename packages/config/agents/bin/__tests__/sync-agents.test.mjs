import { describe, it, expect } from 'vitest'
import { BEGIN_MARKER, END_MARKER, buildBlock, injectSharedBlock } from '../sync-agents.mjs'

const VERSION = '1.2.3'
const SHARED = '# Shared rules\n\nDo not commit secrets.'

// Helper: build a minimal AGENTS.md with empty marker pair
function agentsWith(inner = '') {
  return `# AGENTS\n\n${BEGIN_MARKER}\n${inner}${END_MARKER}\n\nMore content.\n`
}

describe('buildBlock', () => {
  it('wraps content between markers with a version annotation', () => {
    const block = buildBlock(SHARED, VERSION)
    expect(block.startsWith(BEGIN_MARKER)).toBe(true)
    expect(block.endsWith(END_MARKER)).toBe(true)
    expect(block).toContain(`@grasdouble/lufa_config_agents@${VERSION}`)
    expect(block).toContain(SHARED)
  })
})

describe('injectSharedBlock', () => {
  it('injects shared content and reports changed = true', () => {
    const agentsMd = agentsWith()
    const { updated, changed } = injectSharedBlock(agentsMd, SHARED, VERSION)

    expect(changed).toBe(true)
    expect(updated).toContain(SHARED)
    expect(updated).toContain(`@grasdouble/lufa_config_agents@${VERSION}`)
    // Text before and after markers is preserved
    expect(updated).toContain('# AGENTS')
    expect(updated).toContain('More content.')
  })

  it('reports changed = false when content is already up to date', () => {
    const agentsMd = agentsWith()
    const { updated } = injectSharedBlock(agentsMd, SHARED, VERSION)
    // Run again on the already-synced output
    const { changed } = injectSharedBlock(updated, SHARED, VERSION)
    expect(changed).toBe(false)
  })

  it('preserves text before and after the marker block exactly', () => {
    const before = 'Before content.\n\n'
    const after = '\n\nAfter content.'
    const agentsMd = `${before}${BEGIN_MARKER}\n${END_MARKER}${after}`
    const { updated } = injectSharedBlock(agentsMd, SHARED, VERSION)

    expect(updated.startsWith(before)).toBe(true)
    expect(updated.endsWith(after)).toBe(true)
  })

  it('throws when BEGIN marker is missing', () => {
    const agentsMd = `# AGENTS\n\n${END_MARKER}\n`
    expect(() => injectSharedBlock(agentsMd, SHARED, VERSION)).toThrow(/Markers not found/)
  })

  it('throws when END marker is missing', () => {
    const agentsMd = `# AGENTS\n\n${BEGIN_MARKER}\n`
    expect(() => injectSharedBlock(agentsMd, SHARED, VERSION)).toThrow(/Markers not found/)
  })

  it('throws when both markers are missing', () => {
    const agentsMd = '# AGENTS\n\nNo markers here.\n'
    expect(() => injectSharedBlock(agentsMd, SHARED, VERSION)).toThrow(/Markers not found/)
  })

  it('throws when END marker appears before BEGIN marker (treated as missing)', () => {
    // When END precedes BEGIN, the algorithm searches for END *after* BEGIN and
    // finds nothing — so "Markers not found" is the expected error.
    const agentsMd = `${END_MARKER}\n${BEGIN_MARKER}\n`
    expect(() => injectSharedBlock(agentsMd, SHARED, VERSION)).toThrow(/Markers not found/)
  })

  it('handles AGENTS.md with content only before the marker block', () => {
    const agentsMd = `${BEGIN_MARKER}\n${END_MARKER}`
    const { updated, changed } = injectSharedBlock(agentsMd, SHARED, VERSION)
    expect(changed).toBe(true)
    expect(updated).toContain(SHARED)
  })

  it('injects correct version in the annotation', () => {
    const agentsMd = agentsWith()
    const { updated } = injectSharedBlock(agentsMd, SHARED, '0.42.0')
    expect(updated).toContain('@grasdouble/lufa_config_agents@0.42.0')
  })
})
