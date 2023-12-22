import PageContainer from "@/components/containers/PageContainer"
import Paper, { PaperProps } from "../Paper"
import styles from "./Window.module.scss"

export interface WindowProps extends PaperProps {
    pageContainer?: boolean
}

export default function Window({
    children,
    className,
    pageContainer,
    themeColor,
    themeColorVariant,
    ...rest
}: WindowProps) {
    if (pageContainer) {
        return (
            <PageContainer
                className={`${styles.window ?? ""} ${
                    styles.pageContainer ?? ""
                } ${className ?? ""}`}
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
            noPadding
            themeColor={themeColor ?? "primary"}
            themeColorVariant={themeColorVariant ?? "font"}
            {...rest}
        >
            {children}
        </Paper>
    )
}
