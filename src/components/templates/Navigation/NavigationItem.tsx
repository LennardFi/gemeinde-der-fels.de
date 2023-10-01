"use client"

import Website from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React from "react"
import { FaAngleDown } from "react-icons/fa"
import styles from "./NavigationItem.module.scss"

export type NextLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps

interface NavigationItemProps
    extends React.HTMLAttributes<HTMLLIElement>,
        Omit<Website.Content.Navigation.NavigationEntry, "label"> {}

export default function NavigationItem({
    icon,
    onlyMobile,
    noLink,
    path,
    requiresFlag,
    subEntries,
    className,
    children,
    ...rest
}: NavigationItemProps) {
    const router = useRouter()
    const pathName = usePathname()
    const user = useAuthZustand((state) => state.user)

    if (
        requiresFlag !== undefined &&
        requiresFlag.every((flag) => !user?.flags?.[flag])
    ) {
        return null
    }

    const isLink = path !== undefined && !noLink

    const currentPage =
        path !== undefined &&
        (path === "/" ? pathName === path : pathName.startsWith(path))

    return (
        <li
            className={`${styles.item} ${isLink ? styles.isLink : ""} ${
                currentPage ? styles.active : ""
            } ${onlyMobile ? styles.onlyMobile : ""} ${className ?? ""}`}
            onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()

                if (path !== undefined) {
                    router.push(path)
                }
            }}
            {...rest}
        >
            {isLink ? (
                <Link className={styles.label} href={path}>
                    {children}
                </Link>
            ) : (
                <span className={styles.label} tabIndex={0}>
                    {children}
                </span>
            )}
            {subEntries !== undefined ? (
                <>
                    <FaAngleDown className={`${styles.arrow}`} />
                    <ul className={styles.subEntries}>
                        {subEntries.map(({ label, path, ...rest }, i) => (
                            <NavigationItem
                                key={`${i}_${path}`}
                                path={path}
                                {...rest}
                            >
                                {label}
                            </NavigationItem>
                        ))}
                    </ul>
                </>
            ) : null}
        </li>
    )
}
