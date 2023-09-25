import React, { HTMLAttributes } from "react"
import { FaBars } from "react-icons/fa"
import IconButton from "../../inputs/IconButton"
import styles from "./CardHeader.module.scss"

export interface CardHeaderProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    title: string
    action?: React.ReactNode
    actionHandler?: () => void
    icon?: React.ReactNode
    subTitle?: React.ReactNode
}

export default function CardHeader({
    action,
    actionHandler,
    className,
    icon,
    subTitle,
    title,
    ...rest
}: CardHeaderProps) {
    return (
        <div className={`${styles.header} ${className ?? ""}`} {...rest}>
            {icon !== undefined ? (
                <div className={styles.icon}>{icon}</div>
            ) : undefined}
            <div className={styles.titleSection}>
                <span className={styles.title}>{title}</span>
                <span className={styles.subTitle}>{subTitle}</span>
            </div>
            {actionHandler !== undefined ? (
                <IconButton className={styles.action}>
                    {action ?? <FaBars />}
                </IconButton>
            ) : undefined}
        </div>
    )
}
