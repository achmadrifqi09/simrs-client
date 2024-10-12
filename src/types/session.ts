import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user?: {
            id?: number;
            email?: string;
            name: string
        } & DefaultSession["user"];
    }
}