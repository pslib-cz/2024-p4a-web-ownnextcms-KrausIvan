import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcrypt";

export const authOptions = {
    debug: true,
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("[authorize] Received credentials:", credentials);

                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });
                console.log("[authorize] Found user in DB:", user);

                if (!user) {
                    throw new Error("User not found");
                }

                const isPasswordValid = user.password
                    ? await bcrypt.compare(credentials.password, user.password)
                    : false;
                console.log("[authorize] Password validation result:", isPasswordValid);

                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.AUTH_SECRET,
    session: {
        strategy: "jwt" as const,
    },
    callbacks: {
        async jwt({ token, user, account }: { token: any; user?: any; account?: any }) {
            console.log("[jwt] Incoming token:", token);
            console.log("[jwt] Incoming user:", user);
            console.log("[jwt] Incoming account:", account);

            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
            }

            if (account?.provider === "github") {
                console.log("[jwt] Handling GitHub account:", account);

                const existingUser = await prisma.user.findUnique({
                    where: { email: token.email },
                });
                console.log("[jwt] Existing user:", existingUser);

                if (existingUser) {
                    const existingAccount = await prisma.account.findUnique({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            },
                        },
                    });
                    console.log("[jwt] Existing account:", existingAccount);

                    if (!existingAccount) {
                        console.log("[jwt] Creating new account for existing user");
                        await prisma.account.create({
                            data: {
                                userId: existingUser.id,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                type: account.type,
                                // @ts-ignore
                                accessToken: account.access_token,
                                tokenType: account.token_type,
                                expiresAt: account.expires_at,
                                scope: account.scope,
                            },
                        });
                    }

                    token.id = existingUser.id;
                } else {
                    console.log("[jwt] Creating new user and account");
                    const newUser = await prisma.user.create({
                        data: {
                            email: token.email,
                            name: token.name,
                            image: token.picture,
                            password: "",
                        },
                    });
                    console.log("[jwt] New user created:", newUser);

                    await prisma.account.create({
                        data: {
                            userId: newUser.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            type: account.type,
                            // @ts-ignore
                            accessToken: account.access_token,
                            tokenType: account.token_type,
                            expiresAt: account.expires_at,
                            scope: account.scope,
                        },
                    });
                    console.log("[jwt] New account created for user:", newUser);

                    token.id = newUser.id;
                }
            }

            console.log("[jwt] Final token:", token);
            return token;
        },

        async session({ session, token }: { session: any; token: any }) {
            console.log("[session] Incoming session:", session);
            console.log("[session] Incoming token:", token);

            session.user = {
                id: token.id,
                name: token.name,
                email: token.email,
            };
            session.isNewUser = token.isNewUser || false;

            console.log("[session] Final session:", session);
            return session;
        },

        async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
            console.log("[redirect] Incoming URL:", url);
            console.log("[redirect] Base URL:", baseUrl);

            if (url === "/dashboard") return "/dashboard";
            if (url.includes("isNewUser=true")) return "/login";

            return baseUrl;
        },
    },
};

// @ts-ignore
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };