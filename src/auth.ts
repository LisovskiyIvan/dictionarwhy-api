import { UsersDatabase } from "./db"


export async function auth(db: UsersDatabase, headers:  Record<string, string | undefined>) {
    if (!headers.authorization) return "No auth headers"
    const authHeader = headers.authorization.split(" ")
    const token = atob(authHeader[authHeader.length - 1])
    const username = token.split(":")[0]
    const password = token.split(":")[1]
    const user = await db.getUserByData(username, password)
    if (!user) return "No user found"
    else return user
}