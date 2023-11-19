import { HTMLAttributes } from "react"
import styles from "./WindowContent.module.scss"

export type WindowContentProps = HTMLAttributes<HTMLDivElement>

export default function WindowContent({
    children,
    className,
    ...rest
}: WindowContentProps) {
    return (
        <div className={`${styles.cardContent} ${className ?? ""}`} {...rest}>
            {children}
        </div>
    )
}
