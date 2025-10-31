import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { WorkoutType } from '@/app/types/types';

interface Props {
  workout: WorkoutType;
}

export const WorkoutDay: React.FC<Props> = ({ workout }) => {
  if (!workout) {
    console.error('Workout is undefined.');
    return null;
  }

  const { id, title, color, days = [] } = workout;
  const lastDayIndex = days.length - 1;
  const lastWorkout = days[lastDayIndex];

  const lastWorkoutDate = lastWorkout && lastWorkout.date ? new Date(lastWorkout.date) : null;

  // console.log(workout);

  const daysAgo = lastWorkoutDate
    ? Math.floor((new Date().getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <Link
      href={days.length > 0 ? `/workout/${id}/day/${lastDayIndex}` : '#'}
      className="flex items-center justify-between w-full bg-bgBase/90 py-5 px-5 rounded-3xl border border-bgBase mb-2.5">
      <div className="flex flex-col space-y-0 flex-1 max-w-[80%]">
        <h3 className="font-bold text-2xl truncate">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
          <p className="text-xs text-muted">
            {daysAgo !== null
              ? daysAgo === 0
                ? 'Today'
                : daysAgo === 1
                ? 'Yesterday'
                : `${daysAgo} days ago`
              : 'No workouts yet'}
          </p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <ChevronRight strokeWidth={1} className="text-bgSoft" />
      </div>
    </Link>
  );
};

export default WorkoutDay;
