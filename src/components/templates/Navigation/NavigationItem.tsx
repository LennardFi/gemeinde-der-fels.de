"use client"

import Website from "@/typings"
import Link, { LinkProps } from "next/link"
import React from "react"
import styles from "./NavigationItem.module.scss"
import NavigationItemGroup from "./NavigationItemGroup"

export type NextLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps

interface NavigationItemProps
    extends Omit<NextLinkProps, "href">,
        Omit<Website.Content.Navigation.NavigationEntry, "label"> {
    currentPage?: boolean
}

export default function NavigationItem({
    currentPage,
    icon,
    onlyMobile,
    path,
    subEntries,
    className,
    children,
    ...rest
}: NavigationItemProps) {
    if (subEntries !== undefined) {
        return (
            <NavigationItemGroup
                icon={icon}
                onlyMobile={onlyMobile}
                path={path}
                subEntries={subEntries}
                currentPage={currentPage}
                className={className}
                {...rest}
            />
        )
    }

    if (path === undefined) {
        return (
            <span
                className={`${styles.item} ${
                    currentPage ? styles.active : ""
                } ${className ?? ""}`}
                tabIndex={0}
                {...rest}
            >
                {children}
            </span>
        )
    }

    return (
        <Link
            className={`${styles.item} ${currentPage ? styles.active : ""} ${
                className ?? ""
            }`}
            href={path}
            {...rest}
        >
            {children}
        </Link>
    )
}
