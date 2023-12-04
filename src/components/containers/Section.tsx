import Website from "@/typings"
import { HTMLAttributes } from "react"
import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./Section.module.scss"

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
    paperProps?: PaperProps
    themeColor?: Website.Design.ThemeColor
    fullWidth?: boolean
}

export default function Section({
    children,
    className,
    fullWidth,
    paperProps,
    themeColor = "primary",
    ...rest
}: SectionProps) {
    return (
        <div
            className={`${styles.wrapper} ${
                fullWidth ? styles.fullWidth : ""
            } ${className ?? ""}`}
            data-theme={themeColor}
            {...rest}
        >
            {/* <div className={`${styles.startAdornment}`}>
                <div className={`${styles.shade} ${styles.shade1}`}></div>
                <div className={`${styles.shade} ${styles.shade2}`}></div>
                <div className={`${styles.shade} ${styles.shade3}`}></div>
            </div> */}

            <Paper
                {...paperProps}
                className={`${paperProps?.className ?? ""} ${styles.paper}`}
                themeColor={paperProps?.themeColor ?? themeColor}
            >
                {children}
            </Paper>

            {/* <div className={`${styles.endAdornment}`}>
                <div className={`${styles.shade} ${styles.shade1}`}></div>
                <div className={`${styles.shade} ${styles.shade2}`}></div>
                <div className={`${styles.shade} ${styles.shade3}`}></div>
            </div> */}
        </div>
    )
}
