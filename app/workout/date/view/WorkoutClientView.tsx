'use client';

import { useEffect, useState } from 'react';
import { WorkoutType, SetType } from '@/app/types/types';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Container, Button, Title, Set, TriSet } from '@/shared/components';

export default function WorkoutClientView() {
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedWorkout');
    if (stored) {
      setWorkout(JSON.parse(stored));
    }
  }, []);

  if (!workout) return <div>Loading workout...</div>;

  const day = workout.days?.[0];

  if (!day?.exercises || day.exercises.length === 0) {
    return (
      <p className="text-base">
        No exercises available. <br />
        <span className="text-sm text-muted">You can add or create a new exercise.</span>
      </p>
    );
  }

  return (
    <Container className="w-full px-6 py-20 relative min-h-screen">
      {/* Top Navigation */}
      <div className="fixed top-0 left-0 w-full bg-black flex justify-center items-center z-50">
        <div className="w-full max-w-[430px] px-5 py-2 flex justify-between items-center">
          <Button className="text-muted border-none h-12 w-12 p-2" onClick={() => router.back()}>
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
          <div className="flex items-center space-x-4">
            <Button className="text-accent border-none p-2" onClick={() => router.push('/')}>
              Done
            </Button>
          </div>
        </div>
      </div>

      <Title text={workout.title} size="sm" className="font-medium px-5" />

      <div className="space-y-6 mt-5">
        {day.exercises.map((exercise) => (
          <div
            key={exercise.id}
            className="bg-bgBase rounded-2xl text-primary pb-5 mb-5 overflow-hidden">
            {/* Заголовок упражнения */}
            <div className="flex justify-between items-center pl-5 py-4 border-b border-muted/25">
              <div className="flex items-center gap-2">
                <Title
                  text={exercise.exerciseType?.name || 'Exercise'}
                  className="font-medium text-primary text-lg"
                />
              </div>
            </div>

            {/* Сеты */}
            <div className="space-y-4 py-3">
              {exercise.setGroup?.map((group) =>
                group.sets?.map((set: SetType) => (
                  <div key={set.id}>
                    <>
                      <Set set={set} />
                    </>
                  </div>
                )),
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
