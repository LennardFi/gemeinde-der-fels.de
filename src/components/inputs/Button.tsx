import Website from "@/typings"
import React from "react"
import styles from "./Button.module.scss"

export interface ButtonRootProps {
    disabled?: boolean
    labelProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
    >
    leftSegment?: React.ReactNode
    noActiveAnimation?: boolean
    noFocusColor?: boolean
    rightSegment?: React.ReactNode
    round?: boolean
    themeColor?: Website.Design.ThemeColor
    variant?: Website.Design.Variant
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonRootProps

export default function Button({
    children,
    className,
    disabled,
    labelProps,
    leftSegment,
    noActiveAnimation,
    noFocusColor,
    onClick,
    rightSegment,
    round,
    themeColor,
    type,
    variant = type === "submit" ? "contained" : undefined,
    ...rest
}: ButtonProps) {
    const variantStyles =
        variant === "contained"
            ? styles.contained
            : variant === "outlined"
            ? styles.outlined
            : ""

    const themeColorStyle =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : themeColor === "accent"
            ? styles.accent
            : ""

    const { className: customLabelClassName, ...customLabelPropsRest } = {
        className: undefined,
        ...labelProps,
    }

    return (
        <button
            className={`${styles.button} ${variantStyles} ${themeColorStyle} ${
                noActiveAnimation ? styles.noActiveAnimation : ""
            } ${noFocusColor ? styles.noFocusColor : ""} ${
                disabled ? styles.disabled : ""
            } ${round ? styles.round : ""} ${className}`}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            type={type ?? "button"}
            {...rest}
        >
            {leftSegment !== undefined ? (
                <span className={`${styles.segment} ${styles.left}`}>
                    {leftSegment}
                </span>
            ) : null}
            <span
                className={`${styles.label} ${customLabelClassName}`}
                {...customLabelPropsRest}
            >
                {children}
            </span>
            {rightSegment !== undefined ? (
                <span className={`${styles.segment} ${styles.right}`}>
                    {rightSegment}
                </span>
            ) : null}
        </button>
    )
}
