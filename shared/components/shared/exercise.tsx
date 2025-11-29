'use client';

import React, { useState } from 'react';
import { ExerciseType, SetType } from '@/app/types/types';
import {
  Set,
  Title,
  SetNewRecordDrawer,
  ExerciseSettingsPopover,
  RenameExerciseDrawer,
  ConfirmDeleteDrawer,
} from '@/shared/components';

interface Props {
  exercise: ExerciseType;
  onUpdate: (updatedExercise: ExerciseType) => void;
  onDelete: (id: number) => void;
}

export function Exercise({ exercise, onUpdate, onDelete }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [sets, setSets] = useState<SetType[]>(() =>
    (exercise.setGroup ?? [])
      .flatMap((group) => group.sets ?? [])
      .sort((a, b) => a.order - b.order),
  );

  const handleRenameExercise = async () => {
    const currentName = exerciseData.exerciseType?.name ?? '';
    if (newExerciseName.trim() === '' || newExerciseName.trim() === currentName) {
      setIsModalOpen(false);
      return;
    }

    const exerciseId = exerciseData.exerciseType?.id ?? exerciseData.exerciseTypeId;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newExerciseName }),
      });

      if (!res.ok) throw new Error('Failed to rename exercise');

      const updatedExercise: ExerciseType = {
        ...exerciseData,
        exerciseType: {
          id: exerciseId,
          name: newExerciseName,
          userId: exerciseData.exerciseType?.userId ?? 0,
          createdAt: exerciseData.exerciseType?.createdAt ?? new Date(),
          updatedAt: new Date(),
        },
      };

      setExerciseData(updatedExercise);
      onUpdate(updatedExercise);
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Ошибка при переименовании:', error);
      alert('Не удалось переименовать упражнение');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExercise = (updatedSets: SetType[]) => {
    const updatedExercise: ExerciseType = {
      ...exerciseData,
      setGroup:
        updatedSets.length > 0
          ? [
              {
                ...(exerciseData.setGroup?.[0] ?? {}),
                exerciseId: exerciseData.id,
                sets: updatedSets,
              },
            ]
          : [],
    };

    setExerciseData(updatedExercise);
    setSets(updatedSets);
    onUpdate(updatedExercise);
  };

  const handleOpenRenameDrawer = () => {
    setNewExerciseName(exerciseData.exerciseType?.name || '');
    setIsModalOpen(true);
  };

  return (
    <div className="bg-bgBase rounded-2xl text-primary mb-5 overflow-hidden">
      <div className="flex justify-between items-center pl-5 border-b border-muted/25">
        <div className="flex items-center py-4 gap-2">
          <Title
            size="sm"
            text={exerciseData.exerciseType?.name}
            className="font-normal text-primary"
          />
        </div>
        <ExerciseSettingsPopover
          onDelete={() => setIsDeleteDrawerOpen(true)}
          onRename={handleOpenRenameDrawer}
        />
        <ConfirmDeleteDrawer
          onClose={() => setIsDeleteDrawerOpen(false)}
          isDeleting={undefined}
          isOpen={isDeleteDrawerOpen}
          onConfirmDelete={() => onDelete(exerciseData.id ?? 0)}
        />
      </div>

      <RenameExerciseDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        inputPlaceholder={exerciseData.exerciseType?.name}
        inputValue={newExerciseName}
        onInputChange={setNewExerciseName}
        onSubmit={handleRenameExercise}
        loading={isLoading}
      />

      <div>
        {sets.map((set) => (
          <Set key={set.order} set={set} />
        ))}
        <SetNewRecordDrawer
          name={exerciseData.exerciseType?.name}
          sets={sets}
          onSave={handleUpdateExercise}
        />
      </div>
    </div>
  );
}

export default Exercise;
