import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './Card.module.css';

/**
 * Card Component - Surface Container
 *
 * A container component to group content with a background, border, and shadow.
 *
 * @example
 * ```tsx
 * <Card>
 *   <Text>Card Content</Text>
 * </Card>
 * ```
 */

export type CardProps<T extends ElementType = 'div'> = {
  /**
   * HTML element to render
   * @default 'div'
   */
  as?: T;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Card content
   */
  children?: React.ReactNode;
};

type CardComponentProps<T extends ElementType> = CardProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CardProps<T>>;

const CardImpl = <T extends ElementType = 'div'>(
  { as, className, children, ...props }: CardComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  const Component = as ?? 'div';

  return (
    <Component ref={ref as React.Ref<never>} className={clsx(styles.card, className)} {...props}>
      {children}
    </Component>
  );
};

export const Card = forwardRef(CardImpl) as (<T extends ElementType = 'div'>(
  props: CardComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Card.displayName = 'Card';
