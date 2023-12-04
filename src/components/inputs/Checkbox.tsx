import { InputHTMLAttributes, useId } from "react"
import styles from "./Checkbox.module.scss"

export interface CheckboxProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
    label?: string
}

export default function Checkbox({
    className,
    id,
    label,
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

    return (
        <label className={styles.label} htmlFor={defaultId}>
            <input
                className={`${styles.checkbox} ${className ?? ""}`}
                id={id ?? defaultId}
                readOnly={readOnly ?? onChange === undefined ? true : undefined}
                onChange={onChange}
                type="checkbox"
                {...rest}
            />
            {label}
        </label>
    )
}
