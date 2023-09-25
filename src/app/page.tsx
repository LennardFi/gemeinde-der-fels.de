import Paper from "@/components/surfaces/Paper"
import styles from "./page.module.scss"

interface HomePageProps {
    children: React.ReactNode
}

const IndexPage = async () => {
    return (
        <>
            <Paper className={styles.paper}>
                <h2>Herzlich Willkommen</h2>
            </Paper>
            {/* <div className={styles.welcomeBanner}>
                <p className={styles.welcomeLabel}>Herzlich</p>
                <p className={styles.welcomeLabel}>Willkommen</p>
            </div> */}
            {/* <NewsList /> */}
        </>
    )
}

export default IndexPage
