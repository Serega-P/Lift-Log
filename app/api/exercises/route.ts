export const dynamic = 'force-dynamic';

import { prisma } from '@/prisma/prisma-client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

function parseExcludeIds(query: string | null | undefined): number[] {
  if (!query) return [];
  return query
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => Number(s))
    .filter((n) => !Number.isNaN(n));
}

function iso(date: Date | null | undefined) {
  return date ? date.toISOString() : null;
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // опционально: ?excludeIds=1,2,3
    const url = new URL(req.url);
    const excludeParam = url.searchParams.get('excludeIds');
    const excludeIds = parseExcludeIds(excludeParam);

    // Получаем все exerciseType пользователя (кроме excludeIds)
    // и для каждого берем последний Exercise (по workoutDay.date) у которого workoutDay.date != null
    const types = await prisma.exerciseType.findMany({
      where: {
        userId,
        ...(excludeIds.length ? { id: { notIn: excludeIds } } : {}),
      },
      select: {
        id: true,
        name: true,
        muscleGroup: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        // включаем последний Exercise с данными setGroup -> sets -> dropSets, subSets
        exercises: {
          where: {
            // only exercises that belong to a workout day with a real date
            workoutDay: {
              date: {
                not: null,
              },
            },
          },
          orderBy: {
            workoutDay: {
              date: 'desc',
            },
          },
          take: 1,
          select: {
            id: true,
            exerciseTypeId: true,
            workoutDayId: true,
            createdAt: true,
            updatedAt: true,
            // don't include nested exerciseType here (we will expose top-level exerciseType separately)
            setGroup: {
              select: {
                id: true,
                exerciseId: true,
                createdAt: true,
                updatedAt: true,
                sets: {
                  select: {
                    id: true,
                    type: true,
                    order: true,
                    weight: true,
                    reps: true,
                    isTriSet: true,
                    setGroupId: true,
                    createdAt: true,
                    updatedAt: true,
                    // include dropsets and subsets
                    dropSets: {
                      select: {
                        id: true,
                        parentSetId: true,
                        weight: true,
                        reps: true,
                        order: true,
                        createdAt: true,
                        updatedAt: true,
                      },
                    },
                    subSets: {
                      select: {
                        id: true,
                        setId: true,
                        weight: true,
                        reps: true,
                        order: true,
                        createdAt: true,
                        updatedAt: true,
                      },
                    },
                  },
                },
              },
            },
            workoutDay: {
              select: {
                id: true,
                date: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    // Формируем отклик: для каждого exerciseType — возвращаем либо последний Exercise с сетами, либо пустой набор
    const payload = types.map((et) => {
      const lastEx = et.exercises && et.exercises.length ? et.exercises[0] : null;

      if (!lastEx) {
        // У exerciseType нет прошлых упражнений — возвращаем exerciseType + пустые поля для exercise
        return {
          exerciseType: {
            id: et.id,
            name: et.name,
            muscleGroup: et.muscleGroup,
            userId: et.userId,
            createdAt: iso(et.createdAt),
            updatedAt: iso(et.updatedAt),
          },
          exercise: null, // у клиента можно проверять и создавать пустой workoutExercise с setGroup: []
        };
      }

      // Преобразуем setGroup -> sets -> dropSets/subSets даты в ISO (чтобы клиент корректно сериализовал)
      const normalizedSetGroups = lastEx.setGroup.map((sg) => ({
        id: sg.id,
        exerciseId: sg.exerciseId,
        createdAt: iso(sg.createdAt),
        updatedAt: iso(sg.updatedAt),
        sets: sg.sets.map((s) => ({
          id: s.id,
          type: s.type,
          order: s.order,
          weight: s.weight,
          reps: s.reps,
          isTriSet: s.isTriSet,
          setGroupId: s.setGroupId,
          createdAt: iso(s.createdAt),
          updatedAt: iso(s.updatedAt),
          dropSets: (s.dropSets || []).map((ds) => ({
            id: ds.id,
            parentSetId: ds.parentSetId,
            weight: ds.weight,
            reps: ds.reps,
            order: ds.order,
            createdAt: iso(ds.createdAt),
            updatedAt: iso(ds.updatedAt),
          })),
          subSets: (s.subSets || []).map((ss) => ({
            id: ss.id,
            setId: ss.setId,
            weight: ss.weight,
            reps: ss.reps,
            order: ss.order,
            createdAt: iso(ss.createdAt),
            updatedAt: iso(ss.updatedAt),
          })),
        })),
      }));

      return {
        exerciseType: {
          id: et.id,
          name: et.name,
          muscleGroup: et.muscleGroup,
          userId: et.userId,
          createdAt: iso(et.createdAt),
          updatedAt: iso(et.updatedAt),
        },
        exercise: {
          id: lastEx.id,
          exerciseTypeId: lastEx.exerciseTypeId,
          workoutDayId: lastEx.workoutDayId,
          createdAt: iso(lastEx.createdAt),
          updatedAt: iso(lastEx.updatedAt),
          workoutDay: lastEx.workoutDay
            ? {
                id: lastEx.workoutDay.id,
                date: iso(lastEx.workoutDay.date as Date),
                createdAt: iso(lastEx.workoutDay.createdAt),
                updatedAt: iso(lastEx.workoutDay.updatedAt),
              }
            : null,
          setGroup: normalizedSetGroups,
        },
      };
    });

    return NextResponse.json(payload);
  } catch (error) {
    console.error('❌ Ошибка при получении exercises:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
