import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './Divider.module.css';

/**
 * Divider Component - Visual Separator
 *
 * A simple separator component for creating visual boundaries between content sections.
 * Can be rendered horizontally or vertically with configurable styling.
 *
 * Features:
 * - Horizontal and vertical orientation
 * - Five emphasis levels (subtle, default, moderate, strong, bold)
 * - Three spacing variants (compact, default, comfortable)
 * - Two line styles (solid, dashed)
 * - Token-based design (component layer tokens)
 * - WCAG 2.1 AA compliant
 * - Polymorphic rendering (hr by default for horizontal, div for vertical)
 *
 * @example
 * ```tsx
 * // Basic horizontal divider
 * <Divider />
 *
 * // Vertical divider
 * <Divider orientation="vertical" />
 *
 * // Subtle divider with compact spacing
 * <Divider emphasis="subtle" spacing="compact" />
 *
 * // Bold divider with dashed style
 * <Divider emphasis="bold" lineStyle="dashed" />
 *
 * // Strong divider with comfortable spacing
 * <Divider emphasis="strong" spacing="comfortable" />
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * Divider orientation
 */
type OrientationValue = 'horizontal' | 'vertical';

/**
 * Divider emphasis level (combines color and thickness)
 */
type EmphasisValue = 'subtle' | 'default' | 'moderate' | 'strong' | 'bold';

/**
 * Divider spacing (margin around the divider)
 */
type SpacingValue = 'compact' | 'default' | 'comfortable';

/**
 * Divider line style
 */
type LineStyleValue = 'solid' | 'dashed';

/**
 * Valid HTML elements for polymorphic rendering
 */
type ValidDividerElements = 'hr' | 'div';

/**
 * Divider component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type DividerProps<T extends ElementType = 'hr'> = {
  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: OrientationValue;

  /**
   * Visual emphasis level (combines color and thickness)
   * - subtle: Light color, 1px - minimal separation
   * - default: Default color, 1px - standard separation
   * - moderate: Default color, 2px - visible separation
   * - strong: Dark color, 2px - emphasized separation
   * - bold: Dark color, 4px - major section breaks
   * @default 'default'
   */
  emphasis?: EmphasisValue;

  /**
   * Spacing around the divider (margin)
   * @default 'default'
   */
  spacing?: SpacingValue;

  /**
   * Line style
   * @default 'solid'
   */
  lineStyle?: LineStyleValue;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * HTML element type to render
   * @default 'hr' for horizontal, 'div' for vertical
   */
  as?: T extends ValidDividerElements ? T : ValidDividerElements;
};

/**
 * Polymorphic props that merge DividerProps with element-specific props
 */
export type PolymorphicDividerProps<T extends ElementType = 'hr'> = DividerProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof DividerProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Divider - Visual separator component
 *
 * Creates a visual boundary between content sections.
 * Supports both horizontal and vertical orientations with customizable styling.
 */
const DividerImpl = <T extends ElementType = 'hr'>(
  {
    orientation = 'horizontal',
    emphasis = 'default',
    spacing = 'default',
    lineStyle = 'solid',
    className,
    as,
    ...props
  }: PolymorphicDividerProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Default element based on orientation
  const Component = (as ?? (orientation === 'horizontal' ? 'hr' : 'div')) as ElementType;

  // Generate CSS classes
  const dividerClasses = clsx(
    styles.divider,
    styles[`orientation-${orientation}`],
    styles[`emphasis-${emphasis}`],
    styles[`spacing-${spacing}`],
    styles[`line-style-${lineStyle}`],
    className
  );

  // ARIA attributes
  const ariaProps = {
    role: Component === 'div' ? 'separator' : undefined,
    'aria-orientation': orientation,
  };

  return <Component ref={ref as React.Ref<never>} className={dividerClasses} {...ariaProps} {...props} />;
};

// Forward ref with generic type support
export const Divider = forwardRef(DividerImpl) as (<T extends ElementType = 'hr'>(
  props: PolymorphicDividerProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement | null) & { displayName?: string };
Divider.displayName = 'Divider';

// ============================================
// TYPE EXPORTS
// ============================================

export type { OrientationValue, EmphasisValue, SpacingValue, LineStyleValue };
