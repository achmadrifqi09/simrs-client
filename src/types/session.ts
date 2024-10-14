import { DefaultSession } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        expires?: string;
        user: {
            id?: number;
            email?: string;
            name?: string;
        } & DefaultSession["user"];
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        accessToken: string;
        expires: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
    }
}