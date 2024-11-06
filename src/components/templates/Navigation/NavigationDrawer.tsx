"use client"

import Button from "@/components/inputs/Button"
import useMediaQuery from "@/hooks/useMediaQuery"
import { Maybe } from "@/typings"
import useAuthZustand from "@/zustand/useAuthZustand"
import { AnimatePresence, motion } from "framer-motion"
import {
    KeyboardEventHandler,
    MouseEventHandler,
    useEffect,
    useRef,
} from "react"
import { TfiClose } from "react-icons/tfi"
import { navigationEntries } from "./Navigation"
import styles from "./NavigationDrawer.module.scss"
import NavigationDrawerItem from "./NavigationDrawerItem"

interface NavigationDrawerProps {
    opened: boolean
    onClose(): void
}

export default function NavigationDrawer({
    opened,
    onClose,
}: NavigationDrawerProps) {
    const onEscKeyUpHandler =
        useRef<Maybe<(e: KeyboardEvent) => void>>(undefined)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const jwt = useAuthZustand((state) => state.jwt)
    const isBigScreen = useMediaQuery("(min-width: 1280px)")
    const prefersReducedAnimation = useMediaQuery("(prefers-reduced-motion)")

    useEffect(() => {
        if (opened && onEscKeyUpHandler.current === undefined) {
            onEscKeyUpHandler.current = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    onClose()
                }
            }
            document.addEventListener("keyup", onEscKeyUpHandler.current)
            return
        }
        if (!opened && onEscKeyUpHandler.current !== undefined) {
            document.removeEventListener("keyup", onEscKeyUpHandler.current)
            onEscKeyUpHandler.current = undefined
            return
        }
    }, [opened])

    if (typeof document !== "undefined" && opened && isBigScreen) {
        onClose()
    }

    const clickOutsideHandler: MouseEventHandler<HTMLDivElement> = (e) => {
        if (e.target === containerRef.current) {
            e.stopPropagation()
            e.preventDefault()
            onClose()
        }
    }

    const onKeyUpHandler: KeyboardEventHandler<HTMLDivElement> = (e) => {
        if (e.key === "Escape") {
            console.log("escape")
            e.stopPropagation()
            e.preventDefault()
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {opened && (
                <motion.div
                    className={`${styles.drawerContainer}`}
                    onClick={clickOutsideHandler}
                    onKeyUp={onKeyUpHandler}
                    ref={containerRef}
                    initial={{
                        backdropFilter: "blur(4px) opacity(0)",
                    }}
                    animate={{
                        backdropFilter: "blur(4px) opacity(1)",
                    }}
                    exit={{
                        backdropFilter: "blur(4px) opacity(0)",
                    }}
                    transition={{
                        type: "keyframes",
                        ease: "easeInOut",
                        duration: 0.25,
                    }}
                >
                    <motion.div
                        className={styles.drawer}
                        onKeyUp={onKeyUpHandler}
                        initial={{
                            x: !prefersReducedAnimation
                                ? "min(680px, 100%)"
                                : undefined,
                            opacity: 0,
                        }}
                        animate={{
                            x: !prefersReducedAnimation ? 0 : undefined,
                            opacity: 1,
                        }}
                        exit={{
                            x: !prefersReducedAnimation
                                ? "min(680px, 100%)"
                                : undefined,
                            opacity: 0,
                        }}
                        transition={{
                            type: "keyframes",
                            ease: "easeInOut",
                            duration: 0.25,
                        }}
                    >
                        <Button
                            aria-label="Navigationsmenü schließen"
                            className={styles.closeButton}
                            noActiveAnimation
                            onClick={onClose}
                            themeColor="primary"
                            variant="contained"
                        >
                            <TfiClose />
                        </Button>
                        <div className={styles.content}>
                            {navigationEntries.map(
                                ({ label, needsAuth, path, ...entry }, i) => {
                                    if (needsAuth && jwt === undefined) {
                                        return undefined
                                    }

                                    return (
                                        <NavigationDrawerItem
                                            className={
                                                i === 0 ? styles.first : ""
                                            }
                                            needsAuth={needsAuth}
                                            path={path}
                                            key={`${i}_${path}`}
                                            {...entry}
                                        >
                                            {label}
                                        </NavigationDrawerItem>
                                    )
                                },
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
