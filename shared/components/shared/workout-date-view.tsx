'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { WorkoutType } from '@/app/types/types';
import { useRouter } from 'next/navigation';

interface Props {
  workout: WorkoutType;
}

export const WorkoutDateView: React.FC<Props> = ({ workout }) => {
  const router = useRouter();
  if (!workout) {
    console.error('Workout is undefined.');
    return null;
  }

  const { title, color, days = [] } = workout;
  const lastDayIndex = days.length - 1;
  const lastWorkout = days[lastDayIndex];

  const lastWorkoutDate = lastWorkout && lastWorkout.date ? new Date(lastWorkout.date) : null;

  const daysAgo = lastWorkoutDate
    ? Math.floor((new Date().getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleClick = () => {
    router.push(`/workout/date/view`, { scroll: true });
    sessionStorage.setItem('selectedWorkout', JSON.stringify(workout));
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between w-full bg-bgBase py-5 px-5 rounded-2xl mb-2.5">
      <div className="flex flex-col space-y-0 flex-1 max-w-[80%]">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full mr-1" style={{ backgroundColor: color }}></div>
          <p className="text-sm text-muted">
            {daysAgo !== null
              ? daysAgo === 0
                ? 'Today'
                : `${daysAgo} days ago`
              : 'No workouts yet'}
          </p>
        </div>
        <h3 className="font-bold text-lg truncate">{title}</h3>
      </div>
      <div className="flex-shrink-0">
        <ChevronRight strokeWidth={2} className="text-muted" />
      </div>
    </div>
  );
};

export default WorkoutDateView;
