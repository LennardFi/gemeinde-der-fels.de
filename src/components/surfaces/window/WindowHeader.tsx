"use client"

import { tooltipOpenDelay } from "@/lib/frontend/constants"
import React, { HTMLAttributes, useId } from "react"
import { Tooltip } from "react-tooltip"
import IconButton from "../../inputs/IconButton"
import styles from "./WindowHeader.module.scss"

export interface WindowHeaderProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    title: string
    leftSegment?: React.ReactNode
    leftSegmentAction?: () => void
    leftSegmentToolTip?: string
    rightSegment?: React.ReactNode
    rightSegmentAction?: () => void
    rightSegmentToolTip?: string
    subTitle?: React.ReactNode
}

export default function WindowHeader({
    className,
    leftSegment,
    leftSegmentAction,
    leftSegmentToolTip,
    rightSegment,
    rightSegmentAction,
    rightSegmentToolTip,
    subTitle,
    title,
    ...rest
}: WindowHeaderProps) {
    const tooltipId = useId()

    return (
        <>
            <div className={`${styles.header} ${className ?? ""}`} {...rest}>
                {leftSegment !== undefined ? (
                    <IconButton
                        className={styles.action}
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={leftSegmentToolTip}
                        onClick={leftSegmentAction}
                        variant="contained"
                    >
                        {leftSegment}
                    </IconButton>
                ) : undefined}
                <div className={styles.titleSection}>
                    <h1 className={styles.title}>{title}</h1>
                    <span
                        className={`${styles.subTitle} ${
                            !subTitle ? (styles.noSubTitle ?? "") : ""
                        }`}
                    >
                        {subTitle}
                    </span>
                </div>
                {rightSegment !== undefined ? (
                    <IconButton
                        className={styles.action}
                        data-tooltip-id={tooltipId}
                        data-tooltip-content={rightSegmentToolTip}
                        onClick={rightSegmentAction}
                        variant="contained"
                    >
                        {rightSegment}
                    </IconButton>
                ) : null}
            </div>
            <Tooltip
                delayShow={tooltipOpenDelay}
                id={tooltipId}
                place="top"
                variant="light"
            />
        </>
    )
}
