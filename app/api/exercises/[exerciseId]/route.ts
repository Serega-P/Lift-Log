export const dynamic = 'force-dynamic';

import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(request: Request, { params }: { params: { exerciseId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session?.user || !('id' in session.user)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const userId = Number(session.user.id);
  const exerciseId = Number(params.exerciseId);

  const { name } = await request.json();

  try {
    const updated = await prisma.exerciseType.updateMany({
      where: {
        id: exerciseId, // обязательно
        userId,
      },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Not found or no permission' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Ошибка при обновлении названия упражнения:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
