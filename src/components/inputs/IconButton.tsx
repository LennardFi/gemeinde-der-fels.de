import Button, { ButtonProps } from "./Button"
import styles from "./IconButton.module.scss"

type IconButtonProps = Omit<ButtonProps, "leftSegment" | "rightSegment">

export default function IconButton({
    className,
    labelProps,
    ...rest
}: IconButtonProps) {
    return (
        <Button
            className={`${styles.iconButton} ${className ?? ""}`}
            labelProps={{
                ...labelProps,
                className: `${styles.label} ${labelProps?.className ?? ""}`,
            }}
            {...rest}
        />
    )
}
