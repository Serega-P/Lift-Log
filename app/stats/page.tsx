'use client';

import { useState, useEffect } from 'react';
import { WorkoutType } from '@/app/types/types';
import { BottomNavigation, WorkoutDay, Skeleton } from '@/shared/components';

export default function Stats() {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    <div className="w-full max-w-[430px] space-y-4 px-6 mt-20">
      <h1>All Workouts</h1>
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
      <BottomNavigation />
    </div>
  );
}
