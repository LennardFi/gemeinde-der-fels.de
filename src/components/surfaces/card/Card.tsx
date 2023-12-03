import { HTMLAttributes } from "react"
import styles from "./Card.module.scss"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean
}

export default function Card({
    children,
    className,
    hover,
    ...rest
}: CardProps) {
    // const themeColorClassName =
    //     themeColor === "secondary"
    //         ? styles.secondary
    //         : themeColor === "accent"
    //           ? styles.accent
    //           : styles.primary

    return (
        <div
            className={`${styles.card} ${hover ? styles.hover : ""} ${
                className ?? ""
            }`}
            {...rest}
        >
            <div className={`${styles.wrapper}`}>{children}</div>
        </div>
    )
}
