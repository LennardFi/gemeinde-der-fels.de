"use client"

import React, { useId, useRef, useState } from "react"
import styles from "./MultilineTextField.module.scss"

interface MultilineTextFieldProps
    extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "rows"> {
    containerProps?: Partial<React.HTMLAttributes<HTMLDivElement>>
    rows?: "big" | "normal" | "small" | number
    error?: boolean
}

export default function MultilineTextField({
    className,
    containerProps,
    defaultValue,
    error,
    name,
    onBlur,
    onFocus,
    placeholder,
    role,
    rows,
    ...rest
}: MultilineTextFieldProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const textAreaRef = useRef<HTMLTextAreaElement | null>(null)
    const id = useId()
    const [inFocus, setInFocus] = useState(false)
    const [value, setValue] = useState(defaultValue ?? "")

    return (
        <div
            {...containerProps}
            className={`${styles.container} ${error ? styles.error : ""} ${containerProps?.className ?? ""}`}
            onClick={(e) => {
                containerProps?.onClick?.(e)
                textAreaRef.current?.focus()
            }}
            onFocus={(e) => {
                containerProps?.onFocus?.(e)
                textAreaRef.current?.focus()
            }}
            ref={containerRef}
            role={role ?? "textbox"}
        >
            {name !== undefined ? (
                <label className={styles.label} htmlFor={id}>
                    {name}
                </label>
            ) : undefined}
            <div className={styles.textAreaContainer}>
                <textarea
                    className={`${styles.textArea} ${className ?? ""}`}
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
                    placeholder={inFocus ? "" : placeholder ?? "_"}
                    value={value}
                    ref={textAreaRef}
                    rows={
                        rows === "big"
                            ? 9
                            : rows === "normal"
                              ? 6
                              : rows === "small"
                                ? 3
                                : rows
                    }
                    {...rest}
                />
            </div>
        </div>
    )
}
