import styles from "./NextAppointmentsCalendar.module.scss"

export interface NextAppointmentsCalendarProps {}

export default function NextAppointmentsCalendar({}: NextAppointmentsCalendarProps) {
    return (
        <div className={styles.container}>
            <div className={styles.date}>Mittwoch</div>
            <div className={styles.label}>Gebetsabend</div>
            <div className={styles.date}>Sonntag</div>
            <div className={styles.label}>Gottesdienst</div>
        </div>
    )
}
