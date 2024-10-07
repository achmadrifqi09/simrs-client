import { Session } from "next-auth";

export interface NextAuthSession extends Session {
    accessToken?: string;
}
