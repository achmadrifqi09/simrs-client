import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import {generateClientKey} from '@/lib/crypto-js/cipher';
import NextAuth, {NextAuthOptions} from 'next-auth';
import {JWT} from 'next-auth/jwt';
import type {LoginCredentials} from '@/types/auth';

const authOptions: NextAuthOptions = {
    secret: process.env.PUBLIC_NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {},
            async authorize(credentials) {
                if (!credentials) return null;

                const {email, password} = credentials as LoginCredentials;
                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
                        JSON.stringify({
                            email: email,
                            password: password,
                        }),
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                'client-signature': generateClientKey(),
                                'client-id': process.env.NEXT_PUBLIC_CLIENT_ID,
                            },
                        }
                    );
                    if (!response?.data?.data) return null;
                    return response.data.data;
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        if (error?.response?.data) {
                            throw new Error(error?.response?.data.errors);
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
                    permissions: user.permissions,
                };
            }

            return token;
        },
        async session({session, token}: { session: any; token: JWT }) {
            if (token.error === "RefreshAccessTokenError") {
                session.error = "RefreshAccessTokenError"
            }
            session.accessToken = token.accessToken as string;
            session.expires = token.expires;
            session.user = token.user;
            return session;
        },
    },
};
const handler: any = NextAuth(authOptions);

export {handler as GET, handler as POST};
