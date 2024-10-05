import { Session } from "next-auth";

export interface NextAuthSession extends Session {
    apiToken?: string;
}
