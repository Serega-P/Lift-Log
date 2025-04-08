import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ExerciseCreateType } from '@/app/types/types';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log('🔹 GET session:', session);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: Number(session.user.id) },
      select: {
        id: true,
        color: true,
        title: true,
        days: {
          select: {
            id: true,
            date: true,
          },
        },
      },
    });

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('❌ Ошибка при получении тренировок:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

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

    // 1️⃣ Создаём воркаут
    const newWorkout = await prisma.workout.create({
      data: {
        title,
        color,
        userId,
      },
    });

    // 2️⃣ Создаём день тренировки
    const newWorkoutDay = await prisma.workoutDay.create({
      data: {
        date: null,
        workoutId: newWorkout.id,
        exercises: {
          create: await Promise.all(
            exercises.map(async (exercise: { name: string; setGroup?: ExerciseCreateType }) => {
              // Проверяем, существует ли ExerciseType с таким именем для пользователя
              let exerciseType = await prisma.exerciseType.findFirst({
                where: {
                  name: exercise.name,
                  userId,
                },
              });

              // Если нет, создаём новый ExerciseType
              if (!exerciseType) {
                exerciseType = await prisma.exerciseType.create({
                  data: {
                    name: exercise.name,
                    userId,
                  },
                });
              }

              return {
                exerciseTypeId: exerciseType.id,
                setGroup: exercise.setGroup
                  ? {
                      create: exercise.setGroup,
                    }
                  : { create: {} }, // Пустая группа сетов, если не передана
              };
            }),
          ),
        },
      },
      include: {
        exercises: {
          include: {
            exerciseType: true, // Включаем информацию о типе упражнения
            setGroup: true,
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
