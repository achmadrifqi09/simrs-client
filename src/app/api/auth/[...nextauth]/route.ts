import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';
import NextAuth, {NextAuthOptions} from 'next-auth';
import {JWT} from 'next-auth/jwt';
import type {LoginCredentials} from '@/types/auth';

const authOptions: NextAuthOptions = {
    secret: process.env.PUBLIC_NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error('Username dan password diperlukan');
                }

                try {
                    const response = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
                        {
                            username: credentials.username,
                            password: credentials.password,
                        },
                        {
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );

                    if (!response?.data?.data) {
                        throw new Error('Invalid response from server');
                    }

                    const accessToken = response.data.data;

                    const branchResponse = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_BASE_URL}/list_branches`,
                        {
                            headers: {
                                Authorization: `Bearer ${accessToken}`,
                            },
                        }
                    );

                    const branches = branchResponse.data.data;

                    if (!branches || branches.length === 0) {
                        throw new Error('No branch data available for user');
                    }

                    return {
                        token: accessToken,
                        expires: 'some_time',
                        branches: branches,
                        id: branches[0]?.user_id || 'unknown',
                        name: branches[0]?.user_name || 'User',
                    };

                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        const errorMessage = error.response?.data?.message ||
                            error.response?.data?.errors ||
                            'Username atau password salah';
                        throw new Error(errorMessage);
                    }
                    throw new Error('Terjadi kesalahan saat login');
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    pages: {
        signIn: '/auth/login',
        signOut: '/auth/logout',
        error: '/auth/login',
    },
    callbacks: {
        async jwt({token, user}: { token: JWT; user: any }) {
            if (user) {
                token.accessToken = user.token;
                token.expires = user.expires;
                token.user = {
                    id: user.id,
                    name: user.name,
                };
                token.branches = user.branches;
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
            session.branches = token.branches;
            return session;
        },
        async redirect({baseUrl}: {baseUrl: string}) {
            return baseUrl;
        },
    }
};
const handler: any = NextAuth(authOptions);

export {handler as GET, handler as POST};
