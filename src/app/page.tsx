"use client"

import Slider from "@/components/inputs/Slider"
import Paper from "@/components/surfaces/Paper"
import { useState } from "react"
import styles from "./page.module.scss"

interface HomePageProps {
    children: React.ReactNode
}

export default function IndexPage() {
    const [value, setValue] = useState(50)
    return (
        <>
            <Paper className={styles.paper}>
                <h2>Herzlich Willkommen</h2>
                <Slider
                    className={styles.slider}
                    marks={[25, 50, 75]}
                    onChange={(v) => setValue(v)}
                    showLabel
                    value={value}
                />
                {value}
            </Paper>
            {/* <div className={styles.welcomeBanner}>
                <p className={styles.welcomeLabel}>Herzlich</p>
                <p className={styles.welcomeLabel}>Willkommen</p>
            </div> */}
            {/* <NewsList /> */}
        </>
    )
}
