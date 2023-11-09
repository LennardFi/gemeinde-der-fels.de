import Website from "@/typings"
import { HTMLAttributes } from "react"
import { LoaderHeightWidthRadiusProps } from "react-spinners/helpers/props"
import ScaleLoader from "react-spinners/ScaleLoader"
import styles from "./Loader.module.scss"

// export type LoaderVariant = "circle" | "bars"

export interface LoaderProps extends HTMLAttributes<HTMLDivElement> {
    height?: number | string
    loaderProps?: LoaderHeightWidthRadiusProps
    progress?: number
    themeColor?: Website.Design.ThemeColor
    themeColorVariant?: Website.Design.ThemeColorVariant
    // /**
    //  * @default "bars"
    //  */
    // variant?: LoaderVariant
    width?: number | string
}

export default function Loader({
    className,
    height,
    progress,
    style,
    themeColor,
    themeColorVariant,
    width,
    ...rest
}: LoaderProps) {
    const colorClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    const colorVariantClassName =
        themeColorVariant === "faded"
            ? styles.faded
            : themeColorVariant === "font"
            ? styles.font
            : themeColorVariant === "font-faded"
            ? styles.fontFaded
            : themeColorVariant === "font-highlighted"
            ? styles.fontHighlighted
            : styles.highlighted

    // const variantOrDefault = variant ?? "bars"

    return (
        <div
            {...rest}
            className={`${styles.container ?? ""} ${colorClassName ?? ""} ${
                colorVariantClassName ?? ""
            } ${className ?? ""}`}
            style={{
                ...style,
            }}
        >
            <ScaleLoader
                className={styles.loader}
                margin={typeof width === "number" && width < 8 ? 1 : undefined}
                height={height}
                width={width}
            />
        </div>
    )
}
