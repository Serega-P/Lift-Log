'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { WorkoutType, WorkoutExercise, ExerciseDefinition } from '@/app/types/types';

import { Container, WorkoutHeader, WorkoutExercises, WorkoutSaveDrawer } from '@/shared/components';

export default function WorkoutDay({ params }: { params: { workoutId: number | string } }) {
  const { workoutId } = params;

  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [initialExercises, setInitialExercises] = useState<WorkoutExercise[]>([]);

  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isWorkoutDayModalOpen, setIsWorkoutDayModalOpen] = useState(false);

  const router = useRouter();

  console.log('exercises', exercises);
  /* ================================
     LOAD WORKOUT
  ================================= */
  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await fetch(`/api/workouts/${workoutId}`);
        if (!res.ok) throw new Error(`Failed to fetch workout: ${res.status}`);

        const data: WorkoutType = await res.json();
        setWorkout(data);

        let loadedExercises: WorkoutExercise[] = [];

        if (data.days?.length) {
          const lastDay = data.days[data.days.length - 1];
          loadedExercises = (lastDay.exercises as WorkoutExercise[]) ?? [];
        }

        setExercises(loadedExercises);
        setInitialExercises(loadedExercises);
      } catch (error) {
        console.error('Ошибка загрузки тренировки:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkout();
  }, [workoutId]);

  /* ================================
     DETECT CHANGES
  ================================= */
  useEffect(() => {
    setIsChanged(JSON.stringify(exercises) !== JSON.stringify(initialExercises));
  }, [exercises, initialExercises]);

  /* ================================
     SAVE WORKOUT
  ================================= */
  const saveWorkout = async () => {
    if (!isChanged) return;

    setIsSaving(true);

    const res = await fetch(`/api/workouts/${workoutId}`);
    const data: WorkoutType = await res.json();

    const today = new Date().setHours(0, 0, 0, 0);

    const existingWorkoutDay = data.days?.find(
      (day) => day.date && new Date(day.createdAt).setHours(0, 0, 0, 0) === today,
    );

    if (existingWorkoutDay) {
      setIsWorkoutDayModalOpen(true);
      setIsSaving(false);
    } else {
      createNewWorkoutDay();
    }
  };

  /* ================================
     CREATE NEW WORKOUT DAY
  ================================= */
  const createNewWorkoutDay = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/workouts/${workoutId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercises: exercises.map((ex) => ({
            exerciseTypeId: ex.exerciseTypeId,
            setGroup: ex.setGroup,
          })),
        }),
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

  /* ================================
     UPDATE EXISTING DAY
  ================================= */
  const updateExistingWorkoutDay = async () => {
    setIsSaving(true);

    try {
      await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercises: exercises.map((ex) => ({
            exerciseTypeId: ex.exerciseTypeId,
            setGroup: ex.setGroup,
          })),
        }),
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

  /* ================================
     UPDATE LOCAL EXERCISE
  ================================= */
  const updateExercise = (updatedExercise: WorkoutExercise) => {
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === updatedExercise.id ? updatedExercise : exercise)),
    );
  };

  /* ================================
     CREATE EXERCISE (LOCAL)
  ================================= */
  const handleCreateExercise = (exerciseName: string, muscleGroup: string) => {
    const tempId = Date.now();

    const newDefinition: ExerciseDefinition = {
      id: tempId,
      name: exerciseName,
      muscleGroup,
      userId: '0',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newExercise: WorkoutExercise = {
      id: tempId,
      workoutDayId: 0,
      exerciseTypeId: tempId,
      exerciseType: newDefinition,

      setGroup: [
        {
          id: tempId,
          exerciseId: tempId,
          sets: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setExercises((prev) => [...prev, newExercise]);
  };

  /* ================================
     DELETE
  ================================= */
  const handleDeleteExercise = (exerciseId: number) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
    setIsChanged(true);
  };

  /* ================================
     UPDATE WORKOUT META
  ================================= */
  const handleUpdateWorkout = async (updates: { title?: string; color?: string }) => {
    if (!workout) return;

    try {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        throw new Error(`Failed to update workout: ${response.status}`);
      }

      const updatedWorkout = await response.json();

      setWorkout((prev) =>
        prev
          ? {
              ...prev,
              title: updatedWorkout.title,
              color: updatedWorkout.color,
            }
          : prev,
      );
    } catch (error) {
      console.error('Ошибка при обновлении тренировки:', error);
    }
  };

  /* ================================
     UI
  ================================= */
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader size={36} className="animate-spin" />
      </div>
    );
  }

  if (!workout) {
    return <div className="text-center text-gray-500">Workout not found.</div>;
  }

  return (
    <Container className="w-full px-6 py-20 relative min-h-screen">
      <WorkoutHeader
        workoutTitle={workout.title}
        workoutColor={workout.color}
        isChanged={isChanged}
        isSaving={isSaving}
        onSave={saveWorkout}
        onUpdate={handleUpdateWorkout}
        workoutId={workoutId}
        onCreateExercise={handleCreateExercise}
        exercises={exercises}
        setExercises={setExercises}
      />

      <WorkoutExercises
        exercises={exercises}
        lastWorkoutDate={workout.days?.length ? workout.days[0].date : undefined}
        workoutTitle={workout.title}
        onUpdateExercise={updateExercise}
        onDeleteExercise={handleDeleteExercise}
      />

      <WorkoutSaveDrawer
        isOpen={isWorkoutDayModalOpen}
        isSaving={isSaving}
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
