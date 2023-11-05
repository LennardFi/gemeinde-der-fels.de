import { WebsiteError } from "../shared/errors"

export function logError(e: WebsiteError): void {
    console.error(e.message, e.toJSON())
}
