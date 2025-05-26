'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ExerciseType } from '@/app/types/types';
import {
  Button,
  WorkoutSettingsPopover,
  ModalForm,
  WorkoutDeleteModal,
  AddExerciseModal,
} from '@/shared/components';

interface WorkoutHeaderProps {
  workoutTitle: string;
  workoutColor: string;
  workoutId: number | string;
  isChanged: boolean;
  isSaving: boolean;
  onSave: () => void;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseType[]>>;
  exercises: ExerciseType[];
  onUpdate: (updates: { title?: string; color?: string }) => void;
  onCreateExercise: (exerciseName: string) => void;
}

export function WorkoutHeader({
  workoutTitle,
  workoutColor,
  isChanged,
  isSaving,
  onSave,
  onUpdate,
  onCreateExercise,
  workoutId,
  exercises,
  setExercises,
}: WorkoutHeaderProps) {
  const router = useRouter();
  const [isRenameWorkoutModalOpen, setIsRenameWorkoutModalOpen] = useState(false);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState(workoutTitle);
  const [newWorkoutColor, setNewWorkoutColor] = useState(workoutColor);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateExerciseOpen, setIsCreateExerciseOpen] = useState(false);
  const [isAddExerciseDialogOpen, setIsAddExerciseDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [newExerciseName, setNewExerciseName] = React.useState('');

  // Обновляем состояние, если входные пропсы изменились
  React.useEffect(() => {
    setNewWorkoutTitle(workoutTitle);
    setNewWorkoutColor(workoutColor);
  }, [workoutTitle, workoutColor]);

  const handleCreateExercise = () => {
    if (!newExerciseName.trim()) return;
    onCreateExercise(newExerciseName);
    setNewExerciseName('');
    setIsCreateExerciseOpen(false);
  };

  const handleUpdateWorkout = () => {
    onUpdate({
      title: newWorkoutTitle,
      color: newWorkoutColor,
    });
    setIsRenameWorkoutModalOpen(false);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/workouts/${workoutId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to delete workout: ${response.status}`);
      }
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      router.back();
    } catch (error) {
      console.error('Ошибка при удалении тренировки:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-black flex justify-center items-center z-50">
      <div className="w-full max-w-[430px] px-5 py-2 flex justify-between items-center">
        <Button className="text-muted border-none h-12 w-12 p-2" onClick={() => router.back()}>
          <ArrowLeft size={24} strokeWidth={3} />
        </Button>
        <div className="flex items-center space-x-4">
          <WorkoutSettingsPopover
            workoutId={workoutId}
            onRename={() => setIsRenameWorkoutModalOpen(true)}
            onDelete={() => setIsDeleteDialogOpen(true)}
            onCreateExercise={() => setIsCreateExerciseOpen(true)}
            onAddExercise={() => setIsAddExerciseDialogOpen(true)}
          />

          {/* Модалка редактирования */}
          <ModalForm
            isOpen={isRenameWorkoutModalOpen}
            onClose={() => setIsRenameWorkoutModalOpen(false)}
            title="Update Workout"
            description="Enter a new name and color for your workout"
            inputPlaceholder={workoutTitle}
            inputValue={newWorkoutTitle}
            onInputChange={setNewWorkoutTitle}
            onSubmit={handleUpdateWorkout}
            isWorkoutEdit={true}
            selectedColor={newWorkoutColor}
            onColorChange={setNewWorkoutColor}
          />

          <WorkoutDeleteModal
            onClose={() => setIsDeleteDialogOpen(false)}
            isDeleting={isDeleting}
            isOpen={isDeleteDialogOpen}
            onConfirmDelete={() => handleDelete()}
          />

          <AddExerciseModal
            onClose={() => setIsAddExerciseDialogOpen(false)}
            isOpen={isAddExerciseDialogOpen}
            exercises={exercises}
            setExercises={setExercises}
          />

          <ModalForm
            isOpen={isCreateExerciseOpen}
            onClose={() => setIsCreateExerciseOpen(false)}
            title="New Exercise"
            description={`Add a new exercise to your workout ${workoutTitle}`}
            inputPlaceholder="Exercise name"
            inputValue={newExerciseName}
            onInputChange={setNewExerciseName}
            onSubmit={handleCreateExercise}
            isWorkoutEdit={false}
          />

          {isChanged && (
            <Button
              variant="accent"
              size="default"
              className="bg-none h-12 px-6 text-lg font-normal relative overflow-hidden hover:bg-none"
              onClick={onSave}
              disabled={isSaving}>
              <span
                className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
                style={{ opacity: isSaving ? 1 : 0 }}>
                {isSaving && <Loader className="h-5 w-5 text-white animate-spin" />}
              </span>
              <span
                className={cn('transition-opacity duration-300', {
                  'opacity-0': isSaving,
                  'opacity-100': !isSaving,
                })}>
                Save
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
