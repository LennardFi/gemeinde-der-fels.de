"use client"

import { returnToPathParamName } from "@/lib/frontend/urlParams"
import useAuthZustand from "@/zustand/useAuthZustand"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export default function Page() {
    const searchParams = useSearchParams()
    const returnToParam = searchParams.get(returnToPathParamName)

    const router = useRouter()
    const jwt = useAuthZustand((state) => state.jwt)
    const logout = useAuthZustand((state) => state.logout)

    useEffect(() => {
        if (jwt !== undefined) {
            logout()
            return
        }

        router.replace(returnToParam ?? "/login")
        return
    }, [jwt])

    return null
}
