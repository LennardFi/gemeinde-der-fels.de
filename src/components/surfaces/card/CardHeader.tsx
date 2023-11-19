import React, { HTMLAttributes } from "react"
import styles from "./CardHeader.module.scss"

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    /**
     * @default "span"
     */
    component?: "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
}

export default function CardHeader({
    className,
    component,
    ...rest
}: CardHeaderProps) {
    const componentOrDefault = component ?? "span"

    return React.createElement(componentOrDefault, {
        className: `${styles.header} ${className ?? ""}`,
        ...rest,
    })
}
