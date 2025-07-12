import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Check if required environment variables are set
const isAuthConfigured = process.env.GITHUB_CLIENT_ID && 
                        process.env.GITHUB_CLIENT_SECRET && 
                        process.env.NEXTAUTH_SECRET &&
                        process.env.NEXTAUTH_URL;

const handler = isAuthConfigured
  ? NextAuth(authOptions)
  : async () => {
      console.error("Auth configuration missing:", {
        GITHUB_CLIENT_ID: !!process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: !!process.env.GITHUB_CLIENT_SECRET,
        NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
        NEXTAUTH_URL: !!process.env.NEXTAUTH_URL,
      });
      
      return new Response(
        JSON.stringify({ 
          error: "Authentication not configured",
          details: "Missing required environment variables"
        }),
        { 
          status: 500, 
          headers: { "Content-Type": "application/json" } 
        }
      );
    };

export { handler as GET, handler as POST } 