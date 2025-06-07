'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { WorkoutType } from '@/app/types/types';
import { WorkoutDay, Skeleton, Container, Button, Title } from '@/shared/components';
import { ArrowLeft } from 'lucide-react';

export default function WorkoutsDate() {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    async function fetchWorkouts() {
      const response = await fetch('/api/workouts');
      const data = await response.json();
      setIsLoading(false);
      setWorkouts(data);
    }
    fetchWorkouts();
  }, []);

  return (
    <Container className="w-full px-6 py-20 space-y-7 relative min-h-screen">
      {/* Fixed header with buttons */}
      <div className="fixed top-0 left-0 w-full bg-black flex justify-center items-center z-50">
        <div className="w-full max-w-[430px] px-5 py-2 flex justify-between items-center">
          <Button className="text-muted border-none h-12 w-12 p-2" onClick={() => router.push('/')}>
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
        </div>
      </div>

      <div className="mt-20">
        <Title
          text="Workouts on Date"
          size="lg"
          className="px-5 text-muted font-normal text-base mb-2"
        />
        {isLoading ? (
          <>
            <Skeleton className="w-full h-20 mb-4" />
            <Skeleton className="w-full h-20 mb-4" />
          </>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutDay key={workout.id} workout={workout} />)
        ) : (
          <p className="text-center text-muted text-lg mt-4">No workouts!</p>
        )}
      </div>
    </Container>
  );
}
