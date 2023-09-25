import { HTMLAttributes } from "react"
import styles from "./CardContent.module.scss"

export type CardContentProps = HTMLAttributes<HTMLDivElement>

export default function CardContent({
    children,
    className,
    ...rest
}: CardContentProps) {
    return (
        <div className={`${styles.cardContent} ${className ?? ""}`} {...rest}>
            {children}
        </div>
    )
}
