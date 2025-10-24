'use client';

import {
  Button,
  MyCalendar,
  Container,
  WorkoutDay,
  Skeleton,
  BottomNavigation,
  Toaster,
} from '@/shared/components';
import { toast } from 'sonner';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutType, DayWithColor } from '@/app/types/types';

export default function Home() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/workouts')
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Ошибка загрузки:', err);
        setIsLoading(false);
      });
  }, []);

  const handleAddWorkout = () => {
    router.push('/workout/create');
  };

  const events: DayWithColor[] = workouts.flatMap(
    (workout) =>
      workout.days
        ?.filter((day) => day.date !== null) // Исключаем дни с day.date === null
        .map((day) => ({
          date: new Date(new Date(day.createdAt).toISOString()), // Используем createdAt, приводим к UTC
          color: workout.color,
        })) || [],
  );

  const handleCalendarClick = (date: string | null) => {
    if (date) {
      router.push(`/workout/date?date=${date}`);
    } else {
      toast.info('No training on this day!');
    }
  };

  return (
    <div className="pb-24 pt-5 px-5">
      <Toaster position="top-center" />
      <Container className="bg-bgBase/50 rounded-3xl border border-bgBase">
        <MyCalendar events={events} onDayClick={handleCalendarClick} />
      </Container>

      <Container className="pt-5">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-20 mb-4 rounded-3xl border border-bgSoft/50" />
            <Skeleton className="w-full h-20 mb-4 rounded-3xl border border-bgSoft/50" />
          </>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutDay key={workout.id} workout={workout} />)
        ) : (
          <p className="text-center text-muted text-lg mt-4">
            No workouts yet, create your first one!
          </p>
        )}
        <Button
          className="w-full rounded-3xl mb-6 mt-2.5 border-bgSoft/60 text-bgSoft/60"
          onClick={handleAddWorkout}>
          + Add Workout
        </Button>
        <BottomNavigation />
      </Container>
    </div>
  );
}
