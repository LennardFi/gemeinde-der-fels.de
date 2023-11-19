import Website from "@/typings"
import React, { HTMLProps } from "react"
import styles from "./Paper.module.scss"

export interface PaperProps extends HTMLProps<HTMLDivElement> {
    breakpoint?: Website.Base.Breakpoint
    children?: React.ReactNode
    noBackgroundColor?: boolean
    themeColor?: Website.Design.ThemeColor
}

export default function Paper({
    breakpoint,
    children,
    className,
    noBackgroundColor,
    themeColor,
    ...rest
}: PaperProps) {
    const breakpointClassName =
        breakpoint === "large"
            ? styles.large
            : breakpoint === "normal"
            ? styles.normal
            : breakpoint === "small"
            ? styles.small
            : ""

    const themeColorClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : themeColor === "accent"
            ? styles.accent
            : ""

    return (
        <div
            className={`${styles.paper} ${breakpointClassName} ${
                themeColorClassName ?? ""
            } ${noBackgroundColor ? styles.noBackgroundColor : ""} ${
                className ?? ""
            }`}
            {...rest}
        >
            {children}
        </div>
    )
}
