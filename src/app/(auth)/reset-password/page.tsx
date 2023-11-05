"use client"

import { redirect, RedirectType, useSearchParams } from "next/navigation"

export default function Page() {
    const searchParams = useSearchParams()

    redirect(
        `/change-password?${searchParams.toString()}`,
        RedirectType.replace,
    )
}
