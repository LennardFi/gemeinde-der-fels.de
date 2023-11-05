import Website from "@/typings"

interface TestUser {
    name: string
    password: string
    flags: Website.Users.UserFlags
}

export const users: TestUser[] = [
    {
        name: "admin",
        password: "admin",
        flags: {
            Admin: true,
            ManageCalendar: true,
            ManageNews: true,
            ManageRooms: true,
            ManageSermons: true,
            ManageUser: true,
        },
    },
    {
        name: "manager",
        password: "manager",
        flags: {
            ManageCalendar: true,
            ManageNews: true,
            ManageRooms: true,
            ManageSermons: true,
            ManageUser: true,
        },
    },
    {
        name: "user",
        password: "user",
        flags: {},
    },
]
