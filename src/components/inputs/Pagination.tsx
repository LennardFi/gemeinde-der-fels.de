import Website from "@/typings"
import { HTMLAttributes } from "react"
import {
    FaAngleDoubleLeft,
    FaAngleDoubleRight,
    FaAngleLeft,
    FaAngleRight,
} from "react-icons/fa"
import IconButton from "./IconButton"
import styles from "./Pagination.module.scss"

export interface PaginationProps
    extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
    total: number
    bigSteps?: number
    onChange?: (action: number) => void
    themeColor?: Website.Design.ThemeColor
    variant?: Website.Design.Variant
    value?: number
}

export default function Pagination({
    total,
    className,
    bigSteps = 10,
    onChange,
    themeColor,
    value = 0,
    variant,
    ...rest
}: PaginationProps) {
    const themeColorOrDefault = themeColor ?? "accent"
    const variantOrDefault = variant ?? "contained"

    const changeHandler = (pageIndex: number) => () => {
        if (pageIndex < 0) {
            onChange?.(0)
            return
        }
        if (pageIndex >= total) {
            onChange?.(total - 1)
            return
        }
        onChange?.(pageIndex)
    }

    return (
        <div
            {...rest}
            className={`${styles.pagination} ${className ?? ""}`}
            data-theme={themeColorOrDefault}
            data-variant={variantOrDefault}
        >
            <IconButton
                disabled={value - 1 < 0}
                onClick={changeHandler(value - bigSteps)}
                themeColor={themeColorOrDefault}
                variant={variantOrDefault}
            >
                <FaAngleDoubleLeft />
            </IconButton>
            <IconButton
                disabled={value - 1 < 0}
                onClick={changeHandler(value - 1)}
                themeColor={themeColorOrDefault}
                variant={variantOrDefault}
            >
                <FaAngleLeft />
            </IconButton>
            <span className={styles.currentPage}>
                {value + 1}&nbsp;/&nbsp;{total}
            </span>
            <IconButton
                disabled={value + 1 >= total}
                onClick={changeHandler(value + 1)}
                themeColor={themeColorOrDefault}
                variant={variantOrDefault}
            >
                <FaAngleRight />
            </IconButton>
            <IconButton
                disabled={value + 1 >= total}
                onClick={changeHandler(value + bigSteps)}
                themeColor={themeColorOrDefault}
                variant={variantOrDefault}
            >
                <FaAngleDoubleRight />
            </IconButton>
        </div>
    )
}
