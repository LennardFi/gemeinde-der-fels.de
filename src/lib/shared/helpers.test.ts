import { getDimensionValue } from "./helpers"

describe("/lib/helpers", () => {
    test("getDimensionValue", () => {
        expect(getDimensionValue(0)).toBe("0px")
        expect(getDimensionValue(1)).toBe("8px")
        expect(getDimensionValue(1, 2)).toBe("8px 16px")
        expect(getDimensionValue(1, 2, 3, 4)).toBe("8px 16px 24px 32px")
    })
})
