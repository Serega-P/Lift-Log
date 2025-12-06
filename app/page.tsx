'use client';

import {
  MyCalendar,
  Container,
  WorkoutDay,
  Skeleton,
  BottomNavigation,
  Toaster,
  NewWorkoutDrawer,
} from '@/shared/components';
import { toast } from 'sonner';
import * as React from 'react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutType, DayWithColor } from '@/app/types/types';

export default function Home() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загружаем тренировки
  const fetchWorkouts = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/workouts');
      const data = await res.json();
      setWorkouts(data);
    } catch (err) {
      console.error('Ошибка загрузки тренировок:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  // События для календаря
  const events: DayWithColor[] = workouts.flatMap(
    (workout) =>
      workout.days
        ?.filter((day) => day.date !== null)
        .map((day) => ({
          date: new Date(new Date(day.createdAt).toISOString()),
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

      {/* Календарь */}
      <Container className="bg-bgBase rounded-3xl">
        <MyCalendar events={events} onDayClick={handleCalendarClick} />
      </Container>

      {/* Список тренировок */}
      <Container className="pt-5">
        {isLoading ? (
          <>
            <Skeleton className="w-full h-20 mb-4 rounded-3xl" />
            <Skeleton className="w-full h-20 mb-4 rounded-3xl" />
          </>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutDay key={workout.id} workout={workout} />)
        ) : (
          <p className="text-center text-muted text-lg mt-4">
            No workouts yet, create your first one!
          </p>
        )}

        {/* Drawer для создания новой тренировки */}
        <div className="w-full mb-6 mt-2.5">
          <NewWorkoutDrawer onWorkoutCreated={fetchWorkouts} />
        </div>

        <BottomNavigation />
      </Container>
    </div>
  );
}
