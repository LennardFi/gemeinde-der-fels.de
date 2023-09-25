import Website from "@/typings"
import styles from "./Button.module.scss"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Website.Design.InputVariant
}

export default function Button({
    children,
    className,
    type,
    variant,
    ...rest
}: ButtonProps) {
    const variantStyles =
        variant === "contained"
            ? styles.contained
            : variant === "outlined"
            ? styles.outlined
            : ""

    return (
        <button
            className={`${styles.button} ${variantStyles} ${className ?? ""}`}
            type={type ?? "button"}
            {...rest}
        >
            {children}
        </button>
    )
}
