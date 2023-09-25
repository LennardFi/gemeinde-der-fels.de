import Website from "@/typings"
import { useState } from "react"
import SermonsFilter from "./SermonsFilter"
import SermonsList from "./SermonsList"

interface SermonsListContainerProps {
    baseFilter?: Website.Content.Sermons.SermonsFilter
    showFilter?: boolean
}

const SermonsListContainer = async ({
    baseFilter,
    showFilter,
}: SermonsListContainerProps) => {
    const [filter, setFilter] = useState<Website.Content.Sermons.SermonsFilter>(
        {
            ...baseFilter,
        }
    )
    return (
        <div>
            {showFilter ?? (
                <SermonsFilter filter={filter} setFilter={setFilter} />
            )}
            <SermonsList filter={filter} />
        </div>
    )
}

export default SermonsListContainer
