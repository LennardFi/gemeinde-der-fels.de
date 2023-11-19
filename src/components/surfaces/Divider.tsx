import Website from "@/typings"
import { HTMLAttributes } from "react"
import styles from "./Divider.module.scss"

export type DividerVariant = "container" | "page"

export type TransparentThemeVariant = "full" | "half"

export interface DividerProps<
    C extends
        | Website.Design.ThemeColor
        | "transparent" = Website.Design.ThemeColor,
> extends HTMLAttributes<HTMLHRElement> {
    margin?: boolean
    themeColor?: C
    themeColorVariant?: C extends "transparent"
        ? TransparentThemeVariant
        : Website.Design.ThemeColorVariant
    variant?: DividerVariant
}

export default function Divider<
    C extends Website.Design.ThemeColor | "transparent",
>({
    margin,
    themeColor,
    themeColorVariant,
    variant,
    ...rest
}: DividerProps<C>) {
    const variantClassName = variant === "page" ? styles.page : styles.container

    const themeColorClassName =
        themeColor === "transparent"
            ? styles.transparent
            : themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    const themeColorVariantClassName =
        themeColor === "transparent"
            ? themeColorVariant === "half"
                ? styles.half
                : styles.full
            : themeColorVariant === "faded"
            ? styles.faded
            : themeColorVariant === "font"
            ? styles.font
            : themeColorVariant === "font-faded"
            ? styles.fontFaded
            : themeColorVariant === "font-highlighted"
            ? styles.fontHighlighted
            : themeColorVariant === "highlighted"
            ? styles.highlighted
            : styles.default

    return (
        <hr
            {...rest}
            className={`${styles.divider ?? ""} ${
                margin ? styles.margin : ""
            } ${variantClassName ?? ""} ${themeColorClassName ?? ""} ${
                themeColorVariantClassName ?? ""
            }`}
        />
    )
}
