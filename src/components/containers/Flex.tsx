import React, { HTMLAttributes } from "react"
import styles from "./Flex.module.scss"

export interface FlexProps extends HTMLAttributes<HTMLDivElement> {
    alignItems?: React.CSSProperties["alignItems"]
    direction?: React.CSSProperties["flexDirection"]
    gap?: React.CSSProperties["gap"]
    columnGap?: React.CSSProperties["columnGap"]
    rowGap?: React.CSSProperties["rowGap"]
    justify?: React.CSSProperties["justifyContent"]
    wrap?: React.CSSProperties["flexWrap"]
}

export default function Flex({
    alignItems,
    className,
    direction,
    gap,
    columnGap,
    rowGap,
    justify,
    wrap,
    style,
    ...rest
}: FlexProps) {
    return (
        <div
            className={`${styles.flex} ${className ?? ""}`}
            style={{
                alignItems: alignItems,
                flexDirection: direction,
                gap: typeof gap === "number" ? `${gap * 12}px` : gap,
                columnGap:
                    typeof columnGap === "number"
                        ? `${columnGap * 12}px`
                        : columnGap,
                rowGap:
                    typeof rowGap === "number" ? `${rowGap * 12}px` : rowGap,
                justifyContent: justify,
                flexWrap: wrap,
                ...style,
            }}
            {...rest}
        ></div>
    )
}
