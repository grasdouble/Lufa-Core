import type { ElementType } from 'react';
import { forwardRef } from 'react';
import type { BoxComponentProps } from '@foundation/Box/Box';
import { Box } from '@foundation/Box/Box';
import { clsx } from 'clsx';

import styles from './Grid.module.css';

export type GridProps<T extends ElementType = 'div'> = BoxComponentProps<T> & {
  /**
   * Number of columns
   */
  columns?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  /**
   * Gap between items (shorthand for row-gap and column-gap)
   */
  gap?: 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';
  /**
   * Column gap
   */
  gapX?: 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';
  /**
   * Row gap
   */
  gapY?: 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';
  /**
   * Align items (align-items)
   */
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
  /**
   * Justify items (justify-items)
   */
  justify?: 'start' | 'end' | 'center' | 'stretch';
  /**
   * If true, sets display to inline-grid
   */
  inline?: boolean;
};

/**
 * Grid Component
 *
 * A layout primitive for CSS Grid layouts.
 * Inherits all Box props including responsive visibility controls.
 *
 * @example
 * ```tsx
 * <Grid columns={2} gap="default">
 *   <div>Column 1</div>
 *   <div>Column 2</div>
 * </Grid>
 *
 * // Responsive visibility
 * <Grid hide={{ base: false, md: true }} columns={3}>
 *   <MobileGridItem />
 * </Grid>
 * ```
 */
const GridImpl = <T extends ElementType = 'div'>(
  { columns, gap, gapX, gapY, align, justify, inline, className, ...props }: GridProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  const gridClassName = clsx(
    styles.grid, // Base grid class
    columns && styles[`columns-${columns}`],
    gap && styles[`gap-${gap}`],
    gapX && styles[`gapX-${gapX}`],
    gapY && styles[`gapY-${gapY}`],
    align && styles[`align-${align}`],
    justify && styles[`justify-${justify}`],
    inline && styles.inline,
    className
  );

  return <Box<T> ref={ref as React.Ref<never>} className={gridClassName} {...(props as BoxComponentProps<T>)} />;
};

export const Grid = forwardRef(GridImpl) as (<T extends ElementType = 'div'>(
  props: GridProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Grid.displayName = 'Grid';
