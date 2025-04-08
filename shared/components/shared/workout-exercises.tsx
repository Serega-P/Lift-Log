'use client';

import React from 'react';
import { ExerciseType } from '@/app/types/types';
import { Title, Exercise, Button, ModalForm } from '@/shared/components';

interface WorkoutExercisesProps {
  exercises: ExerciseType[];
  lastWorkoutDate?: Date | null | undefined;
  workoutTitle: string;
  onUpdateExercise: (updatedExercise: ExerciseType) => void;
  onDeleteExercise: (exerciseId: number) => void;
  onAddExercise: (exerciseName: string) => void;
}

export function WorkoutExercises({
  exercises,
  lastWorkoutDate,
  workoutTitle,
  onUpdateExercise,
  onDeleteExercise,
  onAddExercise,
}: WorkoutExercisesProps) {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [newExerciseName, setNewExerciseName] = React.useState('');

  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;
    onAddExercise(newExerciseName);
    setNewExerciseName('');
    setIsModalOpen(false);
  };

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

      <Button className="w-full mb-6 mt-5" onClick={() => setIsModalOpen(true)}>
        + Add exercise
      </Button>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Exercise"
        description={`Add a new exercise to your workout ${workoutTitle}`}
        inputPlaceholder="Exercise name"
        inputValue={newExerciseName}
        onInputChange={setNewExerciseName}
        onSubmit={handleAddExercise}
        isWorkoutEdit={false}
      />
    </div>
  );
}
