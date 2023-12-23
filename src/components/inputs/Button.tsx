"use client"

import Website from "@/typings"
import React, { forwardRef, Ref } from "react"
import Loader from "../feedback/Loader"
import styles from "./Button.module.scss"

export interface ButtonRootProps {
    containedHover?: boolean
    fontColor?: boolean
    fullWidth?: boolean
    inline?: boolean
    labelProps?: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLSpanElement>,
        HTMLSpanElement
    >
    leftSegment?: React.ReactNode
    loading?: boolean
    noActiveAnimation?: boolean
    noFocusColor?: boolean
    rightSegment?: React.ReactNode
    round?: boolean
    themeColor?: Website.Design.ThemeColor
    variant?: Website.Design.Variant
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    ButtonRootProps

const Button = forwardRef(function Button(
    {
        children,
        className,
        containedHover,
        disabled,
        fontColor,
        fullWidth,
        inline,
        labelProps,
        leftSegment,
        loading,
        noActiveAnimation,
        noFocusColor,
        onClick,
        rightSegment,
        round,
        themeColor,
        type,
        variant,
        ...rest
    }: ButtonProps,
    ref: Ref<HTMLButtonElement>,
) {
    const variantOrDefault =
        variant ?? (type === "submit" ? "contained" : "text")

    const { className: customLabelClassName, ...customLabelPropsRest } = {
        className: undefined,
        ...labelProps,
    }

    return (
        <button
            // ${variantStyles} ${themeColorStyle}
            className={`${styles.button} ${fontColor ? styles.fontColor : ""} ${
                containedHover ? styles.containedHover : ""
            } ${noActiveAnimation ? styles.noActiveAnimation : ""} ${
                noFocusColor ? styles.noFocusColor : ""
            } ${fullWidth ? styles.fullWidth : ""} ${
                round ? styles.round : ""
            } ${inline ? styles.inline : ""} ${className ?? ""}`}
            data-theme={
                themeColor ?? (type !== "submit" ? "primary" : "secondary")
            }
            data-variant={variantOrDefault}
            disabled={disabled}
            onClick={disabled ? undefined : onClick}
            ref={ref}
            type={type ?? "button"}
            {...rest}
        >
            {leftSegment !== undefined ? (
                <span className={`${styles.segment}`}>{leftSegment}</span>
            ) : null}
            <span
                className={`${styles.label} ${customLabelClassName}`}
                {...customLabelPropsRest}
            >
                {loading ? (
                    <Loader
                        height="1rem"
                        themeColor={themeColor}
                        themeColorVariant="font"
                    />
                ) : (
                    children
                )}
            </span>
            {rightSegment !== undefined ? (
                <span className={`${styles.segment}`}>{rightSegment}</span>
            ) : null}
        </button>
    )
})

export default Button
