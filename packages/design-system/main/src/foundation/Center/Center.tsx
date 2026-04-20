import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import type { BoxComponentProps, BoxProps } from '@foundation/Box/Box';
import { Box } from '@foundation/Box/Box';
import { clsx } from 'clsx';

import styles from './Center.module.css';

export type CenterProps<T extends ElementType = 'div'> = BoxProps<T> & {
  /**
   * If true, sets display to inline-flex
   */
  inline?: boolean;
};

type CenterComponentProps<T extends ElementType> = CenterProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CenterProps<T>>;

/**
 * Center Component
 *
 * A layout primitive that centers its content horizontally and vertically.
 * It is a shorthand for <Flex align="center" justify="center">.
 * Inherits all Box props including responsive visibility controls.
 *
 * @example
 * ```tsx
 * <Center>
 *   <Icon name="check" />
 * </Center>
 *
 * // Responsive visibility
 * <Center hide={{ base: true, sm: false }}>
 *   <DesktopCenteredContent />
 * </Center>
 * ```
 */
const CenterImpl = <T extends ElementType = 'div'>(
  { inline, className, ...props }: CenterComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  return (
    <Box<T>
      ref={ref as React.Ref<never>}
      className={clsx(styles.center, inline && styles.inline, className)}
      {...(props as BoxComponentProps<T>)}
    />
  );
};

export const Center = forwardRef(CenterImpl) as (<T extends ElementType = 'div'>(
  props: CenterComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Center.displayName = 'Center';
