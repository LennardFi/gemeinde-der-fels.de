import Website from "@/typings"
import InternalSkeleton, {
    SkeletonProps as InternalSkeletonProps,
} from "react-loading-skeleton"

import "react-loading-skeleton/dist/skeleton.css"

export interface SkeletonProps extends InternalSkeletonProps {
    theme?: Website.Design.ThemeColor
}

export default function Skeleton({
    style,
    theme = "primary",
    ...rest
}: SkeletonProps) {
    const baseColor =
        theme === "primary"
            ? "var(--color-primary)"
            : theme === "secondary"
              ? "var(--color-secondary)"
              : theme === "accent"
                ? "var(--color-accent)"
                : ""

    const highlightColor =
        theme === "primary"
            ? "var(--color-primary-highlighted)"
            : theme === "secondary"
              ? "var(--color-secondary-highlighted)"
              : theme === "accent"
                ? "var(--color-accent-highlighted)"
                : ""

    return (
        <InternalSkeleton
            baseColor={baseColor}
            highlightColor={highlightColor}
            style={{
                zIndex: "auto",
                ...style,
            }}
            {...rest}
        />
    )
}
