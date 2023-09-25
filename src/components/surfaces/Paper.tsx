import Website from "@/typings"
import React, { HTMLProps } from "react"
import styles from "./Paper.module.scss"

export interface PaperProps extends HTMLProps<HTMLDivElement> {
    breakpoint?: Website.Base.Breakpoint
    children: React.ReactNode
}

export default function Paper({
    breakpoint,
    children,
    className,
    ...rest
}: PaperProps) {
    return (
        <div
            className={`${styles.paper} ${
                breakpoint === "large"
                    ? styles.large
                    : breakpoint === "normal"
                    ? styles.normal
                    : breakpoint === "small"
                    ? styles.small
                    : ""
            } ${className ?? ""}`}
            {...rest}
        >
            {children}
        </div>
    )
}
