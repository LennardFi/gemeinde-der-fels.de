"use client"

import Skeleton from "@/components/feedback/Skeleton"
import { redirect, RedirectType, useSearchParams } from "next/navigation"
import { Suspense } from "react"

function ClientSideContent() {
    const searchParams = useSearchParams()

    redirect(
        `/change-password?${searchParams.toString()}`,
        RedirectType.replace,
    )

    return null
}

export default function Page() {
    return (
        <Suspense fallback={<Skeleton />}>
            <ClientSideContent />
        </Suspense>
    )
}
