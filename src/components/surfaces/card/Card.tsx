import Website from "@/typings"
import React, { DetailedHTMLProps, HTMLAttributes } from "react"
import styles from "./Card.module.scss"

export type CardProps<T extends keyof HTMLElementTagNameMap> =
    DetailedHTMLProps<
        HTMLAttributes<HTMLElementTagNameMap[T]>,
        HTMLElementTagNameMap[T]
    > & {
        component?: T
        hover?: boolean
        /**
         * @default "primary"
         */
        themeColor?: Website.Design.ThemeColor
    }

export default function Card<T extends keyof HTMLElementTagNameMap = "div">({
    children,
    className,
    component,
    hover,
    themeColor,
    ...rest
}: CardProps<T>) {
    const componentOrDefault = component ?? "div"

    const themeColorClassName =
        themeColor === "secondary"
            ? styles.secondary
            : themeColor === "accent"
            ? styles.accent
            : styles.primary

    const addHoverClassName =
        hover ||
        (hover === undefined &&
            (componentOrDefault === "button" ||
                componentOrDefault === "a" ||
                componentOrDefault === "input"))

    return React.createElement(
        componentOrDefault,
        {
            className: `${styles.card} ${themeColorClassName ?? ""} ${
                addHoverClassName ? styles.hover : ""
            } ${className ?? ""}`,
            ...rest,
        },
        children,
    )
}
