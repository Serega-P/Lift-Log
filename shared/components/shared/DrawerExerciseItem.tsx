'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  ScrollArea,
  MuscleGroupFilter,
} from '@/shared/components';

import { ChevronRight, X } from 'lucide-react';
import { ExerciseDefinition } from '@/app/types/types';

const GROUP_COLORS: Record<string, string> = {
  chest: 'bg-green-500',
  back: 'bg-amber-500',
  legs: 'bg-blue-500',
  arms: 'bg-purple-500',
  shoulders: 'bg-pink-500',
  core: 'bg-teal-500',
};

export function DrawerExerciseItem({ exercise }: { exercise: ExerciseDefinition }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('All');

  const mg = exercise.muscleGroup || '';

  return (
    <>
      <button
        className="w-full bg-black/50 rounded-3xl p-5 flex justify-between items-center text-left"
        onClick={() => setIsOpen(true)}>
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

        <div className="p- rounded-full text-muted">
          <ChevronRight size={20} />
        </div>
      </button>

      {/* Drawer */}
      <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className="h-[100vh] max-w-[720px] bg-bgBase border-none rounded-t-6xl overflow-hidden flex flex-col">
          <DrawerHeader className="flex justify-between items-center px-4 pb-4 sticky top-0 z-50">
            {/* Фон-хедер */}
            <div className="absolute inset-0 bg-gradient-to-b from-bgBase/90 to-bgBase/0 backdrop-blur-[2px] pointer-events-none" />

            {/* Кнопка закрытия */}
            <DrawerClose asChild>
              <button
                className="p-2 w-12 h-12 rounded-full bg-black/50 text-white z-10"
                onClick={() => setIsOpen(false)}>
                <X size={24} strokeWidth={1} className="m-auto" />
              </button>
            </DrawerClose>

            {/* Фильтр мышц */}
            <div className="z-10">
              <MuscleGroupFilter value={filter} onChange={setFilter} />
            </div>
          </DrawerHeader>

          {/* Контент */}
          <ScrollArea className="flex-1 w-full px-4 mt-[-76px] rounded-t-6xl overflow-hidden">
            <div className="flex flex-col items-center w-full h-full mt-20 space-y-4">
              <div className="w-full max-w-[430px]">
                <DrawerTitle className="text-3xl font-light">{exercise.name}</DrawerTitle>

                <DrawerDescription>{/* Пока пусто, можно заполнить позже */}</DrawerDescription>
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    </>
  );
}
