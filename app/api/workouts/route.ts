import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { SetGroupType } from '@/app/types/types';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log('🔹 GET session:', session);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    const workouts = await prisma.workout.findMany({
      where: { userId },
      select: {
        id: true,
        color: true,
        title: true,
        days: {
          select: {
            id: true,
            date: true,
            createdAt: true,
            exercises: {
              include: {
                exerciseType: true,
                setGroup: {
                  include: {
                    sets: {
                      orderBy: { order: 'asc' },
                      include: {
                        // 🔥 теперь DropSets включены
                        dropSets: { orderBy: { order: 'asc' } },
                      },
                    },
                  },
                },
              },
            },
          },
          orderBy: { date: 'asc' },
        },
      },
    });

    const sortedWorkouts = [...workouts].sort((a, b) => {
      const latestDayA = a.days.length
        ? new Date(Math.max(...a.days.map((d) => new Date(d.createdAt).getTime())))
        : new Date(0);

      const latestDayB = b.days.length
        ? new Date(Math.max(...b.days.map((d) => new Date(d.createdAt).getTime())))
        : new Date(0);

      return latestDayA.getTime() - latestDayB.getTime();
    });

    return NextResponse.json(sortedWorkouts);
  } catch (error) {
    console.error('❌ Ошибка при получении тренировок:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

type ExerciseRequestInput = {
  name: string;
  setGroup?: SetGroupType[];
};

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log('🔹 POST session:', session);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, color, exercises } = await req.json();

    if (!title || !color || !Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const userId = Number(session.user.id);

    // 1️⃣ создаём воркаут
    const newWorkout = await prisma.workout.create({
      data: { title, color, userId },
    });

    // 2️⃣ создаём WorkoutDay и упражнения
    const newWorkoutDay = await prisma.workoutDay.create({
      data: {
        date: null,
        workoutId: newWorkout.id,
        ...(exercises.length > 0 && {
          exercises: {
            create: await Promise.all(
              exercises.map(async (exercise: ExerciseRequestInput) => {
                // ищем/создаём тип упражнения
                let exerciseType = await prisma.exerciseType.findFirst({
                  where: { name: exercise.name, userId },
                });

                if (!exerciseType) {
                  exerciseType = await prisma.exerciseType.create({
                    data: { name: exercise.name, userId },
                  });
                }

                return {
                  exerciseTypeId: exerciseType.id,
                  setGroup: exercise.setGroup?.length ? { create: exercise.setGroup } : undefined,
                };
              }),
            ),
          },
        }),
      },
      include: {
        exercises: {
          include: {
            exerciseType: true,
            setGroup: {
              include: {
                sets: {
                  include: {
                    dropSets: true, // 🔥 ещё раз включаем на всякий случай
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({ ...newWorkout, days: [newWorkoutDay] }, { status: 201 });
  } catch (error) {
    console.error('❌ Ошибка при создании тренировки:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
