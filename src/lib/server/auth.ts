import { env } from "$src/env";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import { loginAction } from "./auth/queries/ login";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
        } & DefaultSession["user"];
    }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: token.sub,
            },
            maxAge: 30 * 24 * 60 * 60, // 30 days
        }),
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                id: { label: "User ID", type: "usedId" },
            },
            async authorize(credentials, req) {
                if (!credentials) {
                    return null;
                }
                const res = await loginAction(credentials.id);
                if (!res.success) {
                    return null;
                }
                return {
                    id: credentials.id,
                };
            },
        }),
    ],
    secret: env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
