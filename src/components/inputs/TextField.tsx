"use client"

import React, { useId, useRef, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import IconButton from "./IconButton"
import styles from "./TextField.module.scss"

interface TextFieldProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    containerProps?: Partial<React.HTMLAttributes<HTMLDivElement>>
    error?: boolean
    password?: boolean
}

export default function TextField({
    className,
    containerProps,
    defaultValue,
    error,
    name,
    onBlur,
    onFocus,
    password,
    placeholder,
    role,
    ...rest
}: TextFieldProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const id = useId()
    const [inFocus, setInFocus] = useState(false)
    const [value, setValue] = useState(defaultValue ?? "")
    const [passwordVisible, setPasswordVisible] = useState(false)

    return (
        <div
            className={`${styles.container} ${error ? styles.error : ""} ${containerProps?.className ?? ""}`}
            onClick={(e) => {
                containerProps?.onClick?.(e)
                inputRef.current?.focus()
            }}
            onFocus={(e) => {
                e.preventDefault()
                e.stopPropagation()
                containerProps?.onFocus?.(e)
                inputRef.current?.focus()
            }}
            ref={containerRef}
            role={role ?? "textbox"}
        >
            {name !== undefined ? (
                <label className={styles.label} htmlFor={id}>
                    {name}
                </label>
            ) : undefined}
            <div className={styles.inputContainer}>
                <input
                    className={`${styles.input} ${className ?? ""} ${containerProps?.className ?? ""}`}
                    name={name}
                    onBlur={(e) => {
                        onBlur?.(e)
                        setInFocus(false)
                    }}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={(e) => {
                        onFocus?.(e)
                        setInFocus(true)
                    }}
                    placeholder={inFocus ? "" : (placeholder ?? "_")}
                    type={password && !passwordVisible ? "password" : "text"}
                    value={value}
                    ref={inputRef}
                    {...rest}
                />
                {password && (
                    <IconButton
                        className={styles.passwordVisibilityToggleButton}
                        labelProps={{
                            className:
                                styles.passwordVisibilityToggleButtonLabel,
                        }}
                        noActiveAnimation
                        noFocusColor
                        onClick={() => setPasswordVisible((pre) => !pre)}
                        round
                        themeColor={!error ? "primary" : "secondary"}
                    >
                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}{" "}
                    </IconButton>
                )}
            </div>
        </div>
    )
}
