import { HTMLAttributes } from "react"
import Divider from "../surfaces/Divider"
import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./PageContainer.module.scss"

export interface PageContainerProps extends PaperProps {
    title?: string
    titleLeftAligned?: boolean
    titlePaperProps?: PaperProps
    titleProps?: HTMLAttributes<HTMLHeadingElement>
}

export default function PageContainer({
    children,
    className,
    title,
    titleLeftAligned,
    titlePaperProps,
    titleProps,
    ...rest
}: PageContainerProps) {
    const {
        className: titlePaperClassName,
        noPadding: titlePaperNoPadding,
        ...titlePaperPropsRest
    } = titlePaperProps ?? {}
    return (
        <>
            <Divider variant="page" themeColor="transparent" />
            <Paper
                className={`${styles.container} ${className ?? ""}`}
                {...rest}
            >
                {title ? (
                    <Paper
                        className={`${styles.titlePaper} ${
                            titlePaperClassName ?? ""
                        }`}
                        noPadding={titlePaperNoPadding}
                        {...titlePaperPropsRest}
                    >
                        <h1
                            {...titleProps}
                            className={`${
                                titleLeftAligned ? styles.titleLeftAligned : ""
                            } ${
                                titlePaperNoPadding ? styles.titleNoMargin : ""
                            } ${titleProps?.className ?? ""}`}
                        >
                            {title}
                        </h1>
                    </Paper>
                ) : null}
                {children}
            </Paper>
            <Divider variant="page" themeColor="transparent" />
        </>
    )
}
