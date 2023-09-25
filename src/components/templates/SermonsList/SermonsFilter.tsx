import Website from "@/typings"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Select from "react-select"
import styles from "./SermonsFilter.module.scss"

interface SermonsFilterProps {
    filter: Website.Content.Sermons.SermonsFilter
    setFilter: Dispatch<SetStateAction<Website.Content.Sermons.SermonsFilter>>
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

const SermonsFilter = async ({ filter, setFilter }: SermonsFilterProps) => {
    const [selectedSpeakers, setSelectedSpeakers] = useState<string[]>([])
    const sermonsMasterData = await getSermonsMasterData()

    const submitFilter = () => {
        setFilter({
            speakers: selectedSpeakers,
        })
    }

    useEffect(() => {
        setSelectedSpeakers(filter.speakers?.map((s) => s) ?? [])
    }, [filter])

    return (
        <div className={styles.searchConfig}>
            <Select
                className={styles.speakerSelection}
                isMulti
                name="Sprecher"
                noOptionsMessage={({ inputValue }) =>
                    inputValue === ""
                        ? "Keine Optionen"
                        : `Keine Optionen für ${inputValue}`
                }
                loadingMessage={() => "Wird geladen..."}
                options={filter.speakers ?? []}
                onChange={(ss) => setSelectedSpeakers(ss.map((s) => s))}
                value={selectedSpeakers}
            />
            <button className={styles.submit} onClick={submitFilter}>
                Anwenden
            </button>
        </div>
    )
}

export default SermonsFilter
