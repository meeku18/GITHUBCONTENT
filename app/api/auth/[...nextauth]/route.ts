import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
  ? NextAuth(authOptions)
  : async () => new Response(
      JSON.stringify({ error: "Authentication not configured" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );

export { handler as GET, handler as POST } 