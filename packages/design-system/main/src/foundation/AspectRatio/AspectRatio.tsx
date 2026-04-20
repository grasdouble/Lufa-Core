import type { ComponentPropsWithoutRef, ElementType } from 'react';
import { forwardRef } from 'react';
import { clsx } from 'clsx';

import styles from './AspectRatio.module.css';

/**
 * AspectRatio Component - Responsive Media Container
 *
 * A container component that maintains a specific aspect ratio for its content,
 * ensuring responsive scaling while preserving proportions. Essential for images,
 * videos, and other media that needs consistent sizing.
 *
 * Features:
 * - Maintains aspect ratio using CSS padding-top technique
 * - Supports common ratios (16:9, 4:3, 1:1, etc.) and custom values
 * - Absolutely positions children to fill container
 * - Polymorphic `as` prop for semantic HTML elements
 * - Performance-optimized (CSS classes, not inline styles)
 * - Works with any child content (images, videos, iframes, etc.)
 *
 * @example
 * ```tsx
 * // 16:9 video container
 * <AspectRatio ratio={16/9}>
 *   <iframe src="https://youtube.com/embed/..." />
 * </AspectRatio>
 *
 * // Square image container
 * <AspectRatio ratio={1}>
 *   <img src="image.jpg" alt="Square image" />
 * </AspectRatio>
 *
 * // 4:3 photo container
 * <AspectRatio ratio={4/3}>
 *   <img src="photo.jpg" alt="4:3 photo" />
 * </AspectRatio>
 *
 * // Custom ratio with semantic element
 * <AspectRatio as="figure" ratio={21/9}>
 *   <img src="ultrawide.jpg" alt="Ultrawide banner" />
 * </AspectRatio>
 * ```
 */

// ============================================
// TYPES
// ============================================

/**
 * AspectRatio component props
 *
 * Generic type T allows proper typing when using `as` prop
 */
export type AspectRatioProps<T extends ElementType = 'div'> = {
  /**
   * HTML element to render
   * @default 'div'
   */
  as?: T;

  /**
   * Aspect ratio (width/height)
   * Common values:
   * - 16/9 (1.777...) - Standard widescreen video
   * - 4/3 (1.333...) - Classic photo/video
   * - 3/2 (1.5) - Classic photography
   * - 1 - Square
   * - 9/16 (0.5625) - Vertical/portrait video
   * - 21/9 (2.333...) - Ultrawide
   *
   * @default 16/9
   */
  ratio?: number;

  /**
   * Additional CSS classes
   * @default undefined
   */
  className?: string;

  /**
   * Children elements (will be absolutely positioned to fill container)
   */
  children?: React.ReactNode;
};

/**
 * Combined props type including element-specific props
 */
export type AspectRatioComponentProps<T extends ElementType> = AspectRatioProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof AspectRatioProps<T>>;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate padding-top percentage from aspect ratio
 * For 16:9 ratio (1.777...), returns 56.25%
 * For 4:3 ratio (1.333...), returns 75%
 * For 1:1 ratio, returns 100%
 */
const calculatePaddingTop = (ratio: number): string => {
  const percentage = (1 / ratio) * 100;
  return `${percentage}%`;
};

/**
 * Map common ratio values to CSS utility classes
 * This allows pre-generated CSS for common ratios
 */
const getRatioClassName = (ratio: number): string | null => {
  // Round to 4 decimal places for comparison
  const normalized = Math.round(ratio * 10000) / 10000;

  const ratioMap: Record<number, string> = {
    1.7778: 'ratio-16-9', // 16/9
    1.3333: 'ratio-4-3', // 4/3
    1.5: 'ratio-3-2', // 3/2
    1: 'ratio-1-1', // 1/1 (square)
    0.5625: 'ratio-9-16', // 9/16 (portrait)
    2.3333: 'ratio-21-9', // 21/9 (ultrawide)
    0.75: 'ratio-3-4', // 3/4 (portrait photo)
  };

  return ratioMap[normalized] || null;
};

// ============================================
// COMPONENT
// ============================================

/**
 * AspectRatio component with ref forwarding
 */
const AspectRatioImpl = <T extends ElementType = 'div'>(
  { as, ratio = 16 / 9, className, children, style, ...htmlProps }: AspectRatioComponentProps<T>,
  ref: React.ForwardedRef<Element>
) => {
  // Determine the element to render
  const Component = as ?? 'div';

  // Try to get pre-generated CSS class for common ratios
  const ratioClassName = getRatioClassName(ratio);

  // Build className from utility props
  const aspectRatioClassName = clsx(
    // Base class (provides position: relative)
    styles['aspect-ratio'],

    // Use pre-generated class if available
    ratioClassName && styles[ratioClassName],

    // Custom className
    className
  );

  // For custom ratios not in the pre-generated map, use inline style
  const customStyle: React.CSSProperties | undefined =
    !ratioClassName && ratio
      ? {
          '--aspect-ratio-padding': calculatePaddingTop(ratio),
          ...style,
        }
      : style;

  return (
    <Component ref={ref as React.Ref<never>} className={aspectRatioClassName} style={customStyle} {...htmlProps}>
      <div className={styles['aspect-ratio-content']}>{children}</div>
    </Component>
  );
};

// Forward ref with generic type support and displayName
export const AspectRatio = forwardRef(AspectRatioImpl) as (<T extends ElementType = 'div'>(
  props: AspectRatioComponentProps<T> & { ref?: React.Ref<React.ComponentRef<T>> }
) => React.ReactElement) & { displayName?: string };
AspectRatio.displayName = 'AspectRatio';
