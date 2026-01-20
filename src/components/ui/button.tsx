import { ButtonHTMLAttributes, forwardRef } from "react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "small" | "medium" | "large";
  shape?: "default" | "circular" | "rounded";
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = "",
      variant = "primary",
      size = "medium",
      shape = "default",
      fullWidth = false,
      disabled = false,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      "inline-flex items-center justify-center font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed select-none cursor-pointer";

    // Variant styles
    const variantStyles = {
      primary:
        "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
      secondary:
        "bg-white text-gray-900 border border-gray-300 hover:border-gray-900 hover:bg-gray-50 focus:ring-gray-400",
      outline:
        "border border-gray-900 text-gray-900 bg-white hover:bg-gray-50 focus:ring-gray-500",
      ghost: "text-gray-900 hover:bg-gray-100 focus:ring-gray-400",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    };

    // Size styles based on shape
    const getSizeStyles = () => {
      if (shape === "circular") {
        // Circular buttons: square with equal width and height, minimal padding
        const circularSizes = {
          small: "w-8 h-8 p-0 text-xs",
          medium: "w-10 h-10 p-0 text-sm",
          large: "w-12 h-12 p-0 text-base",
        };
        return circularSizes[size];
      } else {
        // Non-circular buttons: height fixed, width auto with padding
        const defaultSizes = {
          small: "h-8 px-3 py-1.5 gap-1.5 text-xs",
          medium: "h-10 px-5 py-2.5 gap-2 text-sm",
          large: "h-12 px-7 py-3.5 gap-2.5 text-base",
        };
        return defaultSizes[size];
      }
    };

    // Shape styles
    const shapeStyles = {
      default: "rounded-lg",
      circular: "rounded-full",
      rounded: "rounded-xl",
    };

    // Width styles
    const widthStyles = fullWidth ? "w-full" : "";

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${getSizeStyles()} ${shapeStyles[shape]} ${widthStyles} ${className}`;

    return (
      <button
        ref={ref}
        className={combinedClassName}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
