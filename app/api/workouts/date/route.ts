import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dateParam = req.nextUrl.searchParams.get('date');

  if (!dateParam) {
    return NextResponse.json({ error: 'Missing date param' }, { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const parsedDate = new Date(dateParam);
    parsedDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(parsedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const workouts = await prisma.workout.findMany({
      where: {
        userId: user.id,
        days: {
          some: {
            date: {
              gte: parsedDate,
              lt: nextDay,
            },
          },
        },
      },
      include: {
        days: {
          where: {
            date: {
              gte: parsedDate,
              lt: nextDay,
            },
          },
          include: {
            exercises: {
              include: {
                exerciseType: true,
                setGroup: {
                  include: {
                    sets: {
                      include: {
                        dropSets: true, // ✅ Включаем DropSets, вместо subSets
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ days: workouts });
  } catch (error) {
    console.error('❌ Ошибка при получении тренировок по дате:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
