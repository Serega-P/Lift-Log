// /lib/api/workoutHandlers.ts
import { prisma } from '@/prisma/prisma-client';
import { WorkoutDayWithExercises, SetGroupType, SetType, SubSetType } from '@/app/types/types';

// Вспомогательная функция для проверки workoutId
const validateWorkoutId = (workoutId: string): number => {
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
        // where: { date: { not: null } },
        orderBy: { updatedAt: 'desc' },
        take: 1,
        include: {
          exercises: {
            include: {
              exerciseType: true,
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
    },
  });

  if (!workout) {
    throw new Error('Workout not found');
  }

  const lastWorkoutDay = workout.days.length > 0 ? workout.days[0] : null;

  return {
    ...workout,
    days: lastWorkoutDay ? [lastWorkoutDay] : [],
  };
};

// Тип для входных данных упражнений
type ExerciseInput = {
  name: string;
  workoutId: number;
  setGroup?: SetGroupType[];
};

// Функция для создания нового WorkoutDay (POST)
export const createWorkoutDay = async (
  workoutId: string,
  exercises: ExerciseInput[],
): Promise<WorkoutDayWithExercises> => {
  const id = validateWorkoutId(workoutId);

  if (!Array.isArray(exercises)) {
    throw new Error('Invalid request data');
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  console.log('today', today);

  const userId = (await prisma.workout.findUnique({ where: { id } }))?.userId;
  if (!userId) {
    throw new Error('Workout not found');
  }

  const newWorkoutDay = await prisma.workoutDay.create({
    data: {
      date: today,
      workoutId: id,
      exercises: {
        create: await Promise.all(
          exercises.map(async (exercise) => {
            // Проверяем или создаём ExerciseType
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
              setGroup: exercise.setGroup?.length
                ? {
                    create: exercise.setGroup.map((group: SetGroupType) => {
                      if (!group.sets || group.sets.length === 0) {
                        return {};
                      }
                      return {
                        sets: {
                          create: group.sets.map((set: SetType) => ({
                            type: set.type,
                            order: set.order,
                            weight: set.weight !== undefined ? Number(set.weight) : null,
                            reps: set.reps !== undefined ? Number(set.reps) : null,
                            isTriSet: set.isTriSet,
                            subSets: set.subSets?.length
                              ? {
                                  create: set.subSets.map((subSet: SubSetType) => ({
                                    order: subSet.order,
                                    weight:
                                      subSet.weight !== undefined ? Number(subSet.weight) : null,
                                    reps: subSet.reps !== undefined ? Number(subSet.reps) : null,
                                  })),
                                }
                              : undefined,
                          })),
                        },
                      };
                    }),
                  }
                : { create: {} },
            };
          }),
        ),
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
                  subSets: true,
                },
              },
            },
          },
        },
      },
      workout: true,
    },
  });

  return newWorkoutDay as WorkoutDayWithExercises;
};

// Вспомогательная функция для удаления существующих упражнений и их зависимостей
const deleteExistingExercises = async (workoutDay: WorkoutDayWithExercises): Promise<void> => {
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

    // Удаляем все setGroup
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
export const updateWorkoutDay = async (
  workoutId: string,
  exercises: ExerciseInput[],
): Promise<WorkoutDayWithExercises> => {
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
      exercises: {
        include: {
          setGroup: { include: { sets: { include: { subSets: true } } } },
          exerciseType: true,
        },
      },
      workout: true,
    },
  });

  if (!workoutDay) {
    throw new Error('Workout day not found');
  }

  const userId = workoutDay.workout?.userId;
  if (!userId) {
    throw new Error('Workout not found');
  }

  // Удаляем существующие упражнения и их зависимости
  await deleteExistingExercises(workoutDay);

  // Создаем новые упражнения
  const updatedWorkoutDay = await prisma.workoutDay.update({
    where: { id: workoutDay.id },
    data: {
      updatedAt: new Date(),
      exercises: {
        create: await Promise.all(
          exercises.map(async (exercise) => {
            // Проверяем или создаём ExerciseType
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
              setGroup: exercise.setGroup?.length
                ? {
                    create: exercise.setGroup.map((group: SetGroupType) => {
                      if (!group.sets || group.sets.length === 0) {
                        return {};
                      }
                      return {
                        sets: {
                          create: group.sets.map((set: SetType) => ({
                            type: set.type,
                            order: set.order,
                            weight: set.weight !== undefined ? Number(set.weight) : null,
                            reps: set.reps !== undefined ? Number(set.reps) : null,
                            isTriSet: set.isTriSet,
                            subSets: set.subSets?.length
                              ? {
                                  create: set.subSets.map((subSet: SubSetType) => ({
                                    order: subSet.order,
                                    weight:
                                      subSet.weight !== undefined ? Number(subSet.weight) : null,
                                    reps: subSet.reps !== undefined ? Number(subSet.reps) : null,
                                  })),
                                }
                              : undefined,
                          })),
                        },
                      };
                    }),
                  }
                : { create: {} },
            };
          }),
        ),
      },
    },
    include: {
      exercises: {
        include: {
          exerciseType: true,
          setGroup: {
            include: {
              sets: { include: { subSets: true } },
            },
          },
        },
      },
      workout: true,
    },
  });

  return updatedWorkoutDay as WorkoutDayWithExercises;
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
