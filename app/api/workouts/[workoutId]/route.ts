import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import {
  getWorkout,
  createWorkoutDay,
  updateWorkoutDay,
  updateWorkout,
} from '@/lib/api/workoutHandlers';

export async function GET(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const workout = await getWorkout(params.workoutId);
    return NextResponse.json(workout, { status: 200 });
  } catch (error: unknown) {
    console.error('Ошибка при получении тренировки:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Invalid workout ID') {
      return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }
    if (errorMessage === 'Workout not found') {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const { exercises } = await req.json();
    const newWorkoutDay = await createWorkoutDay(params.workoutId, exercises);
    return NextResponse.json(newWorkoutDay, { status: 201 });
  } catch (error: unknown) {
    console.error('❌ Ошибка при сохранении тренировки:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Invalid workout ID' || errorMessage === 'Invalid request data') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to save workout' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const body = await req.json();

    // Если есть title или color, обновляем саму тренировку
    if (body.title || body.color) {
      const updatedWorkout = await updateWorkout(params.workoutId, body.title, body.color);
      return NextResponse.json(updatedWorkout, { status: 200 });
    }

    // Если есть exercises, обновляем WorkoutDay
    const { exercises } = body;
    const updatedWorkoutDay = await updateWorkoutDay(params.workoutId, exercises);
    return NextResponse.json(updatedWorkoutDay, { status: 200 });
  } catch (error: unknown) {
    console.error('❌ Ошибка при обновлении тренировки:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage === 'Invalid workout ID' || errorMessage === 'Invalid request data') {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
    }
    if (errorMessage === 'Workout day not found') {
      return NextResponse.json({ error: 'Workout day not found' }, { status: 404 });
    }
    if (errorMessage === 'No data to update') {
      return NextResponse.json({ error: 'No data to update' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to update workout' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { workoutId: string } }) {
  try {
    const workoutId = Number(params.workoutId);

    if (isNaN(workoutId)) {
      return NextResponse.json({ error: 'Invalid workout ID' }, { status: 400 });
    }

    // Обновляем все упражнения, связанные с этой тренировкой, устанавливая workoutId в null
    await prisma.exercise.updateMany({
      where: { workoutId },
      data: { workoutId: { set: null } },
    });

    await prisma.workoutDay.updateMany({
      where: { workoutId },
      data: { workoutId: { set: null } },
    });

    // Удаляем тренировку
    await prisma.workout.delete({
      where: { id: workoutId },
    });

    return NextResponse.json({ message: 'Workout deleted successfully' }, { status: 200 });
  } catch (error: unknown) {
    console.error('❌ Ошибка при удалении тренировки:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('not found')) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to delete workout' }, { status: 500 });
  }
}
