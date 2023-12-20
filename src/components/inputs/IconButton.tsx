"use client"

import { forwardRef, Ref } from "react"
import Button, { ButtonProps } from "./Button"
import styles from "./IconButton.module.scss"

export type IconButtonProps = Omit<ButtonProps, "leftSegment" | "rightSegment">

const IconButton = forwardRef(function IconButton(
    { className, labelProps, ...rest }: IconButtonProps,
    ref: Ref<HTMLButtonElement>,
) {
    return (
        <Button
            className={`${styles.iconButton} ${className ?? ""}`}
            labelProps={{
                ...labelProps,
                className: `${styles.label} ${labelProps?.className ?? ""}`,
            }}
            ref={ref}
            {...rest}
        />
    )
})

export default IconButton
