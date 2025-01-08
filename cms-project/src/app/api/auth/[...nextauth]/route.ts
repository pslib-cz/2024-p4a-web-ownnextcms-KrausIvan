import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Username and Password",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) {
                    throw new Error("Missing username or password");
                }

                const user = await prisma.user.findUnique({
                    where: { username: credentials.username },
                });

                if (!user || !(await bcrypt.compare(credentials.password, user.password))) {
                    throw new Error("Invalid credentials");
                }

                return { id: user.id.toString(), name: user.username, email: user.email };
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async session({ session, token }) {
            if (token) {
                if (session.user) {
                    // @ts-ignore
                    session.user.id = token.id;
                }
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
    },
});