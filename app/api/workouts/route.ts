<<<<<<< HEAD
import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workouts = await prisma.workout.findMany({
      where: { userId: Number(session.user.id) }, // Загружаем только тренировки текущего пользователя
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
    console.error("Ошибка при получении тренировок:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

=======
import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
		const workouts = await prisma.workout.findMany({
			select: {
				id: true,
				color: true,
				title: true,
				days: {
					select: {
						id: true,
						date: true
					}
				}
			}
		});
		

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Ошибка при получении тренировок:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}


export async function POST(req: NextRequest) {
  try {
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4
    const { title, color, exercises } = await req.json();

    if (!title || !color || !Array.isArray(exercises)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // 1️⃣ Создаём воркаут
    const newWorkout = await prisma.workout.create({
      data: {
        title,
        color,
<<<<<<< HEAD
        userId: Number(session.user.id), // Привязываем воркаут к текущему пользователю
=======
        userId: 4,
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4
      },
    });

    const newWorkoutDay = await prisma.workoutDay.create({
<<<<<<< HEAD
      data: {
        date: null,
        workoutId: newWorkout.id,
        exercises: {
          create: exercises.map((exercise: { name: string }) => ({
            name: exercise.name,
            workoutId: newWorkout.id,
            setGroup: {
              create: {},
            },
          })),
        },
      },
      include: {
        exercises: true,
      },
    });
=======
			data: {
				date: null, // ✅ Текущая дата
				workoutId: newWorkout.id, // ✅ Связываем день с воркаутом
				exercises: {
					create: exercises.map((exercise: { name: string }) => ({
						name: exercise.name,
						workoutId: newWorkout.id, // ✅ Указываем ID воркаута
						setGroup: {
							create: {},
						},
					})),
				},
			},
			include: {
				exercises: true,
			},
		});
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4

    return NextResponse.json(
      { ...newWorkout, days: [newWorkoutDay] },
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании тренировки:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
<<<<<<< HEAD
=======




>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4
