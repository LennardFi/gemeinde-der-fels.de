import PageContainer from "@/components/containers/PageContainer"
import BibleVerse from "@/components/data-display/BibleVerse"
import Paper from "@/components/surfaces/Paper"

export default function Page() {
    return (
        <PageContainer
            title="Gebetsabend"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Paper breakpoint="small">
                <p>
                    <strong>Wann:</strong> Jeden Mittwoch um 19:00 Uhr
                </p>
                <p>
                    Jeden Mittwoch treffen wir uns zum Gebet und bringen in
                    Einheit unsere Anliegen und Fürbitte vor Gott. Denn Gebet
                    macht den Unterschied.
                </p>
                <BibleVerse
                    book="Epheser"
                    chapter={6}
                    verses={[
                        "18 Betet allezeit mit Bitten und Flehen im Geist und wacht dazu mit aller Beharrlichkeit im Gebet für alle Heiligen.",
                    ]}
                    translation="LUT"
                />
                <BibleVerse
                    book="Matthäus"
                    chapter={18}
                    translation="SCH2000"
                    verses={[
                        "20 Denn wo zwei oder drei in meinem Namen versammelt sind, da bin ich in ihrer Mitte.",
                    ]}
                />
            </Paper>
        </PageContainer>
    )
}
