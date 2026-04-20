import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import type { IconName } from '@content/Icon';
import { Icon } from '@content/Icon';
import { clsx } from 'clsx';

import styles from './Button.module.css';

/**
 * Button Component - Interactive Action Element
 *
 * A versatile button component with multiple types, variants, sizes, and states.
 * Supports polymorphic rendering for both button and link elements.
 *
 * Features:
 * - Three types (solid, outline, ghost)
 * - Seven variants (primary, secondary, success, danger, warning, info, neutral)
 * - Three sizes (sm, md, lg) with semantic token-based dimensions
 * - Icon support (left, right, or icon-only)
 * - Loading state with spinner animation
 * - Disabled state with proper accessibility
 * - Full width option
 * - Polymorphic rendering (button or anchor element)
 * - WCAG 2.1 AA compliant
 * - Token-based design (component layer tokens)
 *
 * @example
 * ```tsx
 * // Basic button
 * <Button type="solid" variant="primary" size="md">Click me</Button>
 *
 * // Outline button
 * <Button type="outline" variant="secondary">Outline</Button>
 *
 * // Button with icon
 * <Button type="solid" variant="success" iconLeft="check">Save</Button>
 *
 * // Loading state
 * <Button type="solid" variant="primary" loading>Saving...</Button>
 *
 * // As a link
 * <Button as="a" href="/home" type="ghost" variant="neutral">Home</Button>
 *
 * // Icon-only button
 * <Button type="ghost" variant="primary" iconLeft="search" aria-label="Search" />
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * Button type values - visual style approach
 */
type TypeValue = 'solid' | 'outline' | 'ghost';

/**
 * Button variant values - semantic color intention
 */
type VariantValue = 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'neutral';

/**
 * Button size values
 */
type SizeValue = 'sm' | 'md' | 'lg';

/**
 * Button radius values
 */
type RadiusValue = 'none' | 'sm' | 'base' | 'md' | 'full';

/**
 * Button component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type ButtonProps<T extends ElementType = 'button'> = {
  /**
   * Visual style type
   * @default 'solid'
   */
  type?: TypeValue;

  /**
   * Semantic color variant
   * @default 'primary'
   */
  variant?: VariantValue;

  /**
   * Size variant
   * @default 'md'
   */
  size?: SizeValue;

  /**
   * Border radius variant
   * @default 'base' (inherited from base class)
   */
  radius?: RadiusValue;

  /**
   * Icon to display on the left side
   * @default undefined
   */
  iconLeft?: IconName;

  /**
   * Icon to display on the right side
   * @default undefined
   */
  iconRight?: IconName;

  /**
   * Loading state - shows spinner and disables interaction
   * @default false
   */
  loading?: boolean;

  /**
   * Disabled state - prevents interaction
   * @default false
   */
  disabled?: boolean;

  /**
   * Full width button (stretches to 100% of container)
   * @default false
   */
  fullWidth?: boolean;

  /**
   * HTML element to render
   * @default 'button'
   */
  as?: T;

  /**
   * Button content (text or other React nodes)
   * Optional for icon-only buttons
   */
  children?: React.ReactNode;

  /**
   * Additional CSS classes
   * @default undefined
   */
  className?: string;
};

/**
 * Combined props type including element-specific props
 */
type ButtonComponentProps<T extends ElementType> = ButtonProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Button component with ref forwarding
 */
const ButtonImpl = <T extends ElementType = 'button'>(
  {
    as,
    type = 'solid',
    variant = 'primary',
    size = 'md',
    radius,
    iconLeft,
    iconRight,
    loading = false,
    disabled = false,
    fullWidth = false,
    children,
    className,
    ...htmlProps
  }: ButtonComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Determine the element to render
  const Component = as ?? 'button';

  // Compute final disabled state (disabled or loading)
  const isDisabled = disabled || loading;

  // Build className from utility props
  const buttonClassName = clsx(
    // Base button class
    styles.button,

    // Type utilities
    type && styles[`type-${type}`],

    // Variant utilities
    variant && styles[`variant-${variant}`],

    // Size utilities
    size && styles[`size-${size}`],

    // Radius utilities (optional override)
    radius && styles[`radius-${radius}`],

    // Full width
    fullWidth && styles.fullWidth,

    // States
    isDisabled && styles.disabled,
    loading && styles.loading,

    // Custom className
    className
  );

  // Determine proper button attributes based on element type
  const elementSpecificProps =
    Component === 'button'
      ? {
          type: (htmlProps as ComponentPropsWithoutRef<'button'>).type ?? 'button',
          disabled: isDisabled,
        }
      : {};

  // Accessibility attributes
  const ariaProps = {
    'aria-disabled': isDisabled ? true : undefined,
    'aria-busy': loading ? true : undefined,
  };

  // Determine if this is an icon-only button (no text children)
  const isIconOnly = !children && (iconLeft ?? iconRight);

  return (
    <Component
      ref={ref as React.Ref<never>}
      className={buttonClassName}
      {...elementSpecificProps}
      {...ariaProps}
      {...htmlProps}
    >
      {/* Loading spinner (replaces left icon) */}
      {loading && <Icon name="loader" size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'} aria-hidden="true" />}

      {/* Left icon (only if not loading) */}
      {!loading && iconLeft && (
        <Icon name={iconLeft} size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'} aria-hidden="true" />
      )}

      {/* Button text content */}
      {children && <span>{children}</span>}

      {/* Right icon */}
      {iconRight && (
        <Icon name={iconRight} size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'} aria-hidden="true" />
      )}

      {/* Screen reader text for icon-only buttons in loading state */}
      {isIconOnly && loading && <span className={styles['visually-hidden']}>Loading</span>}
    </Component>
  );
};

// Forward ref with generic type support
export const Button = forwardRef(ButtonImpl) as (<T extends ElementType = 'button'>(
  props: ButtonComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Button.displayName = 'Button';
