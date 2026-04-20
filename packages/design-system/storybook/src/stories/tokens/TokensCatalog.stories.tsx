import React, { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import tokensMetadata from '../../../../tokens/dist/tokens-metadata.json';
import { StoryContainer } from '../../components/helpers';

/**
 * Tokens Catalog - Interactive Token Browser
 *
 * Browse, search, and explore all design tokens in the Lufa Design System.
 * This catalog provides comprehensive documentation, visual previews, and code examples
 * for every token in the system.
 *
 * ## Features
 * - 🔍 **Search** - Find tokens by name, value, or description
 * - 🎛️ **Filter** - Filter by level (primitive, core, semantic, component) and category
 * - 📋 **Copy** - One-click copy of CSS variables
 * - 🎨 **Visual Preview** - See colors, spacing, shadows, and typography rendered
 * - 📖 **Token Details** - Complete metadata, descriptions, and use cases
 * - 🔗 **Reference Chain** - See how tokens reference each other
 *
 * ## Token Architecture
 *
 * **4-Level Hierarchy:**
 * 1. **Primitive** - Raw foundational values (blue-600, spacing-16)
 * 2. **Core** - Global design decisions (brand-primary, layout-padding-page)
 * 3. **Semantic** - Context-specific decisions (text-primary, spacing-comfortable)
 * 4. **Component** - Component-specific values (button-padding-md, card-shadow-default)
 */
const meta = {
  title: '3. Tokens/Tokens Catalog',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// Types
type TokenMetadata = {
  name: string;
  cssVar: string;
  value: string;
  type: string;
  level: 'primitive' | 'core' | 'semantic' | 'component';
  category: string;
  description?: string;
  useCase?: string;
  references?: string[];
  wcagAALarge?: string[];
  wcagAAA?: string[];
  themeable?: boolean;
  modeAware?: boolean;
  mediaQuery?: string;
  devices?: string;
};

type ShadowValue = {
  offsetX: string;
  offsetY: string;
  blur?: string;
  spread?: string;
  color?: string;
};

// Helper to convert value to string
function valueToString(value: unknown): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number') {
    return String(value);
  }
  if (typeof value === 'object' && value !== null) {
    // Handle shadow objects
    if ('offsetX' in value && 'offsetY' in value) {
      const shadow = value as ShadowValue;
      return `${shadow.offsetX} ${shadow.offsetY} ${shadow.blur ?? '0'} ${shadow.spread ?? '0'} ${shadow.color ?? 'rgba(0,0,0,0.1)'}`;
    }
    // Handle other objects
    return JSON.stringify(value);
  }
  return String(value);
}

// Flatten tokens metadata into array
function flattenTokens(metadata: Record<string, unknown>): TokenMetadata[] {
  const tokens: TokenMetadata[] = [];

  function traverse(obj: Record<string, unknown>, path: string[] = [], level = '') {
    if ('value' in obj && obj.value !== undefined && 'type' in obj && obj.type !== undefined) {
      // This is a token
      const name = path.join('.');
      const cssVar = `--lufa-${path.join('-')}`;
      const extensions =
        obj.extensions &&
        typeof obj.extensions === 'object' &&
        obj.extensions !== null &&
        'lufa' in obj.extensions &&
        typeof obj.extensions.lufa === 'object' &&
        obj.extensions.lufa !== null
          ? (obj.extensions.lufa as Record<string, unknown>)
          : {};

      tokens.push({
        name,
        cssVar,
        value: valueToString(obj.value),
        type: typeof obj.type === 'string' ? obj.type : JSON.stringify(obj.type),
        level: (level || extensions.level) as TokenMetadata['level'],
        category:
          typeof extensions.category === 'string'
            ? extensions.category
            : typeof path[path.length - 2] === 'string'
              ? path[path.length - 2]
              : 'other',
        description: typeof obj.description === 'string' ? obj.description : undefined,
        useCase: typeof extensions.useCase === 'string' ? extensions.useCase : undefined,
        themeable: extensions.themeable ? Boolean(extensions.themeable) : undefined,
        modeAware: extensions.modeAware ? Boolean(extensions.modeAware) : undefined,
        wcagAALarge: extensions.wcagAALarge as string[] | undefined,
        wcagAAA: extensions.wcagAAA as string[] | undefined,
        mediaQuery: typeof extensions.mediaQuery === 'string' ? extensions.mediaQuery : undefined,
        devices: typeof extensions.devices === 'string' ? extensions.devices : undefined,
      });
    } else {
      // Traverse deeper
      const currentLevel = ['primitive', 'core', 'semantic', 'component'].includes(path[0]) ? path[0] : level;
      Object.keys(obj).forEach((key) => {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
          traverse(value as Record<string, unknown>, [...path, key], currentLevel);
        }
      });
    }
  }

  traverse(metadata);
  return tokens;
}

// Get all tokens
const allTokens = flattenTokens(tokensMetadata);

// Color swatch preview
const ColorPreview = ({ value }: { value: string }) => (
  <div
    style={{
      width: '100%',
      height: '48px',
      backgroundColor: value,
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.1)',
    }}
  />
);

// Spacing ruler preview
const SpacingPreview = ({ value }: { value: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
    <div
      style={{
        width: value,
        height: '24px',
        backgroundColor: '#3B82F6',
        borderRadius: '2px',
      }}
    />
    <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{value}</span>
  </div>
);

// Shadow preview
const ShadowPreview = ({ value }: { value: string }) => (
  <div
    style={{
      width: '100%',
      height: '48px',
      backgroundColor: '#ffffff',
      borderRadius: '4px',
      boxShadow: value,
    }}
  />
);

// Typography preview
const TypographyPreview = ({ value, type }: { value: string; type: string }) => {
  if (type === 'fontFamily') {
    return <div style={{ fontFamily: value, fontSize: '14px' }}>The quick brown fox jumps over the lazy dog</div>;
  }
  if (type === 'fontSize') {
    return <div style={{ fontSize: value }}>Aa</div>;
  }
  if (type === 'fontWeight') {
    return <div style={{ fontWeight: value, fontSize: '16px' }}>Font Weight {value}</div>;
  }
  if (type === 'lineHeight') {
    return (
      <div style={{ fontSize: '12px', lineHeight: value, border: '1px solid #E5E7EB', padding: '4px' }}>
        <div>Line 1</div>
        <div>Line 2</div>
        <div>Line 3</div>
      </div>
    );
  }
  return <span style={{ fontSize: '12px', color: '#6B7280' }}>{value}</span>;
};

// Border radius preview
const RadiusPreview = ({ value }: { value: string }) => (
  <div
    style={{
      width: '48px',
      height: '48px',
      backgroundColor: '#3B82F6',
      borderRadius: value,
    }}
  />
);

// Dimension preview (for generic dimensions)
const DimensionPreview = ({ value }: { value: string }) => (
  <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{value}</div>
);

// Duration/Easing preview
const MotionPreview = ({ value, type }: { value: string; type: string }) => (
  <div style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>
    {type === 'duration' ? `${value}` : value}
  </div>
);

// Token preview component
const TokenPreview = ({ token }: { token: TokenMetadata }) => {
  const { value, type, category } = token;

  if (type === 'color') {
    return <ColorPreview value={value} />;
  }
  if (category === 'spacing' && type === 'dimension') {
    return <SpacingPreview value={value} />;
  }
  if (category === 'shadow') {
    return <ShadowPreview value={value} />;
  }
  if (type === 'fontFamily' || type === 'fontSize' || type === 'fontWeight' || type === 'lineHeight') {
    return <TypographyPreview value={value} type={type} />;
  }
  if (category === 'radius') {
    return <RadiusPreview value={value} />;
  }
  if (category === 'motion' || type === 'duration' || type === 'cubicBezier') {
    return <MotionPreview value={value} type={type} />;
  }
  if (type === 'dimension') {
    return <DimensionPreview value={value} />;
  }

  return <span style={{ fontSize: '12px', color: '#6B7280', fontFamily: 'monospace' }}>{value}</span>;
};

// Copy to clipboard with toast
const useCopyToClipboard = () => {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = (text: string) => {
    void navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  };

  return { copy, copied };
};

// Token card component
const TokenCard = ({ token, onCopy }: { token: TokenMetadata; onCopy: (text: string) => void }) => {
  return (
    <div
      style={{
        border: '1px solid #E5E7EB',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minWidth: '280px',
        flex: '1 1 280px',
        maxWidth: '400px',
      }}
    >
      {/* Preview */}
      <div style={{ marginBottom: '8px' }}>
        <TokenPreview token={token} />
      </div>

      {/* Name */}
      <div>
        <div
          style={{
            fontSize: '13px',
            fontWeight: 600,
            fontFamily: 'monospace',
            color: '#111827',
            marginBottom: '4px',
          }}
        >
          {token.name}
        </div>
        <div
          style={{
            fontSize: '11px',
            fontFamily: 'monospace',
            color: '#6B7280',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onClick={() => onCopy(token.cssVar)}
          title="Click to copy"
        >
          {token.cssVar}
          <span style={{ fontSize: '10px' }}>📋</span>
        </div>
      </div>

      {/* Value */}
      <div>
        <div style={{ fontSize: '11px', color: '#9CA3AF', marginBottom: '2px' }}>Value</div>
        <div
          style={{
            fontSize: '12px',
            fontFamily: 'monospace',
            color: '#374151',
            cursor: 'pointer',
          }}
          onClick={() => onCopy(token.value)}
          title="Click to copy"
        >
          {token.value}
        </div>
      </div>

      {/* Metadata */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: '#EFF6FF',
            color: '#1E40AF',
            fontWeight: 600,
          }}
        >
          {token.level}
        </span>
        <span
          style={{
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            backgroundColor: '#F3F4F6',
            color: '#4B5563',
          }}
        >
          {token.type}
        </span>
        {token.category && (
          <span
            style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              backgroundColor: '#F3F4F6',
              color: '#4B5563',
            }}
          >
            {token.category}
          </span>
        )}
      </div>

      {/* Description */}
      {token.description && (
        <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4' }}>{token.description}</div>
      )}

      {/* Use Case */}
      {token.useCase && (
        <div>
          <div style={{ fontSize: '10px', color: '#9CA3AF', marginBottom: '2px' }}>Use Case</div>
          <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4' }}>{token.useCase}</div>
        </div>
      )}

      {/* WCAG Info */}
      {(token.wcagAALarge ?? token.wcagAAA) && (
        <div style={{ fontSize: '10px', color: '#059669', fontWeight: 600 }}>
          ✓ WCAG {token.wcagAAA ? 'AAA' : 'AA Large'}
        </div>
      )}
    </div>
  );
};

// Toast notification
const Toast = ({ message }: { message: string }) => (
  <div
    style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      backgroundColor: '#111827',
      color: '#ffffff',
      padding: '12px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: 500,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    }}
  >
    <span>✓</span>
    <span>Copied: {message}</span>
  </div>
);

/**
 * ## Interactive Token Browser
 *
 * Browse all tokens with search, filter, and copy functionality.
 */
export const InteractiveCatalog: Story = {
  render: () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('all');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const { copy, copied } = useCopyToClipboard();

    // Get available categories based on selected level
    const availableCategories = useMemo(() => {
      const tokensForLevel = selectedLevel === 'all' ? allTokens : allTokens.filter((t) => t.level === selectedLevel);

      return Array.from(new Set(tokensForLevel.map((t) => t.category))).sort();
    }, [selectedLevel]);

    // Reset category when level changes if the current category is not available
    React.useEffect(() => {
      if (selectedCategory !== 'all' && !availableCategories.includes(selectedCategory)) {
        setSelectedCategory('all');
      }
    }, [selectedLevel, availableCategories, selectedCategory]);

    // Filter tokens
    const filteredTokens = useMemo(() => {
      return allTokens.filter((token) => {
        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          const matchesName = token.name.toLowerCase().includes(query);
          const matchesCssVar = token.cssVar.toLowerCase().includes(query);
          const matchesValue = token.value.toLowerCase().includes(query);
          const matchesDescription = token.description?.toLowerCase().includes(query);

          if (!matchesName && !matchesCssVar && !matchesValue && !matchesDescription) {
            return false;
          }
        }

        // Level filter
        if (selectedLevel !== 'all' && token.level !== selectedLevel) {
          return false;
        }

        // Category filter
        if (selectedCategory !== 'all' && token.category !== selectedCategory) {
          return false;
        }

        return true;
      });
    }, [searchQuery, selectedLevel, selectedCategory]);

    // Get stats
    const stats = {
      total: allTokens.length,
      filtered: filteredTokens.length,
      primitive: allTokens.filter((t) => t.level === 'primitive').length,
      core: allTokens.filter((t) => t.level === 'core').length,
      semantic: allTokens.filter((t) => t.level === 'semantic').length,
      component: allTokens.filter((t) => t.level === 'component').length,
    };

    return (
      <div style={{ backgroundColor: '#F9FAFB', minHeight: '100vh' }}>
        <StoryContainer>
          {/* Header */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, marginBottom: '8px', color: '#111827' }}>Tokens Catalog</h1>
            <p style={{ fontSize: '16px', color: '#6B7280', marginBottom: '16px' }}>
              Browse and explore all {stats.total} design tokens in the Lufa Design System
            </p>

            {/* Stats */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                <span style={{ fontWeight: 600, color: '#3B82F6' }}>{stats.primitive}</span> Primitive
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                <span style={{ fontWeight: 600, color: '#8B5CF6' }}>{stats.core}</span> Core
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                <span style={{ fontWeight: 600, color: '#10B981' }}>{stats.semantic}</span> Semantic
              </div>
              <div style={{ fontSize: '14px', color: '#6B7280' }}>
                <span style={{ fontWeight: 600, color: '#F59E0B' }}>{stats.component}</span> Component
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '24px',
              marginBottom: '32px',
            }}
          >
            {/* Search */}
            <div style={{ marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search tokens by name, value, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '14px',
                  border: '1px solid #D1D5DB',
                  borderRadius: '6px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
              {/* Level Filter */}
              <div>
                <label
                  style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: '6px' }}
                >
                  Level
                </label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Levels</option>
                  <option value="primitive">Primitive ({stats.primitive})</option>
                  <option value="core">Core ({stats.core})</option>
                  <option value="semantic">Semantic ({stats.semantic})</option>
                  <option value="component">Component ({stats.component})</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label
                  style={{ fontSize: '12px', fontWeight: 600, color: '#6B7280', display: 'block', marginBottom: '6px' }}
                >
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '14px',
                    border: '1px solid #D1D5DB',
                    borderRadius: '6px',
                    backgroundColor: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <option value="all">All Categories</option>
                  {availableCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Clear Filters */}
              {(searchQuery || selectedLevel !== 'all' || selectedCategory !== 'all') && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedLevel('all');
                      setSelectedCategory('all');
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '14px',
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      backgroundColor: '#ffffff',
                      cursor: 'pointer',
                      color: '#6B7280',
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>

            {/* Results count */}
            <div style={{ marginTop: '16px', fontSize: '14px', color: '#6B7280' }}>
              Showing <span style={{ fontWeight: 600, color: '#111827' }}>{stats.filtered}</span> of {stats.total}{' '}
              tokens
            </div>
          </div>

          {/* Token Grid */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            {filteredTokens.map((token) => (
              <TokenCard key={token.name} token={token} onCopy={copy} />
            ))}
          </div>

          {/* Empty state */}
          {filteredTokens.length === 0 && (
            <div
              style={{
                textAlign: 'center',
                padding: '64px 32px',
                color: '#9CA3AF',
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
              <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>No tokens found</div>
              <div style={{ fontSize: '14px' }}>Try adjusting your search or filters</div>
            </div>
          )}

          {/* Toast */}
          {copied && <Toast message={copied} />}
        </StoryContainer>
      </div>
    );
  },
};
