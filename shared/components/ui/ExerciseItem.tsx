'use client';

import { Plus } from 'lucide-react';
import { ExerciseDefinition } from '@/app/types/types';

const GROUP_COLORS: Record<string, string> = {
  chest: 'bg-green-500',
  back: 'bg-amber-500',
  legs: 'bg-blue-500',
  arms: 'bg-purple-500',
  shoulders: 'bg-pink-500',
  core: 'bg-teal-500',
};

export function ExerciseItem({
  exercise,
  onAdd,
}: {
  exercise: ExerciseDefinition;
  onAdd: () => void;
}) {
  const mg = exercise.muscleGroup || '';

  return (
    <div className="bg-black/50 rounded-3xl p-5 flex justify-between items-center">
      <div>
        <div className="text-xl">{exercise?.name}</div>

        <div className="flex items-center gap-3 mt-2">
          <span
            className={`${
              GROUP_COLORS[mg] || 'bg-gray-500'
            } px-3 py-1 rounded-full text-white text-sm`}>
            {mg || 'Не определено'}
          </span>
        </div>
      </div>

      <button className="p-2 bg-black/40 rounded-full text-white" onClick={onAdd}>
        <Plus size={20} />
      </button>
    </div>
  );
}
