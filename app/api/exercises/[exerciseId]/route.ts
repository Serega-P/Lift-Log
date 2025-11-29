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

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  try {
    const updated = await prisma.exerciseType.update({
      where: {
        id: exerciseId,
        userId, // защита: обновим только если ID принадлежит юзеру
      },
      data: {
        name: name.trim(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({ success: true, exercise: updated });
  } catch (error) {
    console.error('❌ Ошибка при обновлении названия упражнения:', error);

    if (String(error).includes('Unique constraint')) {
      return NextResponse.json({ error: 'Exercise name already exists' }, { status: 409 });
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
