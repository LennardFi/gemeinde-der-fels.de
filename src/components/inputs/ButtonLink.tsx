import Website from "@/typings"
import Link, { LinkProps } from "next/link"
import styles from "./ButtonLink.module.scss"

type NextLinkProps = Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof LinkProps
> &
    LinkProps & {
        children?: React.ReactNode
    } & React.RefAttributes<HTMLAnchorElement>

interface ButtonLinkProps extends NextLinkProps {
    variant?: Website.Design.InputVariant
}

export default function ButtonLink({
    children,
    className,
    href,
    type,
    variant,
    ...rest
}: ButtonLinkProps) {
    const variantStyles =
        variant === "contained"
            ? styles.contained
            : variant === "outlined"
            ? styles.outlined
            : ""

    return (
        <Link
            className={`${styles.button} ${variantStyles} ${className ?? ""}`}
            href={href}
            type={type ?? "button"}
            {...rest}
        >
            {children}
        </Link>
    )
}
