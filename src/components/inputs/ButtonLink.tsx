import Link, { LinkProps } from "next/link"
import Loader from "../feedback/Loader"
import { ButtonRootProps } from "./Button"
import styles from "./Button.module.scss"
import linkStyles from "./ButtonLink.module.scss"

type NextLinkProps = Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    keyof LinkProps
> &
    LinkProps & {
        children?: React.ReactNode
    } & React.RefAttributes<HTMLAnchorElement>

export type ButtonLinkProps = NextLinkProps & ButtonRootProps

export default function ButtonLink({
    children,
    className,
    containedHover,
    labelProps,
    leftSegment,
    loading,
    rightSegment,
    noActiveAnimation,
    noFocusColor,
    onClick,
    themeColor = "primary",
    type,
    variant,
    ...rest
}: ButtonLinkProps) {
    const variantOrDefault =
        variant ?? (type === "submit" ? "contained" : "text")

    return (
        <Link
            className={`${styles.button} ${linkStyles.button} ${
                containedHover ? styles.containedHover : ""
            } ${noActiveAnimation ? styles.noActiveAnimation : ""} ${
                noFocusColor ? styles.noFocusColor : ""
            } ${className}`}
            data-theme={themeColor}
            data-variant={variantOrDefault}
            onClick={(e) => {
                e.stopPropagation()
                onClick?.(e)
            }}
            type={type ?? "button"}
            {...rest}
        >
            {leftSegment !== undefined ? (
                <span className={`${styles.segment} ${styles.left}`}>
                    {leftSegment}
                </span>
            ) : null}
            <span
                {...labelProps}
                className={`${styles.label} ${linkStyles.label} ${
                    labelProps?.className ?? ""
                }`}
            >
                {loading ? (
                    <Loader
                        height="1rem"
                        themeColor={themeColor}
                        themeColorVariant="font"
                    />
                ) : (
                    children
                )}
            </span>
            {rightSegment !== undefined ? (
                <span className={`${styles.segment} ${styles.right}`}>
                    {rightSegment}
                </span>
            ) : null}
        </Link>
    )
}
