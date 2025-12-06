'use client';

import { useState, useEffect } from 'react';
import { ExerciseDefinition } from '@/app/types/types';
import { BottomNavigation, Skeleton } from '@/shared/components';

export default function AllExercises() {
  const [exercises, setExercises] = useState<ExerciseDefinition[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchExercises() {
      const response = await fetch('/api/exercises');
      const data = await response.json();
      setIsLoading(false);
      setExercises(data);
    }
    fetchExercises();
  }, []);

  return (
    <div className="w-full max-w-[430px] space-y-4 px-6 mt-20">
      <h1 className="font-bold">All Exercises</h1>
      {isLoading ? (
        <>
          <Skeleton className="w-full h-20 mb-4" />
          <Skeleton className="w-full h-20 mb-4" />
        </>
      ) : exercises.length > 0 ? (
        exercises.map((exercise) => <h2 key={exercise.id}>{exercise.name}</h2>)
      ) : (
        <p className="text-center text-muted text-lg mt-4">No exercises!</p>
      )}
      <BottomNavigation />
    </div>
  );
}
