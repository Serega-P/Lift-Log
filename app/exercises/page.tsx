'use client';

import React, { useState, useEffect } from 'react';
import { MuscleGroupFilter, DrawerExerciseItem, BottomNavigation } from '@/shared/components';

// import { X } from 'lucide-react';
import { ExerciseDefinition, ExerciseApiItem, SetGroupType, SetType } from '@/app/types/types';

export default function AllExercises() {
  const [allDefinitions, setAllDefinitions] = useState<ExerciseDefinition[]>([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(false);

  // -----------------------------------
  // 🔥 Fetch & normalize
  // -----------------------------------
  useEffect(() => {
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
  }, []);

  // -----------------------------------
  // 🔥 Фильтрация по группе мышц
  // -----------------------------------
  const filtered =
    filter === 'All'
      ? allDefinitions
      : allDefinitions.filter((ex) => ex.muscleGroup?.toLowerCase() === filter.toLowerCase());

  return (
    <div className="min-h-[100vh] max-w-[720px] mx-auto bg-bgBase flex flex-col">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 py-4 sticky top-0 z-50 bg-bgBase/90 backdrop-blur-sm">
        <h1 className="text-3xl font-light">All Exercises</h1>
        {/* Фильтр */}
        <MuscleGroupFilter value={filter} onChange={setFilter} />
      </div>

      {/* CONTENT */}
      <div className="flex flex-col items-center w-full space-y-4 px-4 mb-24">
        <div className="w-full max-w-[430px] space-y-3">
          {loading ? (
            <div className="text-center text-muted">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="text-center text-muted">Nothing found</div>
          ) : (
            filtered.map((def) => <DrawerExerciseItem key={def.id} exercise={def} />)
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
