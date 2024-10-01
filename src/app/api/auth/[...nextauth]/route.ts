import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {generateClientKey} from "@/lib/crypto-js/cipher";
import NextAuth, {NextAuthOptions} from "next-auth";
import {JWT} from "next-auth/jwt";
import moment from 'moment-timezone';
import {signOut} from "next-auth/react";

type LoginCredentials = {
    email: string;
    password: string;
}


const authOptions: NextAuthOptions = {
    secret: process.env.PUBLIC_NEXTAUTH_SECRET || 'RSUMM@17082013',
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},
            async authorize(credentials) {
                if (!credentials) return null;

                const { email, password } = credentials as LoginCredentials;
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
                        JSON.stringify({
                            email : email,
                            password: password,
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'client-key': generateClientKey(),
                            },
                        }
                    );

                    if (!response?.data?.data) return null
                    return response.data.data;
                } catch (error) {

                    if (axios.isAxiosError(error)) {
                        if (error?.response?.data) {
                            throw new Error(error?.response?.data.errors)
                        }
                    } else {
                        throw new Error('Terjadi kesalahan yang tidak terduga');
                    }
                }
            },
        }),
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async jwt({token, user}: { token: JWT; user: any }) {
            if (user) {
                token.accessToken = user.token;
                token.expires = user.expires;
                token.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
            return token;
        },
        async session({session, token}: { session: any; token: JWT }) {
            const expires =  moment(token.expires as number).valueOf();
            const isExpired = moment().isAfter(expires)

            if (isExpired) {
                await signOut()
                return null;
            }

            session.accessToken = token.accessToken as string;
            session.expires = token.expires
            session.user = token.user
            return session;
        },
    },
};
const handler: any = NextAuth(authOptions);

export {handler as GET, handler as POST};