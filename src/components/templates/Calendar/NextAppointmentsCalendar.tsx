import RequiresFeatureFlag from "@/components/dev/RequiresDevFeatureFlag"
import styles from "./NextAppointmentsCalendar.module.scss"

export interface NextAppointmentsCalendarProps {
    calendarData?: unknown
}

export default function NextAppointmentsCalendar({
    calendarData,
}: NextAppointmentsCalendarProps) {
    return (
        <RequiresFeatureFlag flags={["calendar"]}>
            <div className={styles.container}>
                <div className={styles.date}>Mittwoch</div>
                <div className={styles.label}>Gebetsabend</div>
                <div className={styles.date}>Sonntag</div>
                <div className={styles.label}>Gottesdienst</div>
            </div>
        </RequiresFeatureFlag>
    )
}
