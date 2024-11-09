"use client"

import { useEffect, useState } from "react"

interface ObfuscatedLabelBaseProps<T extends string> {
    encryptedInfo: string
    actionType: T
}

type ObfuscatedLabelProps =
    | ObfuscatedLabelBaseProps<"mail">
    | ObfuscatedLabelBaseProps<"phone">

export default function ObfuscatedLabel({
    encryptedInfo,
    actionType,
}: ObfuscatedLabelProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    if (visible) {
        const decryptedInfo = Buffer.from(encryptedInfo, "base64").toString(
            "ascii",
        )

        if (actionType === "mail") {
            return <a href={`mailto:${decryptedInfo}`}>{decryptedInfo}</a>
        }

        if (actionType === "phone") {
            return (
                <a href={`tel:${decryptedInfo.replaceAll(/\s|\//g, "")}`}>
                    {decryptedInfo}
                </a>
            )
        }

        return null
    }

    return null
}
