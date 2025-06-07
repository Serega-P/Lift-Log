'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkoutType } from '@/app/types/types';

export default function WorkoutViewPage() {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedWorkout');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed.id.toString() === id) {
        setWorkout(parsed);
      }
    }
  }, [id]);

  if (!workout) return <p className="p-4">Loading...</p>;

  return <div className="p-6"></div>;
}
