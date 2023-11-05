import Website from "@/typings"
import ReactSlider, { ReactSliderProps } from "react-slider"
import styles from "./Slider.module.scss"

export interface SliderProps<T extends number | readonly number[] = number>
    extends ReactSliderProps<T> {
    formatLabel?: (value: number) => JSX.Element
    showLabel?: boolean
    /**
     * @default "accent"
     */
    themeColor?: Website.Design.ThemeColor
    variant?: Website.Design.Variant
}

export default function Slider<T extends number | readonly number[] = number>({
    className,
    formatLabel,
    markClassName,
    showLabel,
    themeColor,
    thumbActiveClassName,
    thumbClassName,
    trackClassName,
    variant,
    ...rest
}: SliderProps<T>) {
    const themeClassName =
        themeColor === "primary"
            ? styles.primary
            : themeColor === "secondary"
            ? styles.secondary
            : styles.accent

    return (
        <ReactSlider
            {...rest}
            className={`${styles.slider} ${themeClassName} ${className ?? ""}`}
            markClassName={`${styles.mark} ${markClassName ?? ""}`}
            trackClassName={`${styles.track} ${trackClassName ?? ""}`}
            thumbActiveClassName={`${styles.activeThumb} ${
                thumbActiveClassName ?? ""
            }`}
            thumbClassName={`${styles.thumb} ${thumbClassName ?? ""}`}
            renderThumb={({ key, ...props }, state) => (
                <div key={key} {...props}>
                    {showLabel ? (
                        <span className={styles.thumbLabel}>
                            {formatLabel === undefined
                                ? state.valueNow
                                : formatLabel(state.valueNow)}
                        </span>
                    ) : null}
                </div>
            )}
        />
    )
}
