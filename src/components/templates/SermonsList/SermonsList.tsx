import Website from "@/typings"
import styles from "./SermonsList.module.scss"

interface SermonsListProps {
    filter?: Website.Content.Sermons.SermonsFilter
}

const SermonsList = async ({ filter }: SermonsListProps) => {
    const sermons: Website.Content.Sermons.SermonContent[] = []

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
