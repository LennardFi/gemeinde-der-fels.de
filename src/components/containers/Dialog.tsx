import Flex from "@/components/containers/Flex"
import { FaCross } from "react-icons/fa"
import Window, { WindowProps } from "../surfaces/window/Window"
import WindowContent from "../surfaces/window/WindowContent"
import WindowHeader from "../surfaces/window/WindowHeader"
import styles from "./Dialog.module.scss"

export interface DialogProps extends WindowProps {
    onClose?: () => void
    title?: string
}

export default function Dialog({
    children,
    className,
    onClose,
    title,
    ...rest
}: DialogProps) {
    return (
        <div className={styles.background}>
            <Flex
                className={styles.container}
                justify="center"
                alignItems="center"
            >
                <Window
                    breakpoint="small"
                    className={`${styles.dialog} ${className ?? ""}`}
                    // pageContainer
                    // pageContainerProps={{ breakpoint: "normal" }}
                    themeColor="primary"
                    themeColorVariant="font"
                    {...rest}
                >
                    <WindowHeader
                        title={title ?? ""}
                        action={<FaCross />}
                        actionHandler={onClose}
                    />
                    <WindowContent className={styles.dialogContent}>
                        {children}
                    </WindowContent>
                </Window>
            </Flex>
        </div>
    )
}
