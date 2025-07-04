'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { WorkoutType } from '@/app/types/types';
import { WorkoutDateView, Skeleton, Container, Button } from '@/shared/components';
import { ArrowLeft } from 'lucide-react';

export default function ClientPage() {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();

  const date = searchParams.get('date');

  console.log(workouts);

  useEffect(() => {
    if (!date) return;

    async function fetchWorkouts() {
      try {
        const res = await fetch(`/api/workouts/date?date=${date}`);
        const data = await res.json();
        setWorkouts(data.days || []);
      } catch (error) {
        console.error('Ошибка при получении тренировок по дате:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkouts();
  }, [date]);

  return (
    <Container className="w-full px-6 py-20 space-y-7 relative min-h-screen">
      <div className="fixed top-0 left-0 w-full bg-black flex justify-center items-center z-50">
        <div className="w-full max-w-[430px] px-5 py-2 flex justify-between items-center">
          <Button className="text-muted border-none h-12 w-12 p-2" onClick={() => router.push('/')}>
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div className="mt-20">
        <p className="flex items-center text-muted text-base px-5 m-2">
          {date
            ? new Date(date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : 'No date selected'}
        </p>

        {isLoading ? (
          <>
            <Skeleton className="w-full h-20 mb-4" />
            <Skeleton className="w-full h-20 mb-4" />
          </>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutDateView key={workout.id} workout={workout} />)
        ) : (
          <p className="text-center text-muted text-lg mt-4">No workouts!</p>
        )}
      </div>
    </Container>
  );
}
