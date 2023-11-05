"use client"

import { JWT_Cookie_Name } from "@/lib/backend/auth"
import getCookieValue from "@/lib/frontend/cookies"
import { makeApiRequest } from "@/lib/frontend/makeApiRequest"
import Website from "@/typings"
import { create } from "zustand"

export interface AuthZustand {
    initialLoadDone: boolean
    loadJWTFromCookie(): void
    login(emailOrUsername: string, password: string): Promise<void>
    logout(): Promise<void>
    changePassword(
        newPassword: string,
        confirmPassword: string,
        validationType: Website.Api.Endpoints.Auth.ResetPasswordRequestBody["type"],
        validationValue: string,
    ): Promise<void>
    updateUser(): Promise<void>
    // updateJwt(jwt: string): void
    // revokeJWT(): void
    jwt?: string
    user?: Website.Users.User
}

const useAuthZustand = create<AuthZustand>()((set, get) => {
    return {
        initialLoadDone: false,
        loadJWTFromCookie: () => {
            const jwt = getCookieValue(JWT_Cookie_Name)

            set({ initialLoadDone: true, jwt })
        },
        login: async (emailOrUsername, password) => {
            const { response: user } = await makeApiRequest<Website.Users.User>(
                "/api/auth/login",
                "json",
                {
                    contentType: "application/json",
                    body: JSON.stringify({
                        emailOrUsername,
                        password,
                    }),
                    method: "POST",
                    noAuthorization: true,
                },
            )

            set({
                user,
            })
        },
        logout: async () => {
            await makeApiRequest<null>("/api/auth/logout", "json", {
                method: "POST",
            })

            set({
                user: undefined,
            })
        },
        changePassword: async (
            newPassword,
            confirmPassword,
            validationType,
            validationValue,
        ) => {
            const body: Website.Api.Endpoints.Auth.ResetPasswordRequestBody =
                validationType === "password"
                    ? {
                          type: "password",
                          oldPassword: validationValue,
                          newPassword,
                          confirmPassword,
                      }
                    : {
                          type: "token",
                          token: validationValue,
                          newPassword,
                          confirmPassword,
                      }

            await makeApiRequest<null>("/api/auth/changePassword", "json", {
                contentType: "application/json",
                method: "POST",
                body: JSON.stringify(body),
                noAuthorization: validationType === "token",
            })
        },
        updateUser: async () => {
            if (get().user === undefined) {
                const { response: user } =
                    await makeApiRequest<Website.Users.User>(
                        "/api/users/me",
                        "json",
                        {
                            method: "GET",
                        },
                    )

                set({
                    user: user,
                })
            }
        },
    }
})

export default useAuthZustand
