import { NextResponse } from "next/server";
import { prisma } from '@/prisma/prisma-client';

export async function GET(req: Request, { params }: { params: { id: string, exerciseId: string } }) {
    const workoutId = parseInt(params.id);
    const exerciseId = parseInt(params.exerciseId);

    if (isNaN(workoutId) || isNaN(exerciseId)) {
        return NextResponse.json({ error: "Invalid workout or exercise ID" }, { status: 400 });
    }

    try {
        const workout = await prisma.workout.findUnique({
            where: { id: workoutId },
            include: {
                days: {
                    include: {
                      exercises: {
                          where: { id: exerciseId },
                          include: { 
													setGroup: {
														include: {
															set: true,
															triset: {
																include: {
																	subSets: true,
																}
															}
														}
													} 
												} 
                      }
                    }
                }
            }
        });


        if (!workout) {
            return NextResponse.json({ error: "Workout not found" }, { status: 404 });
        }

        const exercise = workout.days.flatMap(day => day.exercises).find(ex => ex.id === exerciseId);
        if (!exercise) {
            return NextResponse.json({ error: "Exercise not found!!" }, { status: 404 });
        }

        return NextResponse.json(exercise);
    } catch (error) {
        console.error("Error fetching exercise:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
