"use client"

import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import { returnToPathParamName } from "@/lib/shared/urlParams"
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
}: NavigationItemProps) {
    const router = useRouter()
    const pathName = usePathname()
    const user = useAuthZustand((state) => state.user)
    const jwt = useAuthZustand((state) => state.jwt)

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

    if (needsAuth && jwt === undefined) {
        return null
    }

    if (onlyMobile) {
        return null
    }

    return (
        <RequiresFeatureFlag flags={requiresAllDevFeatureFlag ?? []}>
            <li
                className={`${styles.item} ${isLink ? styles.isLink : ""} ${
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
                    <span className={styles.label} tabIndex={0}>
                        {children}
                    </span>
                )}
                {subEntries !== undefined ? (
                    <>
                        <FaAngleDown className={`${styles.arrow}`} />
                        <ul
                            className={styles.subEntries}
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                        >
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
        </RequiresFeatureFlag>
    )
}
