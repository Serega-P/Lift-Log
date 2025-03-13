import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { ExerciseType } from '@/app/types/types';

export async function GET(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const workoutId = Number(params.workoutId);

    if (isNaN(workoutId)) {
      return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }

    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        days: {
          where: { date: { not: null } },
          orderBy: { updatedAt: 'desc' },
          take: 1,
          include: {
            exercises: {
              include: {
                setGroup: {
                  include: {
                    sets: {
                      orderBy: { order: 'asc' },
                      include: {
                        subSets: { orderBy: { order: 'asc' } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        exercises: {
          include: {
            setGroup: {
              include: {
                sets: {
                  include: { subSets: true },
                },
              },
            },
          },
        },
      },
    });

    if (!workout) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    const lastWorkoutDay = workout.days.length > 0 ? workout.days[0] : null;

    return NextResponse.json({
      ...workout,
      days: lastWorkoutDay ? [lastWorkoutDay] : [],
      exercises: lastWorkoutDay ? [] : workout.exercises,
    });
  } catch (error) {
    console.error('Ошибка при получении тренировки:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const { exercises }: { exercises: ExerciseType[] } = await req.json();
    const workoutId = Number(params.workoutId);

    if (isNaN(workoutId) || !Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const newWorkoutDay = await prisma.workoutDay.create({
      data: {
        date: today,
        workoutId,
        exercises: {
          create: exercises.map((exercise) => ({
            workoutId,
            name: exercise.name,
            setGroup: exercise.setGroup
              ? {
                  create: exercise.setGroup.map((group) => ({
                    sets: group.sets
                      ? {
                          create: group.sets.map((set) => ({
                            type: set.type,
                            order: set.order,
                            weight: set.weight !== '' ? Number(set.weight) : null,
                            reps: set.reps !== '' ? Number(set.reps) : null,
                            isTriSet: set.isTriSet,
                            subSets: set.subSets
                              ? {
                                  create: set.subSets.map((subSet) => ({
                                    order: subSet.order,
                                    weight: subSet.weight !== '' ? Number(subSet.weight) : null,
                                    reps: subSet.reps !== '' ? Number(subSet.reps) : null,
                                  })),
                                }
                              : undefined,
                          })),
                        }
                      : undefined,
                  })),
                }
              : undefined,
          })),
        },
      },
      include: {
        exercises: {
          include: {
            setGroup: {
              include: {
                sets: {
                  include: {
                    subSets: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(newWorkoutDay, { status: 201 });
  } catch (error) {
    console.error('❌ Ошибка при сохранении тренировки:', error);
    return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const { exercises }: { exercises: ExerciseType[] } = await req.json();
    const workoutId = Number(params.workoutId);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(workoutId) || !Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    // Находим workoutDay за сегодня
    const workoutDay = await prisma.workoutDay.findFirst({
      where: {
        workoutId: workoutId,
        date: today,
      },
      include: {
        exercises: { include: { setGroup: { include: { sets: { include: { subSets: true } } } } } },
      },
    });

    if (!workoutDay) {
      return NextResponse.json({ error: 'Workout day not found' }, { status: 404 });
    }

    // Удаляем все существующие упражнения и их зависимости
    const exercisesToDelete = workoutDay.exercises.map((ex) => ex.id);

    if (exercisesToDelete.length > 0) {
      // Удаляем все subSets
      const subSetsToDelete = workoutDay.exercises
        .flatMap((ex) => ex.setGroup)
        .flatMap((sg) => sg.sets)
        .flatMap((set) => set.subSets.map((subSet) => subSet.id));

      if (subSetsToDelete.length > 0) {
        await prisma.subSet.deleteMany({
          where: { id: { in: subSetsToDelete } },
        });
      }

      // Удаляем все sets
      const setsToDelete = workoutDay.exercises
        .flatMap((ex) => ex.setGroup)
        .flatMap((sg) => sg.sets.map((set) => set.id));

      if (setsToDelete.length > 0) {
        await prisma.set.deleteMany({
          where: { id: { in: setsToDelete } },
        });
      }

      // Удаляем все setGroup
      const setGroupsToDelete = workoutDay.exercises
        .map((ex) => ex.setGroup.map((sg) => sg.id))
        .flat();

      if (setGroupsToDelete.length > 0) {
        await prisma.sets.deleteMany({
          where: { id: { in: setGroupsToDelete } },
        });
      }

      // Удаляем сами упражнения
      await prisma.exercise.deleteMany({
        where: { id: { in: exercisesToDelete } },
      });
    }

    // Создаем новые упражнения
    const updatedWorkoutDay = await prisma.workoutDay.update({
      where: { id: workoutDay.id },
      data: {
        updatedAt: new Date(),
        exercises: {
          create: exercises.map((exercise) => ({
            name: exercise.name,
            workout: { connect: { id: workoutId } },
            setGroup: exercise.setGroup
              ? {
                  create: exercise.setGroup.map((group) => ({
                    sets: {
                      create: group.sets.map((set) => ({
                        type: set.type,
                        order: set.order,
                        weight: set.weight !== '' ? Number(set.weight) : null,
                        reps: set.reps !== '' ? Number(set.reps) : null,
                        isTriSet: set.isTriSet,
                        subSets: {
                          create: set.subSets.map((subSet) => ({
                            order: subSet.order,
                            weight: subSet.weight !== '' ? Number(subSet.weight) : null,
                            reps: subSet.reps !== '' ? Number(subSet.reps) : null,
                          })),
                        },
                      })),
                    },
                  })),
                }
              : undefined,
          })),
        },
      },
      include: { exercises: true },
    });

    return NextResponse.json(updatedWorkoutDay, { status: 200 });
  } catch (error) {
    console.error('❌ Ошибка при обновлении тренировки:', error);
    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
}
