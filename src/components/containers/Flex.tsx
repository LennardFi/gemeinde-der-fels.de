"use client"

import useDeviceSize from "@/hooks/useDeviceSize"
import Website from "@/typings"
import React, { HTMLAttributes } from "react"
import styles from "./Flex.module.scss"

export interface FlexOptions {
    alignItems?: React.CSSProperties["alignItems"]
    columnGap?: React.CSSProperties["columnGap"]
    direction?: React.CSSProperties["flexDirection"]
    gap?: React.CSSProperties["gap"]
    justify?: React.CSSProperties["justifyContent"]
    rowGap?: React.CSSProperties["rowGap"]
    wrap?: React.CSSProperties["flexWrap"] | boolean
}

export type ResponsiveFlexOptions = {
    [B in Website.Base.Breakpoint]?: FlexOptions
}

export interface FlexProps
    extends FlexOptions,
        ResponsiveFlexOptions,
        HTMLAttributes<HTMLDivElement> {
    breakpoint?: Website.Base.Breakpoint
    transition?: boolean
}

export default function Flex({
    alignItems,
    breakpoint,
    children,
    className,
    columnGap,
    direction,
    gap,
    justify,
    large,
    normal,
    rowGap,
    small,
    style,
    tiny,
    transition,
    wrap,
    ...rest
}: FlexProps) {
    const deviceSize = useDeviceSize()

    const breakpointClassName =
        breakpoint === "large"
            ? styles.large
            : breakpoint === "normal"
              ? styles.normal
              : breakpoint === "small"
                ? styles.small
                : ""

    const flexOptions: FlexOptions = {
        alignItems,
        columnGap,
        direction,
        gap,
        justify,
        rowGap,
        wrap,
        ...(deviceSize === "tiny" ||
        deviceSize === "small" ||
        deviceSize === "normal" ||
        deviceSize === "large"
            ? tiny
            : undefined),
        ...(deviceSize === "small" ||
        deviceSize === "normal" ||
        deviceSize === "large"
            ? small
            : undefined),
        ...(deviceSize === "normal" || deviceSize === "large"
            ? normal
            : undefined),
        ...(deviceSize === "large" ? large : undefined),
    }

    return (
        <div
            className={`${styles.flex} ${breakpointClassName} ${
                transition ? styles.transition : ""
            } ${className ?? ""}`}
            style={{
                alignItems: flexOptions.alignItems,
                flexDirection: flexOptions.direction,
                columnGap:
                    typeof flexOptions.gap === "number"
                        ? `${flexOptions.gap * 8}px`
                        : gap ??
                          (typeof flexOptions.columnGap === "number"
                              ? `${flexOptions.columnGap * 8}px`
                              : flexOptions.columnGap),
                rowGap:
                    typeof flexOptions.gap === "number"
                        ? `${flexOptions.gap * 8}px`
                        : gap ??
                          (typeof flexOptions.rowGap === "number"
                              ? `${flexOptions.rowGap * 8}px`
                              : flexOptions.rowGap),
                justifyContent: flexOptions.justify,
                flexWrap:
                    flexOptions.wrap === true
                        ? "wrap"
                        : flexOptions.wrap === false
                          ? "nowrap"
                          : flexOptions.wrap,
                ...style,
            }}
            {...rest}
        >
            {children}
        </div>
    )
}
