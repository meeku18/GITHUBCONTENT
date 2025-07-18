import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    accessToken?: string
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }

  interface Profile {
    id: string
    login: string
    name?: string
    email?: string
    avatar_url?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    githubId?: string
  }
} 