"use client"

import { HTMLAttributes, InputHTMLAttributes, useId } from "react"
import styles from "./Checkbox.module.scss"

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string
    labelProps?: Omit<HTMLAttributes<HTMLLabelElement>, "htmlFor">
    description?: string
}

export default function Checkbox({
    className,
    description,
    disabled,
    id,
    label,
    labelProps,
    onChange,
    readOnly,
    ...rest
}: CheckboxProps) {
    const defaultId = useId()

    if (label === undefined) {
        return (
            <input
                className={`${styles.checkbox} ${className ?? ""}`}
                id={id ?? defaultId}
                readOnly={readOnly ?? onChange === undefined ? true : undefined}
                onChange={onChange}
                type="checkbox"
                {...rest}
            />
        )
    }

    const { className: labelClassName, ...labelPropsRest } = {
        className: undefined,
        ...labelProps,
    }

    return (
        <span
            className={styles.checkboxContainer}
            {...(disabled ? { "data-disabled": true } : undefined)}
        >
            <input
                className={`${styles.checkbox} ${className ?? ""}`}
                disabled={disabled}
                id={id ?? defaultId}
                readOnly={readOnly ?? onChange === undefined ? true : undefined}
                onChange={onChange}
                type="checkbox"
                {...rest}
            />
            <label
                className={`${styles.label} ${
                    description !== undefined ? styles.boldLabel : ""
                } ${labelClassName ?? ""}`}
                htmlFor={id ?? defaultId}
                {...labelPropsRest}
            >
                {label}
            </label>
            {description !== undefined ? (
                <span className={styles.description}>{description}</span>
            ) : null}
        </span>
    )
}
