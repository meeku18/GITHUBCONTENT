import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Only create handler if required env vars are present
const handler = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET 
  ? NextAuth(authOptions)
  : (req: any, res: any) => {
      res.status(500).json({ error: "Authentication not configured" })
    }

export { handler as GET, handler as POST } 