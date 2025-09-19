import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Use Prisma instead of direct PostgreSQL client
          const { prisma } = await import('@/lib/prisma')
          
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
              password: true
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          console.log('Authentication successful for user:', {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          })

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: null
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        console.log('JWT callback - user:', user)
        token.role = user.role
        token.id = user.id
      }
      console.log('JWT callback - token:', token)
      return token
    },
    async session({ session, token }) {
      if (token) {
        console.log('Session callback - token:', token)
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      console.log('Session callback - session:', session)
      return session
    }
  },
  pages: {
    signIn: '/auth/signin'
  }
}
