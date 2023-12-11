import PageContainer, {
    PageContainerProps,
} from "@/components/containers/PageContainer"
import Paper, { PaperProps } from "../Paper"
import styles from "./Window.module.scss"

export interface WindowProps extends PaperProps {
    pageContainer?: boolean
    pageContainerProps?: Omit<PageContainerProps, "title">
}

export default function Window({
    children,
    className,
    pageContainer,
    pageContainerProps,
    themeColor,
    themeColorVariant,
    ...rest
}: WindowProps) {
    if (pageContainer) {
        return (
            <PageContainer
                className={`${styles.window ?? ""} ${
                    styles.pageContainer ?? ""
                } ${pageContainerProps?.className ?? ""} ${className ?? ""}`}
                noPadding
                themeColor={themeColor ?? "primary"}
                themeColorVariant={themeColorVariant ?? "font"}
                {...rest}
            >
                {children}
            </PageContainer>
        )
    }

    return (
        <Paper
            className={`${styles.window ?? ""} ${className ?? ""}`}
            {...rest}
        >
            {children}
        </Paper>
    )
}
