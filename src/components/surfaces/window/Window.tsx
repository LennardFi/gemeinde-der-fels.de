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
    ...rest
}: WindowProps) {
    if (pageContainer) {
        return (
            <PageContainer
                className={`${styles.paper ?? ""} ${className ?? ""}`}
                {...rest}
            >
                {children}
            </PageContainer>
        )
    }

    return (
        <Paper className={`${styles.paper ?? ""} ${className ?? ""}`} {...rest}>
            {children}
        </Paper>
    )
}
