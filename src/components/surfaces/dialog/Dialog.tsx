import Flex from "@/components/containers/Flex"
import { FaCross } from "react-icons/fa"
import Window, { WindowProps } from "../window/Window"
import WindowContent from "../window/WindowContent"
import WindowHeader from "../window/WindowHeader"
import styles from "./Dialog.module.scss"

export interface DialogProps extends WindowProps {
    onClose?: () => void
    title?: string
}

export default function Dialog({
    children,
    onClose,
    title,
    ...rest
}: DialogProps) {
    return (
        <Flex className={styles.container} justify="center" alignItems="center">
            <Window
                breakpoint="small"
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
                <WindowContent>{children}</WindowContent>
            </Window>
        </Flex>
    )
}
