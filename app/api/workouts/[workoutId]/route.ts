import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkout,
  createWorkoutDay,
  updateWorkoutDay,
  updateWorkout,
} from '@/lib/api/workoutHandlers';

// ❗ Удалили: SetGroupType, SetType, SubSetType (triset больше не нужен)

export async function GET(
  req: NextRequest,
  { params }: { params: { workoutId: string; lastDayIndex: string } },
) {
  try {
    const { workoutId } = params;
    const workout = await getWorkout(workoutId);
    return NextResponse.json(workout, { status: 200 });
  } catch (error: unknown) {
    console.error('❌ Ошибка при получении тренировки:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';

    if (msg === 'Invalid workout ID') {
      return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }
    if (msg === 'Workout not found') {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { workoutId: string; lastDayIndex: string } },
) {
  try {
    const { workoutId } = params;
    const { exercises } = await req.json();

    // exercises уже содержит setGroup -> sets -> dropSets
    const newWorkoutDay = await createWorkoutDay(workoutId, exercises);
    return NextResponse.json(newWorkoutDay, { status: 201 });
  } catch (error: unknown) {
    console.error('❌ Ошибка при сохранении тренировки:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';

    if (msg === 'Invalid workout ID' || msg === 'Invalid request data') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { workoutId: string; lastDayIndex: string } },
) {
  try {
    const { workoutId } = params;
    const body = await req.json();

    // Если обновление title/color — значит нужен updateWorkout
    if (body.title || body.color) {
      const updatedWorkout = await updateWorkout(workoutId, body.title, body.color);
      return NextResponse.json(updatedWorkout, { status: 200 });
    }

    // Если обновляем sets — значит нужен WorkoutDay
    const { exercises } = body;
    if (!Array.isArray(exercises)) {
      return NextResponse.json({ error: 'Invalid exercises payload' }, { status: 400 });
    }

    const updatedWorkoutDay = await updateWorkoutDay(workoutId, exercises);
    return NextResponse.json(updatedWorkoutDay, { status: 200 });
  } catch (error: unknown) {
    console.error('❌ Ошибка при обновлении тренировки:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';

    if (msg === 'Invalid workout ID' || msg === 'Invalid request data') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    if (msg === 'Workout day not found') {
      return NextResponse.json({ error: 'Workout day not found' }, { status: 404 });
    }
    if (msg === 'No data to update') {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 });
    }

    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { workoutId: string; lastDayIndex: string } },
) {
  try {
    const { workoutId } = params;
    const id = Number(workoutId);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }

    // Отвязываем дни от тренировки
    await prisma.workoutDay.updateMany({
      where: { workoutId: id },
      data: { workoutId: null },
    });

    // Удаляем саму тренировку
    await prisma.workout.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, message: 'Workout deleted successfully' },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error('❌ Ошибка при удалении тренировки:', error);
    const msg = error instanceof Error ? error.message : 'Unknown error';

    if (msg.toLowerCase().includes('not found')) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Failed to delete workout' }, { status: 500 });
  }
}
