export const dynamic = 'force-dynamic';

import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log('🔹 GET session:', session);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // Получаем exercises
    const exercises = await prisma.exerciseType.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
      },
    });

    return NextResponse.json(exercises);
  } catch (error) {
    console.error('❌ Ошибка при получении exercises:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
