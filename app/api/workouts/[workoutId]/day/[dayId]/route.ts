import { prisma } from '@/prisma/prisma-client';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
	console.log(req)
  try {
		const workouts = await prisma.workout.findMany({
			include: {
				days: {
					include: {
						exercises: {
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

    return NextResponse.json(workouts);
  } catch (error) {
    console.error('Ошибка при получении тренировок:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
