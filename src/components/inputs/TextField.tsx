import React, { useId, useRef, useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import IconButton from "./IconButton"
import styles from "./TextField.module.scss"

interface TextFieldProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
    error?: boolean
    password?: boolean
}

export default function TextField({
    defaultValue,
    error,
    name,
    password,
    placeholder,
    ...rest
}: TextFieldProps) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const id = useId()
    const [value, setValue] = useState(defaultValue ?? "")
    const [passwordVisible, setPasswordVisible] = useState(false)

    return (
        <div
            className={`${styles.container} ${error ? styles.error : ""}`}
            onClick={() => {
                inputRef.current?.focus()
            }}
            onFocus={() => {
                inputRef.current?.focus()
            }}
            ref={containerRef}
        >
            {name !== undefined ? (
                <label className={styles.label} htmlFor={id}>
                    {name}
                </label>
            ) : undefined}
            <div className={styles.inputContainer}>
                <input
                    className={styles.input}
                    name={name}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={placeholder ?? "..."}
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
