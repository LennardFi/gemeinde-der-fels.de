import { HTMLAttributes } from "react"
import Divider from "../surfaces/Divider"
import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./PageContainer.module.scss"

export interface PageContainerProps extends PaperProps {
    noPadding?: boolean
    title?: string
    titleProps?: HTMLAttributes<HTMLHeadingElement>
}

export default function PageContainer({
    children,
    className,
    noPadding,
    title,
    titleProps,
    ...rest
}: PageContainerProps) {
    return (
        <>
            <Divider variant="page" themeColor="transparent" />
            <Paper
                className={`${styles.container} ${
                    noPadding ? styles.noPadding : ""
                } ${className ?? ""}`}
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
