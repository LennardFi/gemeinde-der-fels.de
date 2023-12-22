"use client"

import Checkbox from "@/components/inputs/Checkbox"
import useDebouncedValue from "@/hooks/useDebouncedValue"
import Website from "@/typings"
import { AnimatePresence, motion } from "framer-motion"
import React, { HTMLAttributes, useCallback, useEffect, useState } from "react"
import { FaAngleRight } from "react-icons/fa"
import styles from "./Accordion.module.scss"

export interface AccordionProps
    extends Omit<HTMLAttributes<HTMLDetailsElement>, "onChange"> {
    checkbox?: boolean
    checked?: boolean
    indeterminate?: boolean[]
    summary?: React.ReactNode
    open?: boolean
    onChange?: (checked: boolean) => void
    onOpen?: (open: boolean) => void
    themeColor?: Website.Design.ThemeColor
}

const animationTime = 0.25

export default function Accordion({
    checkbox,
    checked,
    children,
    className,
    id,
    indeterminate,
    onClick,
    open,
    onChange,
    onOpen,
    summary,
    themeColor = "primary",
    ...rest
}: AccordionProps) {
    const [innerOpen, setInnerOpen] = useState(open ?? false)
    const debouncedOpen = useDebouncedValue(
        open ?? innerOpen,
        animationTime * 1500,
    )

    const onToggleAccordionHandler = useCallback(() => {
        if (onOpen === undefined) {
            setInnerOpen(!innerOpen)
            return
        }
        onOpen?.(!open)
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
            className={`${styles.accordion} ${className ?? ""}`}
            data-theme={themeColor}
            id={checkbox ? undefined : id}
            onClick={(e) => {
                onClick?.(e)
            }}
            open={(open ?? innerOpen) || debouncedOpen}
            {...rest}
        >
            <summary
                onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleAccordionHandler()
                }}
            >
                {typeof summary === "string" ||
                typeof summary === "number" ||
                typeof summary === "boolean" ||
                summary === null ||
                summary === undefined ? (
                    <>
                        {checkbox ? (
                            <Checkbox
                                checked={checked}
                                className={styles.icon}
                                fontColor
                                id={id}
                                indeterminate={indeterminate}
                                onChange={onChange}
                                themeColor={themeColor}
                            />
                        ) : (
                            <FaAngleRight
                                className={styles.icon}
                                style={{
                                    rotate:
                                        open ?? innerOpen ? "90deg" : "0deg",
                                }}
                            />
                        )}
                        {summary}
                    </>
                ) : null}
            </summary>
            <AnimatePresence>
                {open ?? innerOpen ? (
                    <motion.div
                        className={`${styles.detailsContent}`}
                        initial={{ height: 0 }}
                        animate={{
                            height: "auto",
                        }}
                        exit={{ height: 0 }}
                        transition={{
                            type: "keyframes",
                            ease: "easeInOut",
                            duration: animationTime,
                        }}
                    >
                        {children}
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </details>
    )
}
