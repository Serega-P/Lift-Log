import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { ExerciseType } from "@/app/types/types"; // ✅ Импорт типов

export async function GET(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const workoutId = Number(params.workoutId);

    if (isNaN(workoutId)) {
      return NextResponse.json({ error: "Invalid workout ID" }, { status: 400 });
    }

    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: {
        days: {
          where: { date: { not: null } }, // ✅ Игнорируем дни без даты
          orderBy: { date: "desc" },
          take: 1,
          include: {
            exercises: {
              include: {
                setGroup: {
                  include: {
                    sets: {
                      orderBy: { order: "asc" },
                      include: {
                        subSets: { orderBy: { order: "asc" } },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        exercises: {  // ✅ Загружаем упражнения из воркаута, если нет дней с датой
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
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }

    const lastWorkoutDay = workout.days.length > 0 ? workout.days[0] : null;

    return NextResponse.json({
      ...workout,
      days: lastWorkoutDay ? [lastWorkoutDay] : [],
      exercises: lastWorkoutDay ? [] : workout.exercises, // ✅ Если нет дней, загружаем упражнения воркаута
    });

  } catch (error) {
    console.error("Ошибка при получении тренировки:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}



export async function POST(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const { exercises }: { exercises: ExerciseType[] } = await req.json();
    const workoutId = Number(params.workoutId);

    if (isNaN(workoutId) || !Array.isArray(exercises)) {
      return NextResponse.json({ error: "Invalid request data" }, { status: 400 });
    }

    const newWorkoutDay = await prisma.workoutDay.create({
      data: {
        date: new Date(),
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
                            weight: set.weight !== "" ? Number(set.weight) : null,
                            reps: set.reps !== "" ? Number(set.reps) : null,
                            isTriSet: set.isTriSet,
                            subSets: set.subSets
                              ? {
                                  create: set.subSets.map((subSet) => ({
                                    order: subSet.order,
                                    weight: subSet.weight !== "" ? Number(subSet.weight) : null,
                                    reps: subSet.reps !== "" ? Number(subSet.reps) : null,
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
    console.error("❌ Ошибка при сохранении тренировки:", error);
    return NextResponse.json({ error: "Failed to save workout" }, { status: 500 });
  }
}

