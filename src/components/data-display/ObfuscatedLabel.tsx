"use client"

import { useEffect, useState } from "react"

interface ObfuscatedLabelBaseProps<T extends string> {
    encryptedInfo: string
    type: T
}

type ObfuscatedLabelProps =
    | ObfuscatedLabelBaseProps<"mail">
    | ObfuscatedLabelBaseProps<"phone">

export default function ObfuscatedLabel({
    encryptedInfo,
    type,
}: ObfuscatedLabelProps) {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        setVisible(true)
    }, [])

    if (visible) {
        const decryptedInfo = Buffer.from(encryptedInfo, "base64").toString(
            "ascii",
        )

        if (type === "mail") {
            return <a href={`mailto:${decryptedInfo}`}>{decryptedInfo}</a>
        }

        if (type === "phone") {
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
