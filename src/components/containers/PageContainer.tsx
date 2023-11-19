import Paper, { PaperProps } from "../surfaces/Paper"
import styles from "./PageContainer.module.scss"

export type PageContainerProps = PaperProps

export default function PageContainer({
    children,
    className,
    ...rest
}: PageContainerProps) {
    return (
        <Paper className={`${styles.container} ${className ?? ""}`} {...rest}>
            {children}
        </Paper>
    )
}
