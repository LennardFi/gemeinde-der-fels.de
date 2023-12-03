"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import IconButton from "@/components/inputs/IconButton"
import { returnToPathParamName } from "@/lib/frontend/urlParams"
import Website from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import { AnimatePresence, motion } from "framer-motion"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import React, { useState } from "react"
import { FaAngleDown, FaAngleUp } from "react-icons/fa"
import styles from "./NavigationDrawerItem.module.scss"

export type NextLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
    LinkProps

interface NavigationDrawerItemProps
    extends React.HTMLAttributes<HTMLLIElement>,
        Omit<Website.Content.Navigation.NavigationEntry, "label"> {}

export default function NavigationDrawerItem({
    addReturnToCurrentPath,
    addSearchParams,
    icon,
    needsAuth,
    noLink,
    onlyMobile,
    path,
    requiresAllFeatureFlags: requiresAllDevFeatureFlag,
    requireOneUserFlag,
    subEntries,
    className,
    children,
    ...rest
}: NavigationDrawerItemProps) {
    const router = useRouter()
    const pathName = usePathname()
    const user = useAuthZustand((state) => state.user)
    const jwt = useAuthZustand((state) => state.jwt)
    const [subEntriesExpanded, setSubEntriesExpanded] = useState(false)

    if (
        requireOneUserFlag !== undefined &&
        requireOneUserFlag.every((flag) => !user?.flags?.[flag])
    ) {
        return null
    }

    const targetPathParams = new URLSearchParams()

    if (addReturnToCurrentPath) {
        targetPathParams?.append(returnToPathParamName, pathName)
    }

    if (addSearchParams) {
        for (const param in addSearchParams) {
            const value = addSearchParams[param]
            if (value !== undefined) {
                targetPathParams.append(param, value)
            }
        }
    }

    const targetPath =
        path !== undefined
            ? targetPathParams.size > 0
                ? `${path}?${targetPathParams?.toString()}`
                : `${path}`
            : path

    const isLink = targetPath !== undefined && !noLink

    const currentPage =
        targetPath !== undefined &&
        (targetPath === "/"
            ? pathName === targetPath
            : pathName.startsWith(targetPath))

    if (typeof document !== "undefined" && currentPage && !subEntriesExpanded) {
        setSubEntriesExpanded(true)
    }

    const subEntriesExpandToggler = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    ) => {
        e.preventDefault()
        e.stopPropagation()
        setSubEntriesExpanded((pre) => !pre)
    }

    if (needsAuth && jwt === undefined) {
        return null
    }

    return (
        <RequiresFeatureFlag flags={requiresAllDevFeatureFlag ?? []}>
            <li
                className={`${styles.item} ${
                    isLink || subEntries?.length ? styles.isButton : ""
                } ${subEntries === undefined ? styles.noSubEntries : ""} ${
                    needsAuth ? styles.needsAuth : ""
                } ${currentPage ? styles.active : ""} ${className ?? ""}`}
                onClick={
                    isLink
                        ? (e) => {
                              e.preventDefault()
                              e.stopPropagation()

                              if (targetPath !== undefined) {
                                  router.push(targetPath)
                              }
                          }
                        : undefined
                }
                {...rest}
            >
                {isLink ? (
                    <Link className={styles.label} href={targetPath}>
                        {children}
                    </Link>
                ) : (
                    <span
                        className={styles.label}
                        onClick={
                            subEntries?.length
                                ? subEntriesExpandToggler
                                : undefined
                        }
                        tabIndex={0}
                    >
                        {children}
                    </span>
                )}
                {subEntries !== undefined ? (
                    <IconButton
                        className={`${styles.arrow}`}
                        disabled={currentPage}
                        onClick={subEntriesExpandToggler}
                        themeColor={
                            currentPage
                                ? "secondary"
                                : !needsAuth
                                  ? "primary"
                                  : "accent"
                        }
                        variant="contained"
                    >
                        {subEntriesExpanded ? <FaAngleUp /> : <FaAngleDown />}
                    </IconButton>
                ) : null}
            </li>
            {subEntries !== undefined ? (
                <AnimatePresence>
                    {subEntriesExpanded ? (
                        <motion.li
                            className={`${styles.item} ${
                                styles.subEntriesItem
                            } ${needsAuth ? styles.needsAuth : ""} ${
                                className ?? ""
                            }`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{
                                height: "auto",
                                opacity: 1,
                            }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                ease: "linear",
                                duration: 0.25,
                            }}
                        >
                            <ul className={styles.subEntries}>
                                {subEntries.map(
                                    ({ label, path, ...rest }, i) => (
                                        <NavigationDrawerItem
                                            key={`${i}_${path}`}
                                            needsAuth={needsAuth}
                                            path={path}
                                            {...rest}
                                        >
                                            {label}
                                        </NavigationDrawerItem>
                                    ),
                                )}
                            </ul>
                        </motion.li>
                    ) : null}
                </AnimatePresence>
            ) : null}
        </RequiresFeatureFlag>
    )
}
