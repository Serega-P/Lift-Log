import { prisma } from "@/prisma/prisma-client";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    console.log("🔹 GET session:", session);

    if (!session?.user || !("id" in session.user)) {
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
    console.error("❌ Ошибка при получении тренировок:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    console.log("🔹 POST session:", session);

    if (!session?.user || !("id" in session.user)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, color, exercises } = await req.json();

    if (!title || !color || !Array.isArray(exercises)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // 1️⃣ Создаём воркаут
    const newWorkout = await prisma.workout.create({
      data: {
        title,
        color,
        userId: Number(session.user.id), // Привязываем воркаут к текущему пользователю
      },
    });

    const newWorkoutDay = await prisma.workoutDay.create({
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

    return NextResponse.json(
      { ...newWorkout, days: [newWorkoutDay] },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Ошибка при создании тренировки:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
