import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

// NextAuth route handler for the App Router — handles login/logout/session.
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
