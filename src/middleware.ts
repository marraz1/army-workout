import { withAuth } from 'next-auth/middleware'

// Protect the app routes: unauthenticated users are redirected to /login
// (pages.signIn). Login/register/api stay public.
export default withAuth({
  pages: { signIn: '/login' },
})

export const config = {
  matcher: [
    '/',
    '/onboarding',
    '/schedule',
    '/guide',
    '/progress',
    '/skip',
    '/profile',
    '/settings',
    '/notifications',
  ],
}
