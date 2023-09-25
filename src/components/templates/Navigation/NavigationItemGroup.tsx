"use client"

import Website from "@/typings"
import "reactjs-popup/dist/index.css"
import NavigationItem, { NextLinkProps } from "./NavigationItem"
import styles from "./NavigationItemGroup.module.scss"

interface NavigationItemGroupProps
    extends Omit<NextLinkProps, "href">,
        Omit<
            Website.Content.Navigation.NavigationEntry,
            "label" | "subEntries"
        > {
    subEntries: NonNullable<
        Website.Content.Navigation.NavigationEntry["subEntries"]
    >
    currentPage?: boolean
}

export default function NavigationItemGroup({
    subEntries,
    className,
    children,
    ...rest
}: NavigationItemGroupProps) {
    return (
        <>
            <NavigationItem
                className={`${styles.item} ${className ?? ""}`}
                {...rest}
            >
                {children}
            </NavigationItem>
            {/* <ul className={styles.subEntries}>
                {subEntries.map(({ label, ...entry }, i) => (
                    <li key={i} className={styles.entryListItem}>
                        <NavigationItem className={styles.subEntry} {...entry}>
                            {label}
                        </NavigationItem>
                    </li>
                ))}
            </ul> */}
        </>
    )
}
