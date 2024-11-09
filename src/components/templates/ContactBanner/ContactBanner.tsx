import Flex, { FlexProps } from "@/components/containers/Flex"
import ObfuscatedLabel from "@/components/data-display/ObfuscatedLabel"
import { FaComment, FaMapPin } from "react-icons/fa"
import styles from "./ContactBanner.module.scss"

export type ContactBannerProps = FlexProps

export function ContactBanner({ ...rest }: ContactBannerProps) {
    return (
        <Flex
            {...rest}
            direction="column"
            breakpoint="tiny"
            justify="flex-start"
            alignItems="flex-start"
            columnGap={4}
            small={{
                ...rest.small,
                direction: "row",
                justify: "space-around",
                breakpoint: "large",
            }}
        >
            <div className={styles.contactDetails}>
                <div className={styles.iconCell}>
                    <FaComment />
                </div>
                <div className={styles.headerCell}>
                    <b>Kontakt</b>
                </div>
                <div className={styles.contentCell}>
                    <p>
                        Telefon:
                        <br />
                        <ObfuscatedLabel
                            actionType="phone"
                            encryptedInfo={Buffer.from(
                                "06468 / 9110742",
                            ).toString("base64")}
                        />
                    </p>
                    <p>
                        E-Mail:
                        <br />
                        <ObfuscatedLabel
                            actionType="mail"
                            encryptedInfo={Buffer.from(
                                "info@gemeinde-der-fels.de",
                            ).toString("base64")}
                        />
                    </p>
                </div>
            </div>
            <div className={styles.contactDetails}>
                <div className={styles.iconCell}>
                    <FaMapPin />
                </div>
                <div className={styles.headerCell}>
                    <b>Adresse</b>
                </div>
                <div className={styles.contentCell}>
                    <p>
                        Gemeinde der Fels <br />
                        Pützwiese 8<br />
                        35232 Dautphe
                    </p>
                </div>
            </div>
        </Flex>
    )
}
