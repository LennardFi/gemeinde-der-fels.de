import { buildApiRouteWithDatabase } from "@/lib/backend/apiRouteBuilders"
import { WebsiteError } from "@/lib/shared/errors"
import { sendMail } from "@/lib/shared/mailing"
import { postContactApiRequestBodySchema } from "@/lib/shared/schemes"
import Website from "@/typings"

export const dynamic = "force-dynamic"

export const POST = buildApiRouteWithDatabase<undefined>(
    async (req, client, session) => {
        let contactRequestBody: Website.Api.Endpoints.ContactRequestBody
        try {
            const requestBody: unknown = await req.json()
            const parseResult =
                postContactApiRequestBodySchema.safeParse(requestBody)
            if (!parseResult.success) {
                throw new WebsiteError(
                    "request",
                    "Invalid request body received",
                    {
                        endpoint: req.url,
                        httpStatusCode: 400,
                    },
                    {
                        requestBody,
                    },
                )
            }

            contactRequestBody = parseResult.data
        } catch (err) {
            if (err instanceof WebsiteError) {
                throw err
            }

            throw new WebsiteError("request", "Invalid request body received", {
                endpoint: req.url,
                httpStatusCode: 400,
                internalMessage: "Request body not parsable JSON value",
            })
        }

        const { name, mail, phone, description, newPassword } =
            contactRequestBody

        if (newPassword !== undefined) {
            throw new WebsiteError(
                "request",
                "Not allowed to send contact form",
                {
                    internalMessage: "honeypot form data detected",
                    httpStatusCode: 400,
                    level: "warning",
                },
            )
        }

        try {
            await sendMail(name, mail, phone, description)
        } catch (err) {
            if (err instanceof WebsiteError) {
                throw err
            }

            throw new WebsiteError(
                "server",
                "Could not send mail",
                {
                    httpStatusCode: 500,
                    internalException: err instanceof Error ? err : undefined,
                },
                {
                    contactRequest: contactRequestBody,
                },
            )
        }

        return {
            body: {
                success: true,
                data: undefined,
            },
            contentType: "application/json",
            jwtPayload: session.jwtPayload,
            status: 200,
        }
    },
)
