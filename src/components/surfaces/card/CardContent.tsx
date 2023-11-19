import React, { HTMLAttributes } from "react"
import styles from "./CardContent.module.scss"

export interface CardContentProps<
    T extends keyof HTMLElementTagNameMap = "div",
    E extends HTMLElementTagNameMap[T] = HTMLElementTagNameMap[T],
> extends HTMLAttributes<E> {
    component?: keyof HTMLElementTagNameMap
}

export default function CardContent({
    className,
    component,
    ...rest
}: CardContentProps) {
    const componentOrDefault = component ?? "div"

    return React.createElement(componentOrDefault, {
        className: `${styles.cardContent} ${className ?? ""}`,
        ...rest,
    })
}
