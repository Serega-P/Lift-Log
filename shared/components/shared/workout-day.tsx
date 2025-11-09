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

  // Фильтруем дни с датой (фактические тренировки)
  const validDays = days.filter((day) => day.date !== null);

  // Проверяем, есть ли хоть одна тренировка
  const isEmptyWorkout = validDays.length === 0;

  // Сортируем по дате создания (createdAt) или дате тренировки (date)
  const sortedDays = [...days].sort((a, b) => {
    const dateA = new Date(a.date ?? a.createdAt).getTime();
    const dateB = new Date(b.date ?? b.createdAt).getTime();
    return dateA - dateB;
  });

  // Определяем последний день (по порядку)
  const lastDayIndex = sortedDays.length - 1;
  const lastWorkout = sortedDays[lastDayIndex] ?? null;

  // Берём дату для расчёта “days ago”
  const lastWorkoutDate =
    lastWorkout && (lastWorkout.date || lastWorkout.createdAt)
      ? new Date(lastWorkout.date ?? lastWorkout.createdAt)
      : null;

  const daysAgo = lastWorkoutDate
    ? Math.floor((new Date().getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  // Определяем подпись
  let statusText = 'No workouts yet';
  if (!isEmptyWorkout && daysAgo !== null) {
    statusText = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
  } else if (isEmptyWorkout) {
    statusText = 'No workouts yet';
  }

  // Определяем куда ведёт ссылка
  const href = `/workout/${id}/day/${lastDayIndex >= 0 ? lastDayIndex : 0}`;

  return (
    <Link
      href={href}
      className="flex items-center justify-between w-full bg-bgBase/90 py-5 px-5 rounded-3xl border border-bgBase mb-2.5">
      <div className="flex flex-col space-y-0 flex-1 max-w-[80%]">
        <h3 className="font-normal text-2xl truncate">{title}</h3>
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></div>
          <p className="text-xs text-muted">{statusText}</p>
        </div>
      </div>
      <div className="flex-shrink-0">
        <ChevronRight strokeWidth={1} className="text-muted" />
      </div>
    </Link>
  );
};

export default WorkoutDay;
