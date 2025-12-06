'use client';

import React, { useState } from 'react';
import { WorkoutExercise, SetType } from '@/app/types/types';
import {
  Set,
  Title,
  SetNewRecordDrawer,
  ExerciseSettingsPopover,
  EditExerciseDrawer, // 🔥 новое название
  ConfirmDeleteDrawer,
} from '@/shared/components';

interface Props {
  exercise: WorkoutExercise;
  onUpdate: (updatedExercise: WorkoutExercise) => void;
  onDelete: (id: number) => void;
}

export function Exercise({ exercise, onUpdate, onDelete }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);

  const [newExerciseName, setNewExerciseName] = useState('');
  const [newMuscleGroup, setNewMuscleGroup] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);

  const [sets, setSets] = useState<SetType[]>(() =>
    (exercise.setGroup ?? [])
      .flatMap((group) => group.sets ?? [])
      .sort((a, b) => a.order - b.order),
  );

  /* ============================================
      🔥 Обновление имени и muscleGroup
  ============================================ */
  const handleEditExerciseDefinition = async () => {
    const currentName = exerciseData.exerciseType?.name ?? '';
    const currentMG = exerciseData.exerciseType?.muscleGroup ?? '';

    if (
      newExerciseName.trim() === '' ||
      (newExerciseName === currentName && newMuscleGroup === currentMG)
    ) {
      setIsModalOpen(false);
      return;
    }

    const exerciseId = exerciseData.exerciseType?.id ?? exerciseData.exerciseTypeId;

    try {
      setIsLoading(true);

      const res = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newExerciseName,
          muscleGroup: newMuscleGroup,
        }),
      });

      if (!res.ok) throw new Error('Failed to update exercise');

      const updatedExercise: WorkoutExercise = {
        ...exerciseData,
        exerciseType: {
          ...exerciseData.exerciseType!,
          id: exerciseId,
          name: newExerciseName,
          muscleGroup: newMuscleGroup,
          updatedAt: new Date(),
        },
      };

      setExerciseData(updatedExercise);
      onUpdate(updatedExercise);
      setIsModalOpen(false);
    } catch (error) {
      console.error('❌ Ошибка при обновлении:', error);
      alert('Не удалось обновить упражнение');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateExercise = (updatedSets: SetType[]) => {
    const updatedExercise: WorkoutExercise = {
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

  const handleOpenEditDrawer = () => {
    setNewExerciseName(exerciseData.exerciseType?.name || '');
    setNewMuscleGroup(exerciseData.exerciseType?.muscleGroup || '');
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
          onRename={handleOpenEditDrawer}
        />

        <ConfirmDeleteDrawer
          onClose={() => setIsDeleteDrawerOpen(false)}
          isDeleting={undefined}
          isOpen={isDeleteDrawerOpen}
          onConfirmDelete={() => onDelete(exerciseData.id ?? 0)}
        />
      </div>

      <EditExerciseDrawer
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        nameValue={newExerciseName}
        onNameChange={setNewExerciseName}
        muscleGroupValue={newMuscleGroup}
        onMuscleGroupChange={setNewMuscleGroup}
        onSubmit={handleEditExerciseDefinition}
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
