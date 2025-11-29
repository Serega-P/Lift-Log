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
    <div>
      <div className="mb-4 px-5">
        {lastWorkoutDate ? (
          <p className="flex items-center text-muted text-sm">
            {' '}
            {new Date(lastWorkoutDate).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        ) : (
          <p className="flex items-center text-muted text-sm">No workout yet</p>
        )}
        <Title text={workoutTitle} size="md" className="font-normal text-2xl" />
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
          <p className="text-base">
            No exercises available. <br />
            <span className="text-sm text-muted">
              You can add or create a new exercise in the settings menu above.
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
