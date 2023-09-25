import { Maybe } from "@/typings"

export default function getCookieValue(cookieName: string): Maybe<string> {
    if (typeof document !== "undefined") {
        const matchResult = document.cookie
            .split("; ")
            .reduce(
                (acc, s) => acc ?? s.match(`^${cookieName}=(.*)`) ?? undefined,
                undefined as Maybe<RegExpMatchArray>,
            )

        return matchResult?.[1]
    }
}
