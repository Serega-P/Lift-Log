'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Disc3, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkoutType, ExerciseType, ExerciseCreateType } from '@/app/types/types';
import {
  Container,
  Title,
  Exercise,
  Button,
  WorkoutSettingsPopover,
  ModalForm,
  WorkoutSaveModal,
} from '@/shared/components';

export default function WorkoutDay({ params }: { params: { workoutId: number | string } }) {
  const { workoutId } = params;
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [initialExercises, setInitialExercises] = useState<ExerciseType[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRenameWorkoutModalOpen, setIsRenameWorkoutModalOpen] = useState(false);
  const [isWorkoutDayModalOpen, setIsWorkoutDayModalOpen] = useState(false);
  const [newWorkoutTitle, setNewWorkoutTitle] = useState('');
  const [newExerciseName, setNewExerciseName] = useState('');
  const router = useRouter();

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await fetch(`/api/workouts/${workoutId}`);
        if (!res.ok) throw new Error(`Failed to fetch workout: ${res.status}`);

        const data: WorkoutType = await res.json();
        setWorkout(data);
        let loadedExercises: ExerciseType[] = [];
        if (data.days?.length) {
          loadedExercises = data.days[data.days.length - 1].exercises;
        } else if (data.exercises?.length) {
          loadedExercises = data.exercises;
        }

        setExercises(loadedExercises);
        setInitialExercises(loadedExercises); // Сохраняем исходное состояние
      } catch (error) {
        console.error('Ошибка загрузки тренировки:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkout();
  }, [workoutId]);

  useEffect(() => {
    setIsChanged(JSON.stringify(exercises) !== JSON.stringify(initialExercises));
  }, [exercises, initialExercises]);

  const saveWorkout = async () => {
    if (!isChanged) return;
    setIsSaving(true);
    const res = await fetch(`/api/workouts/${workoutId}`);
    const data: WorkoutType = await res.json();

    const today = new Date().toISOString().split('T')[0];
    const existingWorkoutDay = data.days?.find(
      (day) => new Date(day.date).toISOString().split('T')[0] === today,
    );

    if (existingWorkoutDay) {
      setIsWorkoutDayModalOpen(true);
      setIsSaving(false);
    } else {
      createNewWorkoutDay();
    }
  };

  const createNewWorkoutDay = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/workouts/${workoutId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutId, exercises }),
      });

      setInitialExercises(exercises);
      setIsChanged(false);
      router.push('/');
    } catch (error) {
      console.error('Ошибка при сохранении тренировки:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const updateExistingWorkoutDay = async () => {
    if (!workoutId) return;
    setIsSaving(true);

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workoutId, exercises }),
      });

      setInitialExercises(exercises);
      setIsChanged(false);
    } catch (error) {
      console.error('Ошибка при обновлении тренировки:', error);
    } finally {
      setIsSaving(false);
      setIsWorkoutDayModalOpen(false);
    }
  };

  const updateExercise = (updatedExercise: ExerciseType) => {
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === updatedExercise.id ? updatedExercise : exercise)),
    );
  };

  const handleAddExercise = () => {
    if (!newExerciseName.trim()) return;

    const newExercise: ExerciseCreateType = {
      name: newExerciseName,
      setGroup: [{ sets: [], exerciseId: 0, exercise: null }],
    };

    setExercises((prev) => [
      ...prev,
      {
        ...newExercise,
        id: Date.now(),
        workoutId: workoutId,
        dayExercises: 0,
      } as ExerciseType,
    ]);

    setNewExerciseName('');
    setIsModalOpen(false);
  };

  const handleDeleteExercise = (exerciseId: number) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
    setIsChanged(true);
  };

  const handleRenameWorkout = () => {
    if (!workout) return;

    setWorkout({ ...workout, title: newWorkoutTitle });
    setIsRenameWorkoutModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Disc3 size={36} />
        </div>
      </div>
    );
  }

  if (!workout) {
    return <div className="text-center text-gray-500">Workout not found.</div>;
  }

  return (
    <Container className="w-full px-6 py-20 relative min-h-screen">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 w-full bg-bgBase px-6 py-4 flex justify-between items-center z-50">
        <Button
          className="text-white border-none bg-bgSoft h-12 w-12 p-2"
          onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </Button>
        <div className="flex items-center space-x-4">
          <WorkoutSettingsPopover onRename={() => setIsRenameWorkoutModalOpen(true)} />
          <ModalForm
            isOpen={isRenameWorkoutModalOpen}
            onClose={() => setIsRenameWorkoutModalOpen(false)}
            title="Rename Workout"
            description="Enter a new name for your workout"
            inputPlaceholder={workout.title}
            inputValue={newWorkoutTitle}
            onInputChange={setNewWorkoutTitle}
            onSubmit={handleRenameWorkout}
          />
          {isChanged && (
            <Button
              variant="accent"
              size="default"
              className="bg-green-500 h-12 px-6 text-lg font-normal relative overflow-hidden hover:bg-green-400"
              onClick={saveWorkout}
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

      {/* Offset content */}
      <div className="pt-20">
        <div className="mb-4">
          {workout.days?.length ? (
            <p className="flex items-center text-muted text-sm">
              Last workout:{' '}
              {new Date(workout.days[workout.days.length - 1].date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          ) : (
            <p className="flex items-center text-muted text-sm">No workout yet</p>
          )}
          <Title text={workout.title} size="sm" className="font-bold" />
        </div>

        {/* Exercises */}
        <div className="space-y-6">
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <Exercise
                key={exercise.id}
                exercise={exercise}
                onUpdate={updateExercise}
                onDelete={() => handleDeleteExercise(exercise.id ?? 0)}
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
          description={`Add a new exercise to your workout ${workout.title}`}
          inputPlaceholder="Exercise name"
          inputValue={newExerciseName}
          onInputChange={setNewExerciseName}
          onSubmit={handleAddExercise}
        />
      </div>

      <WorkoutSaveModal
        isOpen={isWorkoutDayModalOpen}
        onClose={() => {
          setIsWorkoutDayModalOpen(false);
          setIsSaving(false);
        }}
        onUpdate={updateExistingWorkoutDay}
        onCreateNew={createNewWorkoutDay}
      />
    </Container>
  );
}
