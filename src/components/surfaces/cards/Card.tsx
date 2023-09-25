import Paper, { PaperProps } from "../Paper"
import styles from "./Card.module.scss"

export type CardProps = PaperProps

export default function Card({ children, className, ...rest }: CardProps) {
    return (
        <Paper className={`${styles.paper} ${className ?? ""}`} {...rest}>
            {children}
        </Paper>
    )
}
