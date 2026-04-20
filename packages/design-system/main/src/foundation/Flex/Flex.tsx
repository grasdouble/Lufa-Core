import type { ElementType } from 'react';
import { forwardRef } from 'react';
import type { BoxComponentProps } from '@foundation/Box/Box';
import { Box } from '@foundation/Box/Box';
import { clsx } from 'clsx';

import styles from './Flex.module.css';

export type FlexProps<T extends ElementType = 'div'> = BoxComponentProps<T> & {
  /**
   * Shorthand for flex-direction
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /**
   * Shorthand for flex-wrap
   */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /**
   * Shorthand for justify-content
   */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  /**
   * Shorthand for align-items
   */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  /**
   * Shorthand for gap (using semantic spacing tokens)
   */
  gap?: 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';
  /**
   * If true, sets display to inline-flex
   */
  inline?: boolean;
};

/**
 * Flex Component
 *
 * A layout primitive that extends Box with Flexbox properties.
 * Inherits all Box props including responsive visibility controls.
 *
 * @example
 * ```tsx
 * <Flex justify="between" align="center">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Flex>
 *
 * // Responsive visibility
 * <Flex showFrom="lg" justify="end">
 *   <DesktopToolbar />
 * </Flex>
 * ```
 */
const FlexImpl = <T extends ElementType = 'div'>(
  { direction, wrap, justify, align, gap, inline, className, ...props }: FlexProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  const flexClassName = clsx(
    styles.flex,
    direction && styles[`direction-${direction}`],
    wrap && styles[`wrap-${wrap}`],
    justify && styles[`justify-${justify}`],
    align && styles[`align-${align}`],
    gap && styles[`gap-${gap}`],
    inline && styles.inline,
    className
  );

  return <Box<T> ref={ref as React.Ref<never>} className={flexClassName} {...(props as BoxComponentProps<T>)} />;
};

export const Flex = forwardRef(FlexImpl) as (<T extends ElementType = 'div'>(
  props: FlexProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Flex.displayName = 'Flex';
