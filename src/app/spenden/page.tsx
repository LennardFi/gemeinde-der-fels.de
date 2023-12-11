import Flex from "@/components/containers/Flex"
import PageContainer from "@/components/containers/PageContainer"
import Card from "@/components/surfaces/card/Card"
import CardContent from "@/components/surfaces/card/CardContent"
import CardHeader from "@/components/surfaces/card/CardHeader"
import styles from "./page.module.scss"

export default function Page() {
    return (
        <PageContainer title="Spenden" breakpoint="normal">
            <Flex
                direction="row"
                justify="space-around"
                alignItems="flex-start"
                wrap="wrap"
                gap={2}
                className={styles.row}
            >
                <div>
                    <p>
                        Wir finanzieren uns als Gemeinde ausschließlich über
                        Spenden. Wenn Sie sich beteiligen möchten, können Sie
                        das gerne mithilfe einer Banküberweisung tun.
                    </p>
                    <p className={styles.hint}>
                        Für den Erhalt einer Spendenquittung bitte Name und
                        Anschrift im Verwendungszweck angeben!
                    </p>
                    <p></p>
                </div>
                <Card>
                    <CardHeader component="h3">Banküberweisung</CardHeader>
                    <CardContent>
                        <b>Bank:</b> Sparkasse Marburg-Biedenkopf <br />
                        <b>IBAN:</b>{" "}
                        DE19&nbsp;5335&nbsp;0000&nbsp;0119&nbsp;0017&nbsp;49
                        <br />
                        <b>BIC:</b> HELADEF1MAR <br />
                    </CardContent>
                </Card>
            </Flex>
        </PageContainer>
    )
}
