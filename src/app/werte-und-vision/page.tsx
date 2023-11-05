import Paper from "@/components/surfaces/Paper"
import Link from "next/link"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <Paper className={styles.paper}>
            <h1>Werte und Vision</h1>
            <p>
                Qui consectetur excepteur aute esse consectetur minim laborum.
                Eu amet proident aute enim deserunt irure nostrud incididunt
                velit culpa ullamco sint. Sint et aliquip ea dolore ullamco
                irure culpa id eu adipisicing. Ex eu qui cupidatat qui aute.
                Elit consectetur sunt culpa dolor excepteur anim adipisicing
                cillum. Anim sit cillum officia velit veniam duis enim anim
                consequat do deserunt qui. Aliqua irure quis sit pariatur ut
                dolor sit. <Link href="/abc">Abc</Link>
            </p>
        </Paper>
    )
}
