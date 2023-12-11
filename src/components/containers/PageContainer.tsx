import { HTMLAttributes } from "react"
import Divider from "../surfaces/Divider"
import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./PageContainer.module.scss"

export interface PageContainerProps extends PaperProps {
    title?: string
    titleProps?: HTMLAttributes<HTMLHeadingElement>
}

export default function PageContainer({
    children,
    className,
    themeColor,
    themeColorVariant,
    title,
    titleProps,
    ...rest
}: PageContainerProps) {
    return (
        <>
            <Divider variant="page" themeColor="transparent" />
            <Paper
                className={`${styles.container} ${className ?? ""}`}
                themeColor={themeColor ?? "primary"}
                themeColorVariant={
                    themeColor === undefined
                        ? themeColorVariant ?? "font"
                        : themeColorVariant
                }
                {...rest}
            >
                {title ? (
                    <h1
                        {...titleProps}
                        // className={`${styles.pageTitle} ${titleProps?.className ?? ""}`}
                    >
                        {title}
                    </h1>
                ) : null}
                {children}
            </Paper>
            <Divider variant="page" themeColor="transparent" />
        </>
    )
}
