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
    softLoader?: JSX.Element
    softTimeout?: number
    themeColor?: Website.Design.ThemeColor
    // /**
    //  * @default "bars"
    //  */
    // variant?: LoaderVariant
    width?: number | string
}

export default function Loader({
    className,
    softLoader,
    softTimeout,
    height,
    progress,
    style,
    themeColor,
    // variant,
    width,
    ...rest
}: LoaderProps) {
    const colorClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    // const variantOrDefault = variant ?? "bars"

    return (
        <div
            {...rest}
            className={`${styles.container} ${colorClassName ?? ""} ${
                className ?? ""
            }`}
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
