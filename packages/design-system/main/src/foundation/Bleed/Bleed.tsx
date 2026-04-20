import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './Bleed.module.css';

/**
 * Bleed Component - Layout Primitive for Breaking Container Constraints
 *
 * A specialized layout component that allows content to "bleed" beyond its parent
 * container's boundaries. Essential for content-focused layouts (blogs, documentation)
 * and marketing pages where you need full-width images or sections within constrained
 * containers.
 *
 * Features:
 * - Inline bleed (horizontal): numeric spacing units or "full" for 100vw
 * - Block bleed (vertical): numeric spacing units for vertical bleed
 * - Polymorphic `as` prop for semantic HTML elements
 * - CSS-based implementation (no JavaScript calculations)
 *
 * @example
 * ```tsx
 * // Full-width image in narrow prose container
 * <Container size="md">
 *   <Text>Article content...</Text>
 *   <Bleed inline="full">
 *     <img src="hero.jpg" alt="Hero" />
 *   </Bleed>
 * </Container>
 *
 * // Partial bleed using spacing units
 * <Container>
 *   <Bleed inline={8}>
 *     <Box bg="accent" p={6}>
 *       <Callout>Featured content</Callout>
 *     </Box>
 *   </Bleed>
 * </Container>
 *
 * // Block bleed (vertical)
 * <Bleed inline={16} block={8}>
 *   <Image src="feature.jpg" />
 * </Bleed>
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * Spacing scale values matching design tokens
 */
type SpacingValue = 0 | 4 | 8 | 12 | 16 | 24 | 32 | 40 | 48 | 64 | 80 | 96;

/**
 * Inline bleed value - either a spacing unit or "full" for 100vw
 */
type InlineValue = SpacingValue | 'full';

/**
 * Block bleed value - spacing units only
 */
type BlockValue = SpacingValue;

/**
 * Bleed component props
 */
export type BleedProps<T extends ElementType = 'div'> = {
  /**
   * HTML element to render
   * @default 'div'
   */
  as?: T;

  /**
   * Horizontal bleed (inline axis)
   * - Numeric values use negative margins with spacing tokens
   * - "full" uses 100vw technique to bleed to viewport edges
   * @default undefined
   */
  inline?: InlineValue;

  /**
   * Vertical bleed (block axis)
   * - Numeric values use negative margins with spacing tokens
   * @default undefined
   */
  block?: BlockValue;

  /**
   * Additional CSS classes
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
type BleedComponentProps<T extends ElementType> = BleedProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BleedProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Bleed component with ref forwarding
 */
const BleedImpl = <T extends ElementType = 'div'>(
  { as, inline, block, className, children, ...htmlProps }: BleedComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Determine the element to render
  const Component = as ?? 'div';

  // Build className from utility props
  const bleedClassName = clsx(
    // Base class
    styles.bleed,

    // Inline bleed class
    inline === 'full' ? styles['inline-full-base'] : styles[`inline-${inline}`],

    // Block bleed class
    block !== undefined && styles[`block-${block}`],

    // Custom className
    className
  );

  return (
    <Component ref={ref as React.Ref<never>} className={bleedClassName} {...htmlProps}>
      {children}
    </Component>
  );
};

// Forward ref with generic type support and displayName
export const Bleed = forwardRef(BleedImpl) as (<T extends ElementType = 'div'>(
  props: BleedComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Bleed.displayName = 'Bleed';
