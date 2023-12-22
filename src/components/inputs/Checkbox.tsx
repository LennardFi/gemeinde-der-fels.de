"use client"

import Website from "@/typings"
import {
    ChangeEvent,
    HTMLAttributes,
    InputHTMLAttributes,
    useId,
    useState,
} from "react"
import { FaCheckSquare, FaMinusSquare, FaSquare } from "react-icons/fa"
import styles from "./Checkbox.module.scss"

export interface CheckboxProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        "onChange" | "type" | "value"
    > {
    fontColor?: boolean
    indeterminate?: boolean[]
    description?: string
    label?: string
    labelProps?: Omit<HTMLAttributes<HTMLLabelElement>, "htmlFor">
    onChange?: (checked: boolean) => void
    themeColor?: Website.Design.ThemeColor
}

export default function Checkbox({
    checked,
    className,
    description,
    disabled,
    fontColor,
    id,
    indeterminate,
    label,
    labelProps,
    onChange,
    readOnly,
    themeColor = "primary",
    ...rest
}: CheckboxProps) {
    const [innerChecked, setInnerChecked] = useState(checked ?? false)
    const defaultId = useId()

    const { className: labelClassName, ...labelPropsRest } = {
        className: undefined,
        ...labelProps,
    }

    const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setInnerChecked(e.target.checked)
        onChange?.(e.target.checked)
    }

    return (
        <span
            className={`${styles.checkboxContainer} ${
                fontColor ? styles.fontColor : ""
            } ${label === undefined || label === "" ? styles.noLabel : ""} ${
                className ?? ""
            }`}
            {...(indeterminate?.includes(true)
                ? { "data-indeterminate": true }
                : undefined)}
            {...(disabled ? { "data-disabled": true } : undefined)}
            data-theme={themeColor}
        >
            <input
                checked={checked ?? innerChecked}
                className={`${styles.input}`}
                disabled={disabled}
                id={id ?? defaultId}
                {...(indeterminate?.includes(true)
                    ? { "data-indeterminate": true }
                    : undefined)}
                readOnly={readOnly ?? onChange === undefined ? true : undefined}
                onChange={inputChangeHandler}
                type="checkbox"
                {...rest}
            />
            {checked ?? innerChecked ? (
                <FaCheckSquare
                    className={`${styles.checkbox}`}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setInnerChecked(!innerChecked)
                        onChange?.(!innerChecked)
                    }}
                />
            ) : indeterminate?.includes(true) ? (
                <FaMinusSquare
                    className={`${styles.checkbox}`}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setInnerChecked(!innerChecked)
                        onChange?.(!innerChecked)
                    }}
                />
            ) : (
                <FaSquare
                    className={`${styles.checkbox}`}
                    onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        setInnerChecked(!innerChecked)
                        onChange?.(!innerChecked)
                    }}
                />
            )}
            {label !== undefined ? (
                <label
                    className={`${styles.label} ${
                        description !== undefined ? styles.boldLabel : ""
                    } ${labelClassName ?? ""}`}
                    htmlFor={id ?? defaultId}
                    {...labelPropsRest}
                >
                    {label}
                </label>
            ) : undefined}
        </span>
    )
}
