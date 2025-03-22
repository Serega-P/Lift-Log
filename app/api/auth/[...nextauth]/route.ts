import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      authorization: {
        params: {
          prompt: 'select_account consent', // Всегда показывать выбор аккаунта и заново запрашивать разрешения
          access_type: 'offline', // Получение refresh-токена
          response_type: 'code',
          hd: '*', // ⬅ Показывать все аккаунты, включая рабочие
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      try {
        let existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              fullName: user.name || 'No Name',
              email: user.email,
              image: user.image,
              provider: account?.provider || 'google',
            },
          });
        }
        return true;
      } catch (error) {
        console.error('Error checking user in DB:', error);
        return false;
      }
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string }).id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email as string },
          select: { id: true }, // Запрашиваем только ID пользователя
        });

        if (dbUser) {
          token.id = dbUser.id;
        }
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
