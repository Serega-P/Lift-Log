import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';
import { SetType, TrisetType, SubSetType } from '@/app/types/types';

export async function POST(
  req: NextRequest,
  { params }: { params: { workoutId: string } }
) {
  try {
    const { date, exercise, sequence } = await req.json();
    if (!date || !exercise?.name || !Array.isArray(sequence)) {
      return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    }

    const workoutIdNum = Number(params.workoutId);
    const dayDate = new Date(`${date}T00:00:00.000Z`);

    // Проверяем, существует ли уже WorkoutDay с этой датой
    let workoutDay = await prisma.workoutDay.findFirst({
      where: {
        workoutId: workoutIdNum,
        date: dayDate,
      },
      include: {
        exercises: {
          include: {
            setGroup: {
              include: {
                set: true,
                triset: { include: { subSets: true } },
              },
            },
          },
        },
      },
    });

    // Формируем данные сетов и трисетов
    const setData = sequence
      .filter((item: SetType) => !('subSets' in item))
      .map((item: SetType) => ({
        type: item.type,
        weight: item.weight ? Number(item.weight) : null,
        reps: item.reps ? Number(item.reps) : null,
      }));

    const trisetData = sequence
      .filter((item: TrisetType) => 'subSets' in item)
      .map((item: TrisetType) => ({
        type: item.type,
        subSets: {
          create: item.subSets.map((ss: SubSetType) => ({
            weight: ss.weight ? Number(ss.weight) : null,
            reps: ss.reps ? Number(ss.reps) : null,
            order: ss.order,
          })),
        },
      }));

    // Подготавливаем объект setGroup
    const setGroupCreateData: Record<string, any> = {};
    if (setData.length > 0) setGroupCreateData.set = { create: setData };
    if (trisetData.length > 0) setGroupCreateData.triset = { create: trisetData };

    // Если день уже существует → добавляем в него новое упражнение
    if (workoutDay) {
      const newExercise = await prisma.exercise.create({
        data: {
          name: exercise.name,
          workout: { connect: { id: workoutIdNum } },
          workoutDay: { connect: { id: workoutDay.id } },
          setGroup: Object.keys(setGroupCreateData).length > 0 ? { create: setGroupCreateData } : undefined,
        },
        include: {
          setGroup: {
            include: {
              set: true,
              triset: { include: { subSets: true } },
            },
          },
        },
      });

      return NextResponse.json({ ...workoutDay, exercises: [...workoutDay.exercises, newExercise] }, { status: 200 });
    }

    // Если дня ещё нет → создаём новый WorkoutDay и добавляем упражнение
    workoutDay = await prisma.workoutDay.create({
      data: {
        date: dayDate,
        workout: { connect: { id: workoutIdNum } },
        exercises: {
          create: {
            name: exercise.name,
            workout: { connect: { id: workoutIdNum } },
            setGroup: Object.keys(setGroupCreateData).length > 0 ? { create: setGroupCreateData } : undefined,
          },
        },
      },
      include: {
        exercises: {
          include: {
            setGroup: {
              include: {
                set: true,
                triset: { include: { subSets: true } },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(workoutDay, { status: 201 });
  } catch (error) {
    console.error('Error creating workout day:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
