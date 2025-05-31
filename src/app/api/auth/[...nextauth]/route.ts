import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import NextAuth, { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import type { LoginCredentials } from "@/types/auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    token: string;
    branches: any[];
    user: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    branches: any[];
    user: {
      id: string;
      name: string;
      email: string;
      branchData: any;
    };
  }
}

const authOptions: NextAuthOptions = {
  secret: process.env.PUBLIC_NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials) {
        if (!credentials) return null;

        const { username, password } = credentials as LoginCredentials;
        try {
          const loginResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
            JSON.stringify({
              username: username,
              password: password,
            }),
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!loginResponse?.data?.data) {
            throw new Error("Invalid response from server");
          }

          const branchResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/list_branches`,
            {
              headers: {
                Authorization: loginResponse.data.data,
              },
            }
          );

          if (!branchResponse?.data?.data) {
            throw new Error("Failed to fetch branch data");
          }

          console.log(branchResponse.data.data);
          console.log(loginResponse.data.data);

          // return {
          //   id: branchResponse.data.data[0].user_id,
          //   name: branchResponse.data.data[0].user_name,
          //   email: branchResponse.data.data[0].user_id,
          //   token: loginResponse.data.data,
          //   branches: branchResponse.data.data,
          //   user: branchResponse.data.data[0],
          // };
        } catch (error) {
          if (axios.isAxiosError(error)) {
            const errorMessage =
              error.response?.data?.message || error.message || "Login failed";
            throw new Error(errorMessage);
          }
          throw new Error("Terjadi kesalahan yang tidak terduga");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.accessToken = user.token;
        token.branches = user.branches;
        token.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          branchData: user.user,
        };
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (token.error === "RefreshAccessTokenError") {
        session.error = "RefreshAccessTokenError";
      }
      session.accessToken = token.accessToken;
      session.branches = token.branches;
      session.user = token.user;
      return session;
    },
    async redirect({ baseUrl }: { baseUrl: string }) {
      return baseUrl;
    },
  },
};

const handler: any = NextAuth(authOptions);

export { handler as GET, handler as POST };
