'use client';

import { Plus } from 'lucide-react';
import { ExerciseDefinition } from '@/app/types/types';

const GROUP_COLORS: Record<string, string> = {
  chest: 'bg-green-600',
  back: 'bg-amber-600',
  legs: 'bg-blue-600',
  arms: 'bg-purple-600',
  shoulders: 'bg-pink-600',
  core: 'bg-teal-600',
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
    <div className="bg-bgSoft rounded-2xl p-5 flex justify-between items-center">
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
