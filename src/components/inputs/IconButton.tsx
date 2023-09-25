import styles from "./IconButton.module.scss"

type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export default function IconButton({
    children,
    className,
    type,
    ...rest
}: IconButtonProps) {
    return (
        <button
            className={`${styles.button} ${className ?? ""}`}
            type={type ?? "button"}
            {...rest}
        >
            {children}
        </button>
    )
}
