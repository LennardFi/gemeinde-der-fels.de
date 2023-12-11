import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./Section.module.scss"

export interface SectionProps extends PaperProps {
    paperProps?: Omit<PaperProps, "themeColor">
}

export default function Section({
    breakpoint,
    children,
    className,
    noPadding,
    paperProps,
    themeColor,
    themeColorVariant,
    ...rest
}: SectionProps) {
    const breakpointClassName =
        breakpoint === "large"
            ? styles.large
            : breakpoint === "normal"
              ? styles.normal
              : breakpoint === "small"
                ? styles.small
                : breakpoint === "tiny"
                  ? styles.tiny
                  : ""

    return (
        <div
            className={`${styles.wrapper} ${breakpointClassName} ${
                noPadding ? styles.noPadding : ""
            } ${className ?? ""}`}
            data-theme={themeColor}
            data-theme-variant={themeColorVariant}
            {...rest}
        >
            {/* <div className={`${styles.startAdornment}`}>
                <div className={`${styles.shade} ${styles.shade1}`}></div>
                <div className={`${styles.shade} ${styles.shade2}`}></div>
                <div className={`${styles.shade} ${styles.shade3}`}></div>
            </div> */}

            <Paper
                className={`${paperProps?.className ?? ""} ${styles.paper}`}
                noPadding={noPadding}
                {...paperProps}
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
