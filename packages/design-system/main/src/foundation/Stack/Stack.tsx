import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import type { ResponsiveVisibilityProps } from '../../utils/responsive-visibility';
import { getResponsiveVisibilityClasses } from '../../utils/responsive-visibility';
import styles from './Stack.module.css';

/**
 * Stack Component - Flexible Layout Primitive for Vertical/Horizontal Spacing
 *
 * A specialized layout component that automatically manages spacing between
 * child elements using Flexbox gap property. Stack is the recommended component
 * for creating consistent, maintainable layouts with proper spacing.
 *
 * Features:
 * - Direction control (vertical/horizontal)
 * - Gap-based spacing (using semantic tokens)
 * - Flexbox alignment (align-items and justify-content)
 * - Flex wrap support for responsive layouts
 * - Responsive visibility control (show/hide props)
 * - Polymorphic `as` prop for semantic HTML elements
 * - Performance-optimized (CSS classes, not inline styles)
 *
 * @example
 * ```tsx
 * // Vertical stack with default spacing
 * <Stack spacing="default">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Stack>
 *
 * // Horizontal navigation with centered items
 * <Stack direction="horizontal" spacing="comfortable" align="center">
 *   <a href="/home">Home</a>
 *   <a href="/about">About</a>
 *   <a href="/contact">Contact</a>
 * </Stack>
 *
 * // Wrapping grid with space-between
 * <Stack
 *   direction="horizontal"
 *   spacing="default"
 *   wrap
 *   justify="space-between"
 * >
 *   {items.map(item => <Card key={item.id} {...item} />)}
 * </Stack>
 *
 * // Responsive visibility
 * <Stack hideFrom="md" spacing="default">
 *   <MobileNav />
 * </Stack>
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * Layout direction for Stack
 * Maps to: flex-direction
 */
type DirectionValue = 'vertical' | 'horizontal';

/**
 * Spacing values based on semantic tokens
 * Maps to: gap using --semantic-ui-spacing-{value}
 */
type SpacingValue = 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';

/**
 * Alignment of children on cross-axis
 * Maps to: align-items
 */
type AlignValue = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/**
 * Justification of children on main-axis
 * Maps to: justify-content
 */
type JustifyValue = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

/**
 * Stack component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type StackProps<T extends ElementType = 'div'> = {
  /**
   * HTML element to render
   * @default 'div'
   */
  as?: T;

  /**
   * Layout direction
   * @default 'vertical'
   */
  direction?: DirectionValue;

  /**
   * Spacing between children (uses gap property)
   * @default 'default'
   */
  spacing?: SpacingValue;

  /**
   * Alignment of children on cross-axis
   * @default 'stretch'
   */
  align?: AlignValue;

  /**
   * Justification of children on main-axis
   * @default 'start'
   */
  justify?: JustifyValue;

  /**
   * Whether to wrap children when they overflow
   * @default false
   */
  wrap?: boolean;

  /**
   * Additional CSS classes
   * @default undefined
   */
  className?: string;

  /**
   * Children elements
   */
  children?: React.ReactNode;
} & ResponsiveVisibilityProps;

/**
 * Combined props type including element-specific props
 */
type StackComponentProps<T extends ElementType> = StackProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StackProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Stack component with ref forwarding
 */
const StackImpl = <T extends ElementType = 'div'>(
  {
    as,
    direction = 'vertical',
    spacing = 'default',
    align = 'stretch',
    justify = 'start',
    wrap = false,
    // Responsive visibility props
    show,
    hide,
    hideFrom,
    showFrom,
    // Standard HTML props
    className,
    children,
    ...htmlProps
  }: StackComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Determine the element to render
  const Component = as ?? 'div';

  // Get responsive visibility classes
  const visibilityClasses = getResponsiveVisibilityClasses({
    show,
    hide,
    hideFrom,
    showFrom,
  });

  // Build className from utility props
  const stackClassName = clsx(
    // Base flexbox display (always present)
    styles.stack,

    // Direction utilities
    direction && styles[`direction-${direction}`],

    // Spacing utilities (gap)
    spacing && styles[`spacing-${spacing}`],

    // Alignment utilities
    align && styles[`align-${align}`],

    // Justification utilities
    justify && styles[`justify-${justify}`],

    // Wrap utilities
    wrap && styles[`wrap-wrap`],
    !wrap && styles[`wrap-nowrap`],

    // Responsive visibility utilities
    ...visibilityClasses,

    // Custom className
    className
  );

  return (
    <Component ref={ref as React.Ref<never>} className={stackClassName} {...htmlProps}>
      {children}
    </Component>
  );
};

// Forward ref with generic type support and displayName
export const Stack = forwardRef(StackImpl) as (<T extends ElementType = 'div'>(
  props: StackComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Stack.displayName = 'Stack';
