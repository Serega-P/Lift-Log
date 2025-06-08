'use client';

import { useEffect, useState } from 'react';
import { WorkoutType } from '@/app/types/types';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Container, Button } from '@/shared/components';

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

  return (
    <Container>
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
    </Container>
  );
}
