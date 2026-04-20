import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './Label.module.css';

/**
 * Label Component - Text Wrapper for Form Inputs
 *
 * A simple label component for form inputs to ensure accessibility and consistent styling.
 *
 * @example
 * ```tsx
 * <Label htmlFor="email">Email Address</Label>
 * <Input id="email" />
 * ```
 */

export type LabelProps<T extends ElementType = 'label'> = {
  /**
   * HTML element to render
   * @default 'label'
   */
  as?: T;

  /**
   * Additional CSS classes
   */
  className?: string;

  /**
   * Label content
   */
  children?: React.ReactNode;
};

type LabelComponentProps<T extends ElementType> = LabelProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof LabelProps<T>>;

const LabelImpl = <T extends ElementType = 'label'>(
  { as, className, children, ...props }: LabelComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  const Component = as ?? 'label';

  return (
    <Component ref={ref as React.Ref<never>} className={clsx(styles.label, className)} {...props}>
      {children}
    </Component>
  );
};

export const Label = forwardRef(LabelImpl) as (<T extends ElementType = 'label'>(
  props: LabelComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Label.displayName = 'Label';
