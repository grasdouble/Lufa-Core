import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './VisuallyHidden.module.css';

export type VisuallyHiddenProps<T extends ElementType = 'span'> = {
  /**
   * The HTML element to render.
   * @default 'span'
   */
  as?: T;
  /**
   * The content to hide visually but keep accessible to screen readers.
   */
  children?: React.ReactNode;
  /**
   * Additional CSS classes.
   */
  className?: string;
} & Omit<ComponentPropsWithoutRef<T>, 'as' | 'children' | 'className'>;

/**
 * VisuallyHidden Component
 *
 * Hides content from the screen but keeps it accessible to screen readers.
 * Useful for accessibility labels, descriptions, and other non-visual content.
 *
 * @example
 * ```tsx
 * // Hide a label for a button with an icon
 * <button>
 *   <Icon name="close" />
 *   <VisuallyHidden>Close</VisuallyHidden>
 * </button>
 * ```
 */
const VisuallyHiddenImpl = <T extends ElementType = 'span'>(
  { as, children, className, ...props }: VisuallyHiddenProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  const Component = as ?? 'span';

  return (
    <Component ref={ref as React.Ref<never>} className={clsx(styles.root, className)} {...props}>
      {children}
    </Component>
  );
};

export const VisuallyHidden = forwardRef(VisuallyHiddenImpl) as (<T extends ElementType = 'span'>(
  props: VisuallyHiddenProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
VisuallyHidden.displayName = 'VisuallyHidden';
