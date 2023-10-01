import { Temporal } from "temporal-polyfill"
import Website from "../../typings"
import { withDatabase } from "./databaseHelpers"

export const readNewsFromDatabase = () =>
    withDatabase<Website.Content.NewsPost[]>(async (client) => {
        const newsPosts = await client.newsPost.findMany()
        return newsPosts.map((post) => ({
            ...post,
            publicationDate: Temporal.PlainDate.from(
                post.publicationDate.toUTCString(),
            ),
        }))
    })
