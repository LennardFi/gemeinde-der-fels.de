import { Maybe } from "@/typings"
import { WebsiteError } from "./errors"

export function readEnvValueSafely(
    variable: string,
    type: "boolean",
): Maybe<boolean>
export function readEnvValueSafely(
    variable: string,
    type: "number",
    raiseError?: boolean,
): Maybe<number>
export function readEnvValueSafely(
    variable: string,
    type: "string",
): Maybe<string>
export function readEnvValueSafely(
    variable: string,
    type: "string" | "boolean" | "number",
    raiseError?: boolean,
): Maybe<string | boolean | number> {
    switch (type) {
        case "boolean": {
            const value = process.env[variable]

            if (
                value === "0" ||
                value?.toLowerCase() === "false" ||
                value?.toLowerCase() === "f"
            ) {
                return false
            }

            if (value !== undefined) {
                return true
            }

            return undefined
        }
        case "number": {
            const value = process.env[variable]

            if (value === undefined || value === "") {
                return undefined
            }

            const parsed = Number.parseFloat(value)

            if (isNaN(parsed)) {
                if (raiseError) {
                    throw new WebsiteError(
                        "setup",
                        "Internal setup error",
                        {
                            internalMessage: `Invalid environment variable value: Environment variable "${variable}" contains a wrong formatted numeric value.`,
                            level: "critical",
                            httpStatusCode: 500,
                        },
                        {
                            envVariable: variable,
                            value,
                        },
                    )
                }
                return undefined
            }

            return parsed
        }
        case "string": {
            const parsed = process.env[variable]

            if (parsed === undefined || parsed === "") {
                return undefined
            }

            return parsed
        }
    }
}

export function readRequiredEnvValueSafely(
    variable: string,
    type: "boolean",
): boolean
export function readRequiredEnvValueSafely(
    variable: string,
    type: "number",
    raiseError?: boolean,
): number
export function readRequiredEnvValueSafely(
    variable: string,
    type: "string",
): string
export function readRequiredEnvValueSafely(
    variable: string,
    type: "string" | "boolean" | "number",
    raiseError?: boolean,
): string | boolean | number {
    const envVariableNotSetError = () =>
        new WebsiteError(
            "setup",
            "Internal setup error",
            {
                internalMessage: `Environment variable not set: ${variable}`,
                level: "critical",
                httpStatusCode: 500,
            },
            {
                envVariable: variable,
            },
        )

    switch (type) {
        case "boolean": {
            const value = readEnvValueSafely(variable, type)
            if (value === undefined) {
                throw envVariableNotSetError()
            }

            return value
        }
        case "number": {
            const value = readEnvValueSafely(variable, type, raiseError)
            if (value === undefined) {
                throw envVariableNotSetError()
            }

            return value
        }
        case "string": {
            const value = readEnvValueSafely(variable, type)
            if (value === undefined) {
                throw envVariableNotSetError()
            }

            return value
        }
    }
}
