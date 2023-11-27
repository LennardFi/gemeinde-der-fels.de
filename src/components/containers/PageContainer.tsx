import { HTMLAttributes } from "react"
import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./PageContainer.module.scss"

export interface PageContainerProps extends PaperProps {
    title?: string
    titleProps?: HTMLAttributes<HTMLHeadingElement>
}

export default function PageContainer({
    children,
    className,
    title,
    titleProps,
    ...rest
}: PageContainerProps) {
    return (
        <Paper className={`${styles.container} ${className ?? ""}`} {...rest}>
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
    )
}
