"use client"

import SermonsListContainer from "@/components/templates/SermonsList/SermonsListContainer"
import React, { useState } from "react"
import Website from "../../typings"

interface PageProps {
    children: React.ReactNode
}

const getSermonsMasterData = async () => {
    const sermonsMasterDataResponse = await fetch("/api/sermons/config", {
        method: "GET",
    })
    const {
        sermonSeries,
        speakers,
    }: Website.Content.Sermons.SermonsMasterData =
        await sermonsMasterDataResponse.json()

    return {
        sermonSeries,
        speakers: Object.entries(speakers).reduce(
            (prev, [shortcut, name]) => [
                ...prev,
                {
                    label: name,
                    value: shortcut,
                },
            ],
            [] as Website.Base.SelectOption<string, string>[]
        ),
    }
}

const Page = async () => {
    const sermonsMasterData = await getSermonsMasterData()
    const [filter, setFilter] = useState<Website.Content.Sermons.SermonsFilter>(
        {
            speakers: sermonsMasterData.speakers.map((s) => s.value),
        }
    )

    const saveFilter = (nextFilter: Website.Content.Sermons.SermonsFilter) => {
        setFilter(nextFilter)
    }

    return <SermonsListContainer showFilter />
}

export default Page
