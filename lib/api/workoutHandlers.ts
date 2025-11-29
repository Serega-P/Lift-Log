// /lib/api/workoutHandlers.ts
import { prisma } from '@/prisma/prisma-client';
import { Prisma } from '@prisma/client';
import { WorkoutDayWithExercises, SetGroupType, SetType } from '@/app/types/types';

// --- Валидация workoutId ---
const validateWorkoutId = (workoutId: string): number => {
  const id = Number(workoutId);
  if (isNaN(id)) throw new Error('Invalid workout ID');
  return id;
};

// --- GET workout ---
export const getWorkout = async (workoutId: string) => {
  const id = validateWorkoutId(workoutId);

  const workout = await prisma.workout.findUnique({
    where: { id },
    include: {
      days: {
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
                      dropSets: { orderBy: { order: 'asc' } }, // ✅ dropsets only!
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

  if (!workout) throw new Error('Workout not found');

  const lastDay = workout.days.length ? workout.days[0] : null;

  return {
    ...workout,
    days: lastDay ? [lastDay] : [],
  };
};

// --- Тип входящих упражнений ---
type ExerciseInput = {
  name: string;
  workoutId: number;
  setGroup?: SetGroupType[];
};

// --- CREATE workout day ---
export const createWorkoutDay = async (
  workoutId: string,
  exercises: ExerciseInput[],
): Promise<WorkoutDayWithExercises> => {
  const id = validateWorkoutId(workoutId);
  if (!Array.isArray(exercises)) throw new Error('Invalid request data');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const userId = (await prisma.workout.findUnique({ where: { id } }))?.userId;
  if (!userId) throw new Error('Workout not found');

  const newDay = await prisma.workoutDay.create({
    data: {
      date: today,
      workoutId: id,
      exercises: {
        create: await Promise.all(
          exercises.map(async (ex) => {
            let exerciseType = await prisma.exerciseType.findFirst({
              where: { name: ex.name, userId },
            });
            if (!exerciseType) {
              exerciseType = await prisma.exerciseType.create({
                data: { name: ex.name, userId },
              });
            }

            return {
              exerciseTypeId: exerciseType.id,
              setGroup: ex.setGroup?.length
                ? {
                    create: ex.setGroup.map((group: SetGroupType) => ({
                      sets: group.sets?.length
                        ? {
                            create: group.sets.map((set: SetType) => ({
                              type: set.type,
                              order: set.order,
                              weight: set.weight ?? null,
                              reps: set.reps ?? null,

                              // ✅ CREATE dropsets if exist
                              dropSets: set.dropSets?.length
                                ? {
                                    create: set.dropSets.map((drop) => ({
                                      order: drop.order,
                                      weight: drop.weight ?? null,
                                      reps: drop.reps ?? null,
                                    })),
                                  }
                                : undefined,
                            })),
                          }
                        : undefined,
                    })),
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
              sets: { include: { dropSets: true } },
            },
          },
        },
      },
      workout: true,
    },
  });

  return newDay;
};

// --- DELETE all old exercises + sets + dropsets ---
const deleteExistingExercises = async (workoutDay: WorkoutDayWithExercises) => {
  for (const ex of workoutDay.exercises) {
    for (const group of ex.setGroup ?? []) {
      for (const set of group.sets ?? []) {
        // ✅ DELETE dropsets properly
        if (set.dropSets?.length) {
          await prisma.dropSet.deleteMany({
            where: { id: { in: set.dropSets.map((d) => d.id) } }, // 🔥 FIXED
          });
        }

        // ✅ DELETE set
        if (set.id) {
          await prisma.set.delete({ where: { id: set.id } });
        }
      }

      // ✅ DELETE setGroup
      if (group.id) {
        await prisma.sets.delete({ where: { id: group.id } });
      }
    }

    // ✅ DELETE exercise
    await prisma.exercise.delete({ where: { id: ex.id } });
  }
};

// --- UPDATE workout day (same logic, without triset) ---
export const updateWorkoutDay = async (
  workoutId: string,
  exercises: ExerciseInput[],
): Promise<WorkoutDayWithExercises> => {
  const id = validateWorkoutId(workoutId);
  if (!Array.isArray(exercises)) throw new Error('Invalid request data');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workoutDay = await prisma.workoutDay.findFirst({
    where: { workoutId: id, date: today },
    include: {
      exercises: {
        include: {
          setGroup: { include: { sets: { include: { dropSets: true } } } },
          exerciseType: true,
        },
      },
      workout: true,
    },
  });

  if (!workoutDay) throw new Error('Workout day not found');

  const userId = workoutDay.workout?.userId;
  if (!userId) throw new Error('Workout not found');

  // ✅ DELETE old
  await deleteExistingExercises(workoutDay);

  // ✅ CREATE new
  const updated = await prisma.workoutDay.update({
    where: { id: workoutDay.id },
    data: {
      updatedAt: new Date(),
      exercises: {
        create: await Promise.all(
          exercises.map(async (ex) => {
            let exerciseType = await prisma.exerciseType.findFirst({
              where: { name: ex.name, userId },
            });
            if (!exerciseType) {
              exerciseType = await prisma.exerciseType.create({
                data: { name: ex.name, userId },
              });
            }

            return {
              exerciseTypeId: exerciseType.id,
              setGroup: ex.setGroup?.length
                ? {
                    create: ex.setGroup.map((group: SetGroupType) => ({
                      sets: group.sets?.length
                        ? {
                            create: group.sets.map((set: SetType) => ({
                              type: set.type,
                              order: set.order,
                              weight: set.weight ?? null,
                              reps: set.reps ?? null,

                              // ✅ CREATE dropsets if exist
                              dropSets: set.dropSets?.length
                                ? {
                                    create: set.dropSets.map((drop) => ({
                                      order: drop.order,
                                      weight: drop.weight ?? null,
                                      reps: drop.reps ?? null,
                                    })),
                                  }
                                : undefined,
                            })),
                          }
                        : undefined,
                    })),
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
              sets: { include: { dropSets: true } },
            },
          },
        },
      },
      workout: true,
    },
  });

  return updated;
};

// --- PATCH workout (title, color) остаётся БЕЗ swap-а ---
export const updateWorkout = async (workoutId: string, title?: string, color?: string) => {
  const id = validateWorkoutId(workoutId);
  const data: { title?: string; color?: string } = {};
  if (title) data.title = title;
  if (color) data.color = color;
  if (!Object.keys(data).length) throw new Error('No data to update');

  return prisma.workout.update({ where: { id }, data });
};
