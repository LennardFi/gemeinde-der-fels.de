import PageContainer from "@/components/containers/PageContainer"
import Section from "@/components/containers/Section"
import ObfuscatedLabel from "@/components/data-display/ObfuscatedLabel"

export default function Page() {
    return (
        <PageContainer
            title="Young Generation"
            themeColor="primary"
            themeColorVariant="font"
        >
            <Section paperProps={{ breakpoint: "small" }}>
                <p>
                    Wir Young Generation möchten eine betende Jugend werden. Die
                    für andere und gegenseitig im Gebet einstehen. Mit
                    praktischen Übungen, Zeit im Lobpreis, Gemeinschaft,
                    Gesprächen und vor allem mit viel Freude und lachen.
                </p>
                <p>
                    Wenn du dich angesprochen fühlst, freuen wir uns, wenn du
                    mit dabei bist. Hast du noch Fragen, kannst du dich unter{" "}
                    <ObfuscatedLabel
                        actionType="mail"
                        encryptedInfo={Buffer.from(
                            "salomehaus@outlook.de",
                        ).toString("base64")}
                    />{" "}
                    melden.
                </p>
            </Section>
        </PageContainer>
    )
}
