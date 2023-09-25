"use client"

import { JWT_Cookie_Name } from "@/lib/backend/auth"
import getCookieValue from "@/lib/frontend/cookies"
import makeApiRequest from "@/lib/frontend/makeApiRequest"
import Website from "@/typings"
import { create } from "zustand"

export interface AuthZustand {
    loadJWTFromCookie(): void
    login(email: string, password: string): Promise<true | "invalidAuth">
    logout(): Promise<void>
    // updateJwt(jwt: string): void
    // revokeJWT(): void
    jwt?: string
    user?: Website.Users.User
}

const useAuthZustand = create<AuthZustand>()((set) => {
    if (typeof document === "undefined") {
        console.log("useAuthZustand on server")
    } else {
        console.log("useAuthZustand on %cclient", "color: green")
    }

    return {
        loadJWTFromCookie: () => {
            console.debug("Set JWT from browser cookie")
            set({ jwt: getCookieValue(JWT_Cookie_Name) })
        },
        login: async (email, password) => {
            const { response: user } = await makeApiRequest<Website.Users.User>(
                "/api/auth/login",
                {
                    contentType: "application/json",
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                    method: "POST",
                    noAuthorization: true,
                },
            )

            set({
                user,
            })
            return true
        },
        logout: async () => {
            await makeApiRequest<undefined>("/api/auth/logout", {
                contentType: "application/json",
                method: "POST",
            })

            set({
                user: undefined,
            })
        },
    }
})

export default useAuthZustand
