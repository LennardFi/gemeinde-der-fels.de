"use client"

import useDeviceSize from "@/hooks/useDeviceSize"
import Website from "@/typings"
import React, { HTMLAttributes } from "react"
import styles from "./Flex.module.scss"

export interface FlexOptions {
    alignItems?: React.CSSProperties["alignItems"]
    autoResize?: boolean
    breakpoint?: Website.Base.Breakpoint
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
    max?: boolean
    transition?: boolean
}

export default function Flex({
    alignItems,
    autoResize,
    breakpoint,
    children,
    className,
    columnGap,
    direction,
    gap,
    justify,
    large,
    max,
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

    const flexOptions: FlexOptions = {
        alignItems,
        autoResize,
        breakpoint,
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

    const breakpointClassName =
        flexOptions.breakpoint === "large"
            ? styles.large
            : flexOptions.breakpoint === "normal"
              ? styles.normal
              : flexOptions.breakpoint === "small"
                ? styles.small
                : flexOptions.breakpoint === "tiny"
                  ? styles.tiny
                  : ""

    return (
        <div
            className={`${styles.flex} ${breakpointClassName} ${
                autoResize ? styles.autoResize : ""
            } ${max ? styles.max : ""} ${transition ? styles.transition : ""} ${
                className ?? ""
            }`}
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
