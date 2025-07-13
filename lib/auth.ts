import { NextAuthOptions } from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      authorization: {
        params: {
          scope: "read:user user:email repo read:org",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user, token }) {
      if (session.user && user) {
        session.user.id = user.id
        // Add user's GitHub access token to session for API calls
        if (token.accessToken) {
          session.accessToken = token.accessToken as string
        }
      } else if (session.user && token?.sub) {
        session.user.id = token.sub
        if (token.accessToken) {
          session.accessToken = token.accessToken as string
        }
      }
      return session
    },
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token
        token.githubId = profile.id
      }
      return token
    },

    async signIn({ user, account, profile }) {
      if (account?.provider === "github" && profile) {
        try {
          // Store additional GitHub info
          await prisma.user.update({
            where: { id: user.id },
            data: {
              githubId: profile.id,
              githubUsername: profile.login,
            },
          })
        } catch (error) {
          console.error('Error updating user with GitHub info:', error)
        }
      }
      return true
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
} 