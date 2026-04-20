import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import type { ResponsiveVisibilityProps } from '../../utils/responsive-visibility';
import { getResponsiveVisibilityClasses } from '../../utils/responsive-visibility';
import styles from './Box.module.css';

/**
 * Box Component - Universal Layout Primitive
 *
 * A flexible, polymorphic container component that serves as the foundation
 * for all layout compositions in the Lufa Design System v2.
 *
 * Features:
 * - Utility-based props for spacing, backgrounds, borders, and display
 * - Polymorphic `as` prop for semantic HTML elements
 * - Performance-optimized (CSS classes, not inline styles)
 * - Token-based design (semantic layer tokens)
 * - Responsive visibility control (show/hide props)
 *
 * @example
 * ```tsx
 * // Simple container
 * <Box padding="default" background="surface">
 *   Content
 * </Box>
 *
 * // Semantic section with custom styles
 * <Box as="section" padding="spacious" borderRadius="medium">
 *   <h2>Section Title</h2>
 * </Box>
 *
 * // Card-like layout
 * <Box
 *   padding="comfortable"
 *   background="surface"
 *   borderRadius="default"
 *   borderWidth="thin"
 *   borderColor="default"
 * >
 *   Card content
 * </Box>
 *
 * // Responsive visibility
 * <Box hideFrom="md">
 *   Mobile/tablet only content
 * </Box>
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * Spacing values based on semantic tokens
 * Maps to: --semantic-ui-spacing-{value}
 */
type SpacingValue = 'none' | 'tight' | 'compact' | 'default' | 'comfortable' | 'spacious';

/**
 * Background color values based on semantic tokens
 * Includes pattern "on-X" for WCAG AAA contrast
 */
type BackgroundValue =
  | 'page'
  | 'surface'
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'overlay'
  | 'on-primary'
  | 'on-secondary'
  | 'on-success'
  | 'on-error'
  | 'on-warning'
  | 'on-info';

/**
 * Border radius values based on semantic tokens
 * Maps to: --semantic-ui-radius-{value}
 */
type BorderRadiusValue = 'none' | 'small' | 'default' | 'medium' | 'large' | 'full';

/**
 * Border width values (fixed values)
 */
type BorderWidthValue = 'none' | 'thin' | 'medium' | 'thick';

/**
 * Border color values based on semantic tokens
 * Maps to: --semantic-ui-border-{value}
 */
type BorderColorValue = 'default' | 'strong' | 'success' | 'error' | 'warning' | 'info';

/**
 * Display values (CSS display property)
 */
type DisplayValue = 'block' | 'inline-block' | 'flex' | 'inline-flex' | 'grid' | 'none';

/**
 * Box component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type BoxProps<T extends ElementType = 'div'> = {
  /**
   * HTML element to render
   * @default 'div'
   */
  as?: T;

  // ==========================================
  // SPACING - Padding
  // ==========================================

  /**
   * Padding on all sides
   * @default undefined
   */
  padding?: SpacingValue;

  /**
   * Horizontal padding (left + right)
   * @default undefined
   */
  paddingX?: SpacingValue;

  /**
   * Vertical padding (top + bottom)
   * @default undefined
   */
  paddingY?: SpacingValue;

  /**
   * Padding top
   * @default undefined
   */
  paddingTop?: SpacingValue;

  /**
   * Padding right
   * @default undefined
   */
  paddingRight?: SpacingValue;

  /**
   * Padding bottom
   * @default undefined
   */
  paddingBottom?: SpacingValue;

  /**
   * Padding left
   * @default undefined
   */
  paddingLeft?: SpacingValue;

  // ==========================================
  // SPACING - Margin
  // ==========================================

  /**
   * Margin on all sides
   * @default undefined
   */
  margin?: SpacingValue;

  /**
   * Horizontal margin (left + right)
   * @default undefined
   */
  marginX?: SpacingValue;

  /**
   * Vertical margin (top + bottom)
   * @default undefined
   */
  marginY?: SpacingValue;

  /**
   * Margin top
   * @default undefined
   */
  marginTop?: SpacingValue;

  /**
   * Margin right
   * @default undefined
   */
  marginRight?: SpacingValue;

  /**
   * Margin bottom
   * @default undefined
   */
  marginBottom?: SpacingValue;

  /**
   * Margin left
   * @default undefined
   */
  marginLeft?: SpacingValue;

  // ==========================================
  // BACKGROUND
  // ==========================================

  /**
   * Background color (semantic tokens)
   * @default undefined
   */
  background?: BackgroundValue;

  // ==========================================
  // BORDER
  // ==========================================

  /**
   * Border radius (semantic tokens)
   * @default undefined
   */
  borderRadius?: BorderRadiusValue;

  /**
   * Border width (all sides)
   * @default undefined
   */
  borderWidth?: BorderWidthValue;

  /**
   * Border color (semantic tokens)
   * @default undefined
   */
  borderColor?: BorderColorValue;

  // ==========================================
  // DISPLAY
  // ==========================================

  /**
   * CSS display property
   * @default undefined (defaults to block for div)
   */
  display?: DisplayValue;

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
export type BoxComponentProps<T extends ElementType> = BoxProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof BoxProps<T>>;

// ============================================
// COMPONENT
// ============================================

/**
 * Box component with ref forwarding
 */
const BoxImpl = <T extends ElementType = 'div'>(
  {
    as,
    // Padding props
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    // Margin props
    margin,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    // Background
    background,
    // Border
    borderRadius,
    borderWidth,
    borderColor,
    // Display
    display,
    // Responsive visibility props
    show,
    hide,
    hideFrom,
    showFrom,
    // Standard HTML props
    className,
    children,
    ...htmlProps
  }: BoxComponentProps<T>,
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
  const boxClassName = clsx(
    // Padding utilities
    padding && styles[`padding-${padding}`],
    paddingX && styles[`paddingX-${paddingX}`],
    paddingY && styles[`paddingY-${paddingY}`],
    paddingTop && styles[`paddingTop-${paddingTop}`],
    paddingRight && styles[`paddingRight-${paddingRight}`],
    paddingBottom && styles[`paddingBottom-${paddingBottom}`],
    paddingLeft && styles[`paddingLeft-${paddingLeft}`],

    // Margin utilities
    margin && styles[`margin-${margin}`],
    marginX && styles[`marginX-${marginX}`],
    marginY && styles[`marginY-${marginY}`],
    marginTop && styles[`marginTop-${marginTop}`],
    marginRight && styles[`marginRight-${marginRight}`],
    marginBottom && styles[`marginBottom-${marginBottom}`],
    marginLeft && styles[`marginLeft-${marginLeft}`],

    // Background utilities
    background && styles[`background-${background}`],

    // Border utilities
    borderRadius && styles[`borderRadius-${borderRadius}`],
    borderWidth && styles[`borderWidth-${borderWidth}`],
    borderColor && styles[`borderColor-${borderColor}`],

    // Display utilities
    display && styles[`display-${display}`],

    // Responsive visibility utilities
    ...visibilityClasses,

    // Custom className
    className
  );

  return (
    <Component ref={ref as React.Ref<never>} className={boxClassName} {...htmlProps}>
      {children}
    </Component>
  );
};

// Forward ref with generic type support and displayName
export const Box = forwardRef(BoxImpl) as (<T extends ElementType = 'div'>(
  props: BoxComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
Box.displayName = 'Box';
