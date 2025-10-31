import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { ExerciseCreateType } from '@/app/types/types';

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     console.log('🔹 GET session:', session);

//     if (!session?.user || !('id' in session.user)) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const userId = Number(session.user.id);

//     // Получаем тренировки
//     const workouts = await prisma.workout.findMany({
//       where: { userId },
//       select: {
//         id: true,
//         color: true,
//         title: true,
//         days: {
//           select: {
//             id: true,
//             date: true,
//             createdAt: true,
//           },
//         },
//       },
//     });

//     // Сортируем тренировки по максимальному createdAt из days (последняя тренировка)
//     const sortedWorkouts = [...workouts].sort((a, b) => {
//       // Находим самый новый день в тренировке a
//       const latestDayA = a.days?.length
//         ? new Date(Math.max(...a.days.map((day) => new Date(day.createdAt).getTime())))
//         : new Date(0); // Если дней нет, используем минимальную дату
//       // Находим самый новый день в тренировке b
//       const latestDayB = b.days?.length
//         ? new Date(Math.max(...b.days.map((day) => new Date(day.createdAt).getTime())))
//         : new Date(0);
//       // Сортируем так, чтобы новые даты были в конце (старые -> новые)
//       return latestDayA.getTime() - latestDayB.getTime();
//     });

//     return NextResponse.json(sortedWorkouts);
//   } catch (error) {
//     console.error('❌ Ошибка при получении тренировок:', error);
//     return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
//   }
// }

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log('🔹 GET session:', session);

    if (!session?.user || !('id' in session.user)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = Number(session.user.id);

    // Получаем тренировки с фильтрацией и сортировкой days
    const workouts = await prisma.workout.findMany({
      where: { userId },
      select: {
        id: true,
        color: true,
        title: true,
        days: {
          where: {
            NOT: { date: null }, // исключаем дни без даты
          },
          select: {
            id: true,
            date: true,
            createdAt: true,
          },
          orderBy: {
            date: 'asc', // сортировка дней по дате (старые -> новые)
          },
        },
      },
    });

    // Сортируем тренировки по последнему createdAt среди days
    const sortedWorkouts = [...workouts].sort((a, b) => {
      const latestDayA = a.days.length
        ? new Date(Math.max(...a.days.map((d) => new Date(d.createdAt).getTime())))
        : new Date(0);

      const latestDayB = b.days.length
        ? new Date(Math.max(...b.days.map((d) => new Date(d.createdAt).getTime())))
        : new Date(0);

      // старые тренировки первыми, новые — в конце
      return latestDayA.getTime() - latestDayB.getTime();
    });

    return NextResponse.json(sortedWorkouts);
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
        // Создаём упражнения только если массив exercises не пустой
        ...(exercises.length > 0 && {
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
        }),
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
