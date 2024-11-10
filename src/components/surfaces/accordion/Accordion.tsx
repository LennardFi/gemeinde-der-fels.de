"use client"

import useDebouncedValue from "@/hooks/useDebouncedValue"
import Website from "@/typings"
import { motion } from "framer-motion"
import React, { HTMLAttributes, useCallback, useEffect, useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import styles from "./Accordion.module.scss"

export interface AccordionProps
    extends Omit<HTMLAttributes<HTMLDetailsElement>, "onChange"> {
    icon?: React.ReactNode
    summary?: React.ReactNode
    open?: boolean
    onOpen?: (open: boolean) => void
    themeColor?: Website.Design.ThemeColor
}

const animationTime = 0.25

export default function Accordion({
    children,
    className,
    icon,
    onClick,
    open,
    onOpen,
    summary,
    themeColor = "primary",
    ...rest
}: AccordionProps) {
    const [innerOpen, setInnerOpen] = useState(open ?? false)
    const debouncedOpen = useDebouncedValue(
        open ?? innerOpen,
        animationTime * 1000,
    )

    const onToggleAccordionHandler = useCallback(() => {
        if (onOpen === undefined) {
            setInnerOpen(!innerOpen)
            return
        }
        onOpen(!open)
        setInnerOpen(!open)
    }, [open, innerOpen, setInnerOpen, onOpen])

    useEffect(() => {
        if (summary === "Hingegeben") {
            console.log({
                open,
                innerOpen,
                debouncedOpen,
            })
        }
    }, [open, innerOpen, debouncedOpen])

    return (
        <details
            className={`${styles.accordion} ${className ?? ""} ${(open ?? innerOpen) ? styles.open : ""}`}
            data-theme={themeColor}
            onClick={(e) => {
                onClick?.(e)
            }}
            open={(open ?? innerOpen) || debouncedOpen}
            {...rest}
        >
            <summary
                onClick={(e) => {
                    e.preventDefault()
                    onToggleAccordionHandler()
                }}
            >
                <span className={styles.icon}>
                    {icon !== undefined ? (
                        icon
                    ) : (
                        <FaAngleRight
                            style={{
                                transition: "rotate 250ms ease-in-out",
                                rotate: (open ?? innerOpen) ? "90deg" : "0deg",
                            }}
                        />
                    )}
                </span>
                {summary}
            </summary>
            {/* <AnimatePresence initial={false}>
                {(open ?? innerOpen) ? ( */}
            <motion.div
                key="content"
                className={`${styles.detailsContent}`}
                animate={(open ?? innerOpen) ? "open" : "collapsed"}
                transition={{
                    type: "keyframes",
                    ease: "easeInOut",
                    duration: animationTime,
                }}
                variants={{
                    collapsed: {
                        height: 0,
                    },
                    open: {
                        height: "auto",
                    },
                }}
            >
                {children}
            </motion.div>
            {/* ) : null}
            </AnimatePresence> */}
        </details>
    )
}
