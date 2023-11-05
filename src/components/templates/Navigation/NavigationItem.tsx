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
    needsAuth,
    noLink,
    onlyMobile,
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
    const jwt = useAuthZustand((state) => state.jwt)

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

    if (needsAuth && jwt === undefined) {
        return null
    }

    if (onlyMobile) {
        return null
    }

    return (
        <li
            className={`${styles.item} ${isLink ? styles.isLink : ""} ${
                needsAuth ? styles.needsAuth : ""
            } ${currentPage ? styles.active : ""} ${className ?? ""}`}
            onClick={
                isLink
                    ? (e) => {
                          e.preventDefault()
                          e.stopPropagation()

                          if (path !== undefined) {
                              router.push(path)
                          }
                      }
                    : undefined
            }
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
                                needsAuth={needsAuth}
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
