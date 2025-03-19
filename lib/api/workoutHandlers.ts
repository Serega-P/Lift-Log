// /lib/api/workoutHandlers.ts
import { prisma } from '@/prisma/prisma-client';
// import { NextRequest, NextResponse } from 'next/server';
import { ExerciseType, WorkoutDayWithExercises } from '@/app/types/types';

// Вспомогательная функция для проверки workoutId
const validateWorkoutId = (workoutId: string) => {
  const id = Number(workoutId);
  if (isNaN(id)) {
    throw new Error('Invalid workout ID');
  }
  return id;
};

// Функция для получения тренировки (GET)
export const getWorkout = async (workoutId: string) => {
  const id = validateWorkoutId(workoutId);

  const workout = await prisma.workout.findUnique({
    where: { id },
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
    throw new Error('Workout not found');
  }

  const lastWorkoutDay = workout.days.length > 0 ? workout.days[0] : null;

  return {
    ...workout,
    days: lastWorkoutDay ? [lastWorkoutDay] : [],
    exercises: lastWorkoutDay ? [] : workout.exercises,
  };
};

// Функция для создания нового WorkoutDay (POST)
export const createWorkoutDay = async (workoutId: string, exercises: ExerciseType[]) => {
  const id = validateWorkoutId(workoutId);

  if (!Array.isArray(exercises)) {
    throw new Error('Invalid request data');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newWorkoutDay = await prisma.workoutDay.create({
    data: {
      date: today,
      workoutId: id,
      exercises: {
        create: exercises.map((exercise) => ({
          workoutId: id,
          name: exercise.name,
          setGroup: exercise.setGroup?.length
            ? {
                create: exercise.setGroup.map((group) => {
                  // Проверяем, что group.sets существует и не пустой
                  if (!group.sets || group.sets.length === 0) {
                    return { sets: undefined };
                  }
                  return {
                    sets: {
                      create: group.sets.map((set) => {
                        // Проверяем, что set.subSets существует и не пустой
                        if (!set.subSets || set.subSets.length === 0) {
                          return {
                            type: set.type,
                            order: set.order,
                            weight: set.weight !== '' ? Number(set.weight) : null,
                            reps: set.reps !== '' ? Number(set.reps) : null,
                            isTriSet: set.isTriSet,
                            subSets: undefined,
                          };
                        }
                        return {
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
                        };
                      }),
                    },
                  };
                }),
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

  return newWorkoutDay;
};

// Вспомогательная функция для удаления существующих упражнений и их зависимостей
const deleteExistingExercises = async (workoutDay: WorkoutDayWithExercises) => {
  const exercisesToDelete = workoutDay.exercises.map((ex) => ex.id);

  if (exercisesToDelete.length > 0) {
    // Удаляем все subSets
    const subSetsToDelete = workoutDay.exercises
      .flatMap((ex) => ex.setGroup ?? [])
      .flatMap((sg) => sg.sets ?? [])
      .flatMap((set) => set.subSets?.map((subSet) => subSet.id) ?? []);

    if (subSetsToDelete.length > 0) {
      await prisma.subSet.deleteMany({
        where: { id: { in: subSetsToDelete } },
      });
    }

    // Удаляем все sets
    const setsToDelete = workoutDay.exercises
      .flatMap((ex) => ex.setGroup ?? [])
      .flatMap((sg) => sg.sets?.map((set) => set.id) ?? []);

    if (setsToDelete.length > 0) {
      await prisma.set.deleteMany({
        where: { id: { in: setsToDelete } },
      });
    }

    // Удаляем все setGroup (в схеме Prisma это модель Sets)
    const setGroupsToDelete = workoutDay.exercises
      .flatMap((ex) => ex.setGroup?.map((sg) => sg.id) ?? [])
      .filter((id): id is number => id !== undefined);

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
};

// Функция для обновления WorkoutDay (PATCH для упражнений)
export const updateWorkoutDay = async (workoutId: string, exercises: ExerciseType[]) => {
  const id = validateWorkoutId(workoutId);

  if (!Array.isArray(exercises)) {
    throw new Error('Invalid request data');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Находим workoutDay за сегодня
  const workoutDay = await prisma.workoutDay.findFirst({
    where: {
      workoutId: id,
      date: today,
    },
    include: {
      exercises: { include: { setGroup: { include: { sets: { include: { subSets: true } } } } } },
    },
  });

  if (!workoutDay) {
    throw new Error('Workout day not found');
  }

  // Удаляем существующие упражнения и их зависимости
  await deleteExistingExercises(workoutDay);

  // Создаем новые упражнения
  const updatedWorkoutDay = await prisma.workoutDay.update({
    where: { id: workoutDay.id },
    data: {
      updatedAt: new Date(),
      exercises: {
        create: exercises.map((exercise) => ({
          name: exercise.name,
          workout: { connect: { id } },
          setGroup: exercise.setGroup?.length
            ? {
                create: exercise.setGroup.map((group) => {
                  // Проверяем, что group.sets существует и не пустой
                  if (!group.sets || group.sets.length === 0) {
                    return { sets: undefined };
                  }
                  return {
                    sets: {
                      create: group.sets.map((set) => {
                        // Проверяем, что set.subSets существует и не пустой
                        if (!set.subSets || set.subSets.length === 0) {
                          return {
                            type: set.type,
                            order: set.order,
                            weight: set.weight !== '' ? Number(set.weight) : null,
                            reps: set.reps !== '' ? Number(set.reps) : null,
                            isTriSet: set.isTriSet,
                            subSets: undefined,
                          };
                        }
                        return {
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
                        };
                      }),
                    },
                  };
                }),
              }
            : undefined,
        })),
      },
    },
    include: { exercises: true },
  });

  return updatedWorkoutDay;
};

// Функция для обновления самой тренировки (PATCH для title и color)
export const updateWorkout = async (workoutId: string, title?: string, color?: string) => {
  const id = validateWorkoutId(workoutId);

  const updateData: { title?: string; color?: string } = {};
  if (title) updateData.title = title;
  if (color) updateData.color = color;

  if (!Object.keys(updateData).length) {
    throw new Error('No data to update');
  }

  const updatedWorkout = await prisma.workout.update({
    where: { id },
    data: updateData,
  });

  return updatedWorkout;
};
