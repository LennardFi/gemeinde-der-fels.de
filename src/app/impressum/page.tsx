import PageContainer from "@/components/containers/PageContainer"
import ObfuscatedLabel from "@/components/data-display/ObfuscatedLabel"

export default function Page() {
    return (
        <PageContainer
            breakpoint="normal"
            title="Impressum"
            themeColor="primary"
            themeColorVariant="font"
        >
            <p>
                Verein f&uuml;r biblischen Gemeindebau im In- und Ausland e.V.
                <br />
                P&uuml;tzwiese 8<br />
                35232 Dautphe
            </p>

            <p>
                Vereinsregister: 4834
                <br />
                Registergericht: Amtsgericht Marburg
            </p>

            <p>
                <strong>Vertreten durch:</strong>
                <br />
                Dennis Wege
            </p>

            <h2>Kontakt</h2>
            <p>
                Telefon:{" "}
                <ObfuscatedLabel
                    actionType="phone"
                    encryptedInfo={Buffer.from("06468 / 9110742").toString(
                        "base64",
                    )}
                />
                <br />
                E-Mail:{" "}
                <ObfuscatedLabel
                    actionType="mail"
                    encryptedInfo={Buffer.from(
                        "info@gemeinde-der-fels.de",
                    ).toString("base64")}
                />
            </p>

            <h2>Redaktionell verantwortlich</h2>
            <p>
                Dennis Wege
                <br />
                P&uuml;tzwiese 8<br />
                35232 Dautphe
            </p>

            <h2>
                Verbraucher&shy;streit&shy;beilegung/Universal&shy;schlichtungs&shy;stelle
            </h2>
            <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
            </p>

            <p>
                Quelle: <a href="https://www.e-recht24.de">e-recht24.de</a>
            </p>
        </PageContainer>
    )
}
