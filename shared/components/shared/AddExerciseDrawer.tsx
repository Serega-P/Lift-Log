'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  ScrollArea,
  MuscleGroupFilter,
  ExerciseItem,
} from '@/shared/components';

import { X } from 'lucide-react';
import {
  ExerciseDefinition,
  WorkoutExercise,
  ExerciseApiItem,
  SetGroupType,
  SetType,
} from '@/app/types/types';

interface Props {
  exercises: WorkoutExercise[];
  isOpen: boolean;
  onClose: () => void;
  setExercises: React.Dispatch<React.SetStateAction<WorkoutExercise[]>>;
}

export const AddExerciseDrawer: React.FC<Props> = ({
  exercises,
  isOpen,
  onClose,
  setExercises,
}) => {
  const [allDefinitions, setAllDefinitions] = useState<ExerciseDefinition[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchDefinitions = async () => {
      try {
        setLoading(true);

        const res = await fetch('/api/exercises');
        const data: ExerciseApiItem[] = await res.json();

        const normalized: ExerciseDefinition[] = data.map((item) => {
          const et = item.exerciseType;

          return {
            id: et.id,
            name: et.name,
            muscleGroup: et.muscleGroup ?? null,
            userId: et.userId,
            createdAt: new Date(et.createdAt),
            updatedAt: new Date(et.updatedAt),

            lastExercise: item.exercise
              ? {
                  ...item.exercise,
                  createdAt: new Date(item.exercise.createdAt),
                  updatedAt: new Date(item.exercise.updatedAt),
                  setGroup: item.exercise.setGroup.map((sg: SetGroupType) => ({
                    ...sg,
                    createdAt: new Date(sg.createdAt),
                    updatedAt: new Date(sg.updatedAt),
                    sets: sg.sets.map((s: SetType) => ({
                      ...s,
                      createdAt: new Date(s.createdAt),
                      updatedAt: new Date(s.updatedAt),
                    })),
                  })),
                }
              : null,
          };
        });

        setAllDefinitions(normalized);
      } catch (err) {
        console.error('Failed to load definitions', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDefinitions();
  }, [isOpen]);

  // ------------------------------
  // 🔥 Оставить только доступные
  // ------------------------------
  const available = allDefinitions.filter(
    (def) => !exercises.some((e) => e.exerciseTypeId === def.id),
  );

  // ------------------------------
  // 🔥 Фильтрация по группе мышц
  // ------------------------------
  const filtered =
    filter === 'All'
      ? available
      : available.filter((ex) => ex.muscleGroup?.toLowerCase() === filter.toLowerCase());

  // ------------------------------
  // 🔥 Добавление упражнения в список дня
  // ------------------------------
  const addExercise = (def: ExerciseDefinition) => {
    const newExercise: WorkoutExercise = def.lastExercise
      ? {
          ...def.lastExercise,
          exerciseTypeId: def.id,
          exerciseType: def,
        }
      : {
          id: Date.now(),
          exerciseTypeId: def.id,
          exerciseType: def,
          setGroup: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        };

    setExercises((prev) => [...prev, newExercise]);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[100vh] max-w-[720px] bg-bgBase border-none rounded-t-6xl overflow-hidden flex flex-col">
        <DrawerHeader className="flex justify-between items-center px-4 pb-4 sticky top-0 z-50">
          {/* Фон с градиентом */}
          <div className="absolute inset-0 bg-gradient-to-b from-bgBase/90 to-bgBase/0 backdrop-blur-[2px] pointer-events-none"></div>

          {/* Контент Header */}
          <DrawerClose asChild>
            <button
              className="p-2 w-12 h-12 rounded-full bg-black/50 text-white z-10"
              onClick={onClose}>
              <X size={24} strokeWidth={1} className="m-auto" />
            </button>
          </DrawerClose>

          <div className="z-10">
            <MuscleGroupFilter value={filter} onChange={setFilter} />
          </div>
        </DrawerHeader>

        <ScrollArea className="flex-1 w-full px-4 mt-[-76px] rounded-t-6xl overflow-hidden">
          <div className="flex flex-col items-center w-full h-full mt-20 space-y-4">
            <div className="w-full max-w-[430px]">
              <DrawerTitle className="text-3xl font-light">Add Exercise</DrawerTitle>
              <DrawerDescription className="hidden">Select exercise</DrawerDescription>
            </div>

            <div className="w-full max-w-[430px] space-y-3">
              {loading ? (
                <div className="text-center text-muted">Loading…</div>
              ) : filtered.length === 0 ? (
                <div className="text-center text-muted">Nothing found</div>
              ) : (
                filtered.map((def) => (
                  <ExerciseItem key={def.id} exercise={def} onAdd={() => addExercise(def)} />
                ))
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
