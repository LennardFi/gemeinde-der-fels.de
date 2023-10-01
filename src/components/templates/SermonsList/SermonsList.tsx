import Website from "@/typings"
import { Temporal } from "temporal-polyfill"
import styles from "./SermonsList.module.scss"

interface SermonsListProps {
    filter?: Website.Content.Sermons.SermonsFilter
}

const SermonsList = ({ filter }: SermonsListProps) => {
    const sermons: Website.Content.Sermons.Sermon[] = [
        {
            audioFile: "6518b149c7dceb18ca4dfc38",
            date: Temporal.PlainDate.from("2023-09-30T23:37:45.257Z"),
            id: "abc",
            speaker: {
                id: "def",
                initials: "TE",
                name: "Test",
            },
            title: "Testpredigt.mp3",
        },
    ]

    return (
        <ul className={styles.sermonsList}>
            {sermons.map((sermon) => {
                return (
                    <li className={`${styles.sermon}`} key={sermon.id}>
                        {sermon.title}
                    </li>
                )
            })}
        </ul>
    )
}

export default SermonsList
