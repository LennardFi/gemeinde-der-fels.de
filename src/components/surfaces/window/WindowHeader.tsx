import React, { HTMLAttributes } from "react"
import { FaBars } from "react-icons/fa"
import IconButton from "../../inputs/IconButton"
import styles from "./WindowHeader.module.scss"

export interface WindowHeaderProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    title: string
    action?: React.ReactNode
    actionHandler?: () => void
    icon?: React.ReactNode
    subTitle?: React.ReactNode
}

export default function WindowHeader({
    action,
    actionHandler,
    className,
    icon,
    subTitle,
    title,
    ...rest
}: WindowHeaderProps) {
    return (
        <div className={`${styles.header} ${className ?? ""}`} {...rest}>
            {icon !== undefined ? (
                <div className={styles.icon}>{icon}</div>
            ) : undefined}
            <div className={styles.titleSection}>
                <span className={styles.title}>{title}</span>
                <span
                    className={`${styles.subTitle} ${
                        !subTitle ? styles.noSubTitle ?? "" : ""
                    }`}
                >
                    {subTitle}
                </span>
            </div>
            {actionHandler !== undefined ? (
                <IconButton className={styles.action} onClick={actionHandler}>
                    {action ?? <FaBars />}
                </IconButton>
            ) : undefined}
        </div>
    )
}
