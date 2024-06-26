import Website from "@/typings"
import { HTMLAttributes } from "react"
import styles from "./Paper.module.scss"

export interface PaperProps extends HTMLAttributes<HTMLDivElement> {
    breakpoint?: Website.Base.Breakpoint
    max?: boolean
    noPadding?: boolean
    themeColor?: Website.Design.ThemeColor
    themeColorVariant?: Website.Design.ThemeColorVariant
}

export default function Paper({
    breakpoint,
    children,
    className,
    max,
    noPadding,
    themeColor,
    themeColorVariant,
    ...rest
}: PaperProps) {
    const breakpointClassName =
        breakpoint === "large"
            ? styles.large
            : breakpoint === "normal"
              ? styles.normal
              : breakpoint === "small"
                ? styles.small
                : breakpoint === "tiny"
                  ? styles.tiny
                  : ""

    return (
        <div
            className={`${styles.paper} ${breakpointClassName} ${
                noPadding ? styles.noPadding : ""
            } ${max ? styles.max : ""} ${className ?? ""}`}
            data-theme={themeColor}
            data-theme-variant={themeColorVariant}
            {...rest}
        >
            {children}
        </div>
    )
}
