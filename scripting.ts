import { Temporal } from "temporal-polyfill"

const x = Temporal.Now.zonedDateTimeISO("UTC").epochMilliseconds

Temporal.Instant.fromEpochMilliseconds(x).toZonedDateTimeISO("UTC")
    .epochMilliseconds
