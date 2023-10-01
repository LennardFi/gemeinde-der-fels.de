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
    updateUser(): Promise<void>
    // updateJwt(jwt: string): void
    // revokeJWT(): void
    jwt?: string
    user?: Website.Users.User
}

const useAuthZustand = create<AuthZustand>()((set, get) => {
    return {
        loadJWTFromCookie: () => {
            const jwt = getCookieValue(JWT_Cookie_Name)

            set({ jwt })
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
        updateUser: async () => {
            const { response: user } = await makeApiRequest<Website.Users.User>(
                "/api/users/me",
                {
                    method: "GET",
                },
            )

            set({
                user: user,
            })
        },
    }
})

export default useAuthZustand
