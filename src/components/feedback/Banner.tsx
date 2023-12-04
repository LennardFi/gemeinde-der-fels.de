import Website from "@/typings"
import React, { HTMLAttributes } from "react"
import { FaExclamation, FaTimes } from "react-icons/fa"
import IconButton from "../inputs/IconButton"
import styles from "./Banner.module.scss"

export interface BannerProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    // actions?: { label: string; handler(): void }[]
    description?: React.ReactNode
    error?: boolean
    label?: string
    icon?: React.ReactNode
    onClose?(): void
    themeColor?: Website.Design.ThemeColor
}

export default function Banner({
    className,
    description,
    error,
    label,
    icon = error ? <FaExclamation /> : undefined,
    onClose,
    themeColor = error ? "secondary" : undefined,
    ...rest
}: BannerProps) {
    const themeColorStyle =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
              ? styles.secondary
              : styles.accent

    return (
        <div
            className={`${styles.banner} ${themeColorStyle} ${className ?? ""}`}
            {...rest}
        >
            {icon && <div className={`${styles.icon}`}>{icon}</div>}
            {label && <div className={`${styles.label}`}>{label}</div>}
            {onClose && (
                <IconButton
                    className={`${styles.closeButton}`}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        onClose()
                    }}
                    variant="contained"
                    themeColor={themeColor ?? "accent"}
                >
                    <FaTimes />
                </IconButton>
            )}
            {description && (
                <div className={`${styles.description}`}>{description}</div>
            )}
        </div>
    )
}
