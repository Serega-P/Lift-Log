'use client';

import React from 'react';
import { ExerciseType } from '@/app/types/types';
import { Title, Exercise } from '@/shared/components';

interface WorkoutExercisesProps {
  exercises: ExerciseType[];
  lastWorkoutDate?: Date | null | undefined;
  workoutTitle: string;
  onUpdateExercise: (updatedExercise: ExerciseType) => void;
  onDeleteExercise: (exerciseId: number) => void;
}

export function WorkoutExercises({
  exercises,
  lastWorkoutDate,
  workoutTitle,
  onUpdateExercise,
  onDeleteExercise,
}: WorkoutExercisesProps) {
  return (
    <div className="pt-20">
      <div className="mb-4">
        {lastWorkoutDate ? (
          <p className="flex items-center text-muted text-sm">
            Last workout:{' '}
            {new Date(lastWorkoutDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        ) : (
          <p className="flex items-center text-muted text-sm">No workout yet</p>
        )}
        <Title text={workoutTitle} size="sm" className="font-bold" />
      </div>

      <div className="space-y-6">
        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <Exercise
              key={exercise.id}
              exercise={exercise}
              onUpdate={onUpdateExercise}
              onDelete={() => onDeleteExercise(exercise.id ?? 0)}
            />
          ))
        ) : (
          <p className="text-gray-500">No exercises available.</p>
        )}
      </div>
    </div>
  );
}
