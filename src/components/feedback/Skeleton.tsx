import Website from "@/typings"
import InternalSkeleton, {
    SkeletonProps as InternalSkeletonProps,
} from "react-loading-skeleton"

import "react-loading-skeleton/dist/skeleton.css"

export interface SkeletonProps extends InternalSkeletonProps {
    themeColor?: Website.Design.ThemeColor
    themeColorVariant?: Extract<
        Website.Design.ThemeColorVariant,
        "default" | "font"
    >
}

export default function Skeleton({
    style,
    themeColor = "primary",
    themeColorVariant = "default",
    ...rest
}: SkeletonProps) {
    const color =
        themeColor === "primary"
            ? "--color-primary"
            : themeColor === "secondary"
              ? "--color-secondary"
              : themeColor === "accent"
                ? "--color-accent"
                : ""

    return (
        <InternalSkeleton
            baseColor={`var(${color}${
                themeColorVariant === "font" ? "-font" : ""
            })`}
            highlightColor={`var(${color}${
                themeColorVariant === "font" ? "-font" : ""
            }-highlighted)`}
            style={{
                zIndex: "auto",
                ...style,
            }}
            {...rest}
        />
    )
}
