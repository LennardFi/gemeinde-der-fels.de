import Link, { LinkProps } from "next/link"
import { ButtonRootProps } from "./Button"
import buttonStyles from "./Button.module.scss"
import styles from "./ButtonLink.module.scss"

type NextLinkProps = Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof LinkProps
> &
    LinkProps & {
        children?: React.ReactNode
    } & React.RefAttributes<HTMLAnchorElement>

export type ButtonLinkProps = NextLinkProps & Omit<ButtonRootProps, "onClick">

export default function ButtonLink({
    children,
    className,
    labelProps,
    leftSegment,
    rightSegment,
    noActiveAnimation,
    noFocusColor,
    themeColor,
    type,
    variant,
    ...rest
}: ButtonLinkProps) {
    const variantStyles =
        variant === "contained"
            ? buttonStyles.contained
            : variant === "outlined"
            ? buttonStyles.outlined
            : ""

    const themeColorStyle =
        themeColor === "primary"
            ? buttonStyles.primary
            : themeColor === "secondary"
            ? buttonStyles.secondary
            : themeColor === "accent"
            ? buttonStyles.accent
            : ""

    return (
        <Link
            className={`${buttonStyles.button} ${
                styles.button
            } ${variantStyles} ${themeColorStyle} ${
                noActiveAnimation ? buttonStyles.noActiveAnimation : ""
            } ${noFocusColor ? buttonStyles.noFocusColor : ""} ${className}`}
            type={type ?? "button"}
            {...rest}
        >
            {leftSegment !== undefined ? (
                <span
                    className={`${buttonStyles.segment} ${buttonStyles.left}`}
                >
                    {leftSegment}
                </span>
            ) : null}
            <span
                {...labelProps}
                className={`${buttonStyles.label} ${styles.label} ${
                    labelProps?.className ?? ""
                }`}
            >
                {children}
            </span>
            {rightSegment !== undefined ? (
                <span
                    className={`${buttonStyles.segment} ${buttonStyles.right}`}
                >
                    {rightSegment}
                </span>
            ) : null}
        </Link>
    )
}
