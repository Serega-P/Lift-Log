import { NextResponse } from 'next/server';
import { prisma } from '@/prisma/prisma-client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // Получаем все ExerciseType для текущего пользователя
    const exerciseTypes = await prisma.exerciseType.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        name: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        exercises: {
          orderBy: { createdAt: 'desc' }, // Сортируем по дате создания, чтобы взять последний
          take: 1, // Берём только последний Exercise
          select: {
            id: true,
            workoutDayId: true,
            exerciseTypeId: true,
            setGroup: {
              select: {
                id: true,
                exerciseId: true,
                sets: {
                  select: {
                    id: true,
                    type: true,
                    order: true,
                    weight: true,
                    reps: true,
                    isTriSet: true,
                    subSets: {
                      select: {
                        id: true,
                        order: true,
                        weight: true,
                        reps: true,
                        createdAt: true,
                        updatedAt: true,
                      },
                    },
                    setGroupId: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
                createdAt: true,
                updatedAt: true,
              },
            },
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // Форматируем результат в формат ExerciseType
    const formattedExercises = exerciseTypes
      .filter((et) => et.exercises.length > 0) // Только те ExerciseType, у которых есть Exercise
      .map((et) => {
        const lastExercise = et.exercises[0];
        return {
          id: lastExercise.id,
          workoutDayId: lastExercise.workoutDayId,
          exerciseTypeId: lastExercise.exerciseTypeId,
          exerciseType: {
            id: et.id,
            name: et.name,
            userId: et.userId,
            createdAt: et.createdAt,
            updatedAt: et.updatedAt,
          },
          setGroup: lastExercise.setGroup.map((group) => ({
            id: group.id,
            exerciseId: group.exerciseId,
            sets: group.sets,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
          })),
          createdAt: lastExercise.createdAt,
          updatedAt: lastExercise.updatedAt,
        };
      });

    return NextResponse.json(formattedExercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
}
