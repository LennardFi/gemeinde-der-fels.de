import { HTMLAttributes } from "react"
import Divider from "../surfaces/Divider"
import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./PageContainer.module.scss"

export interface PageContainerProps extends Omit<PaperProps, "max"> {
    autoWidth?: boolean
    title?: string
    titleLeftAligned?: boolean
    titlePaperProps?: PaperProps
    titleProps?: HTMLAttributes<HTMLHeadingElement>
}

export default function PageContainer({
    autoWidth,
    children,
    className,
    noPadding,
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
                className={`${styles.container} ${
                    noPadding ? styles.noPadding : ""
                } ${className ?? ""}`}
                max={!autoWidth}
                noPadding={noPadding}
                {...rest}
            >
                {title ? (
                    <Paper
                        className={`${styles.titlePaper} ${
                            titlePaperClassName ?? ""
                        }`}
                        noPadding={true}
                        {...titlePaperPropsRest}
                    >
                        <h1
                            {...titleProps}
                            className={`${
                                titleLeftAligned ? styles.titleLeftAligned : ""
                            } ${
                                titlePaperNoPadding ? styles.titleNoPadding : ""
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
