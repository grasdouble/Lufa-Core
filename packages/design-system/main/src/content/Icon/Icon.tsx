import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Heart,
  Home,
  Info,
  Loader2,
  Menu,
  Minus,
  Plus,
  Save,
  Search,
  Settings,
  Star,
  Trash,
  Upload,
  User,
  X,
  XCircle,
} from 'lucide-react';

import styles from './Icon.module.css';

/**
 * Icon Component - SVG Icon Wrapper with Lucide React Integration
 *
 * A flexible icon component that provides uniform SVG rendering with semantic sizing
 * and coloring based on design tokens. Integrates with Lucide React icon library.
 *
 * Features:
 * - String-based icon name API (`<Icon name="user" />`)
 * - Size variants (xs, sm, md, lg, xl) using semantic tokens
 * - Semantic color values (currentColor, primary, secondary, success, error, etc.)
 * - Accessibility support (title prop for screen readers, aria-hidden for decorative)
 * - Polymorphic `as` prop for semantic HTML elements
 * - Performance-optimized (CSS classes, not inline styles)
 * - Token-based design (semantic layer tokens)
 *
 * @example
 * ```tsx
 * // Basic icon
 * <Icon name="user" />
 *
 * // Icon with size and color
 * <Icon name="check" size="lg" color="success" />
 *
 * // Accessible icon with title
 * <Icon name="alert-circle" color="error" title="Error notification" />
 *
 * // Decorative icon (no title)
 * <Icon name="chevron-right" size="sm" />
 * ```
 */

// ============================================
// ICON MAPPING
// ============================================

/**
 * Map of icon names to Lucide React components
 * Add new icons here as needed
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
const ICON_MAP = {
  // User & Navigation
  user: User,
  home: Home,
  settings: Settings,
  menu: Menu,
  search: Search,

  // Actions
  check: Check,
  x: X,
  plus: Plus,
  minus: Minus,
  edit: Edit,
  trash: Trash,
  save: Save,
  download: Download,
  upload: Upload,

  // Chevrons
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,

  // Arrows
  'arrow-left': ArrowLeft,
  'arrow-right': ArrowRight,

  // Status
  'alert-circle': AlertCircle,
  info: Info,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  loader: Loader2,

  // Miscellaneous
  'external-link': ExternalLink,
  eye: Eye,
  'eye-off': EyeOff,
  heart: Heart,
  star: Star,
} as const;
/* eslint-enable @typescript-eslint/no-unsafe-assignment */

/**
 * Valid icon names from the icon map
 */
export type IconName = keyof typeof ICON_MAP;

// ============================================
// TYPES
// ============================================

/**
 * Size variant values
 * Maps to: --lufa-semantic-ui-icon-{size}
 */
type SizeValue = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/**
 * Color variant values based on semantic tokens
 * Maps to: --lufa-semantic-ui-text-{color} or currentColor
 */
type ColorValue = 'currentColor' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | 'muted';

/**
 * Icon component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type IconProps<T extends ElementType = 'span'> = {
  /**
   * Icon name from Lucide React library
   * @see https://lucide.dev/icons
   */
  name: IconName;

  /**
   * HTML element to render as container
   * @default 'span'
   */
  as?: T;

  /**
   * Size variant
   * @default 'md'
   */
  size?: SizeValue;

  /**
   * Color variant (semantic colors)
   * @default 'currentColor'
   */
  color?: ColorValue;

  /**
   * Accessible title for the icon (screen readers)
   * If not provided, icon is decorative (aria-hidden="true")
   */
  title?: string;

  /**
   * Additional CSS classes
   * @default undefined
   */
  className?: string;
};

/**
 * Combined props type including element-specific props
 */
type IconComponentProps<T extends ElementType> = IconProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof IconProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Icon component with ref forwarding
 */
const IconImpl = <T extends ElementType = 'span'>(
  { as, name, size = 'md', color = 'currentColor', title, className, ...htmlProps }: IconComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Determine the element to render
  const Component = as ?? 'span';

  // Get the Lucide icon component
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const LucideIcon = ICON_MAP[name];

  // Guard: if icon name is not in map, render nothing or fallback
  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found in ICON_MAP. Available icons:`, Object.keys(ICON_MAP).join(', '));
    return null;
  }

  // Build className from utility props
  const iconClassName = clsx(
    // Base icon class
    styles.icon,

    // Size utilities
    size && styles[`size-${size}`],

    // Color utilities
    color && styles[`color-${color}`],

    // Custom className
    className
  );

  // Determine accessibility attributes
  const isDecorative = !title;
  const ariaHidden = isDecorative ? true : undefined;
  const role = !isDecorative ? 'img' : undefined;
  const ariaLabel = title ?? undefined;

  return (
    <Component
      ref={ref as React.Ref<never>}
      className={iconClassName}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      role={role}
      {...htmlProps}
    >
      <LucideIcon strokeWidth={2} aria-hidden="true" />
      {title && <span className={styles['visually-hidden']}>{title}</span>}
    </Component>
  );
};

// Forward ref with generic type support
// Note: Icon requires explicit typing due to required 'name' prop
export const Icon = forwardRef<Element, IconComponentProps<'span'>>(
  IconImpl as React.ForwardRefRenderFunction<Element, IconComponentProps<'span'>>
) as (<T extends ElementType = 'span'>(
  props: IconComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Icon.displayName = 'Icon';
