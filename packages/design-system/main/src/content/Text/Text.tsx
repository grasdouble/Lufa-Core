import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './Text.module.css';

/**
 * Text Component - Typography Primitive
 *
 * A flexible, polymorphic typography component that provides consistent text styling
 * across the Lufa Design System v2.
 *
 * Features:
 * - Typography scale (h1-h6, body variants, caption, label)
 * - Semantic color values (primary, secondary, success, error, etc.)
 * - Font weight control (normal, medium, semibold, bold)
 * - Text alignment (left, center, right, justify)
 * - Text transformation (none, uppercase, lowercase, capitalize)
 * - Polymorphic `as` prop for semantic HTML elements
 * - Performance-optimized (CSS classes, not inline styles)
 * - Token-based design (semantic layer tokens)
 *
 * @example
 * ```tsx
 * // Heading
 * <Text variant="h1" weight="bold">
 *   Page Title
 * </Text>
 *
 * // Body text with color
 * <Text variant="body" color="secondary">
 *   This is a paragraph of body text.
 * </Text>
 *
 * // Label with uppercase
 * <Text variant="label" transform="uppercase" weight="semibold">
 *   Section Label
 * </Text>
 *
 * // Custom element with alignment
 * <Text as="span" variant="caption" align="center" color="muted">
 *   Footer caption
 * </Text>
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * Typography variant values (semantic scale)
 * Maps to: --lufa-semantic-typography-{variant}
 */
type VariantValue =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'body-large'
  | 'body'
  | 'body-small'
  | 'caption'
  | 'label';

/**
 * Text color values based on semantic tokens
 * Maps to: --lufa-semantic-ui-text-{color}
 */
type ColorValue = 'primary' | 'secondary' | 'tertiary' | 'success' | 'error' | 'warning' | 'info' | 'inverse';

/**
 * Font weight values
 * Maps to: font-weight CSS property
 */
type WeightValue = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Text alignment values
 * Maps to: text-align CSS property
 */
type AlignValue = 'left' | 'center' | 'right' | 'justify';

/**
 * Text transformation values
 * Maps to: text-transform CSS property
 */
type TransformValue = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

/**
 * Text component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type TextProps<T extends ElementType = 'p'> = {
  /**
   * HTML element to render
   * @default 'p'
   */
  as?: T;

  /**
   * Typography variant (semantic scale)
   * @default 'body'
   */
  variant?: VariantValue;

  /**
   * Text color (semantic colors)
   * @default 'primary'
   */
  color?: ColorValue;

  /**
   * Font weight
   * @default 'normal'
   */
  weight?: WeightValue;

  /**
   * Text alignment
   * @default 'left'
   */
  align?: AlignValue;

  /**
   * Text transformation
   * @default 'none'
   */
  transform?: TransformValue;

  /**
   * Additional CSS classes
   * @default undefined
   */
  className?: string;

  /**
   * Children elements
   */
  children?: React.ReactNode;
};

/**
 * Combined props type including element-specific props
 */
type TextComponentProps<T extends ElementType> = TextProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Text component with ref forwarding
 */
const TextImpl = <T extends ElementType = 'p'>(
  {
    as,
    variant = 'body',
    color = 'primary',
    weight = 'normal',
    align = 'left',
    transform = 'none',
    className,
    children,
    ...htmlProps
  }: TextComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Determine the element to render
  const Component = as ?? 'p';

  // Build className from utility props
  const textClassName = clsx(
    // Variant utilities
    variant && styles[`variant-${variant}`],

    // Color utilities
    color && styles[`color-${color}`],

    // Weight utilities
    weight && styles[`weight-${weight}`],

    // Alignment utilities
    align && styles[`align-${align}`],

    // Transform utilities
    transform && styles[`transform-${transform}`],

    // Custom className
    className
  );

  return (
    <Component ref={ref as React.Ref<never>} className={textClassName} {...htmlProps}>
      {children}
    </Component>
  );
};

// Forward ref with generic type support and displayName
export const Text = forwardRef(TextImpl) as (<T extends ElementType = 'p'>(
  props: TextComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Text.displayName = 'Text';
