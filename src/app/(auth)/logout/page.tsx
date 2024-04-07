"use client"

import Skeleton from "@/components/feedback/Skeleton"
import { returnToPathParamName } from "@/lib/shared/urlParams"
import useAuthZustand from "@/zustand/useAuthZustand"
import { useRouter, useSearchParams } from "next/navigation"
import { Suspense, useEffect } from "react"

function ClientSideContent() {
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

export default function Page() {
    return (
        <Suspense fallback={<Skeleton />}>
            <ClientSideContent />
        </Suspense>
    )
}
