'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { WorkoutType, ExerciseType, ExerciseCreateType } from '@/app/types/types';
import { Container, WorkoutHeader, WorkoutExercises, WorkoutModals } from '@/shared/components';

export default function WorkoutDay({ params }: { params: { workoutId: number | string } }) {
  const { workoutId } = params;
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [initialExercises, setInitialExercises] = useState<ExerciseType[]>([]);
  const [isChanged, setIsChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isWorkoutDayModalOpen, setIsWorkoutDayModalOpen] = useState(false);
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
          loadedExercises = data.days[data.days.length - 1].exercises ?? [];
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

  useEffect(() => {
    setIsChanged(JSON.stringify(exercises) !== JSON.stringify(initialExercises));
  }, [exercises, initialExercises]);

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

  const createNewWorkoutDay = async () => {
    setIsSaving(true);
    try {
      await fetch(`/api/workouts/${workoutId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercises: exercises.map((ex) => ({
            name: ex.exerciseType?.name || 'Unnamed Exercise',
            setGroup: ex.setGroup || [],
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

  const updateExistingWorkoutDay = async () => {
    if (!workoutId) return;
    setIsSaving(true);

    try {
      await fetch(`/api/workouts/${workoutId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercises: exercises.map((ex) => ({
            name: ex.exerciseType?.name || 'Unnamed Exercise',
            setGroup: ex.setGroup || [],
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

  const updateExercise = (updatedExercise: ExerciseType) => {
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === updatedExercise.id ? updatedExercise : exercise)),
    );
  };

  const handleCreateExercise = (exerciseName: string) => {
    const newExercise: ExerciseCreateType = {
      exerciseTypeId: Date.now(), // Временный ID, реальный будет создан на сервере
      workoutDayId: 0, // Временное значение, будет установлено сервером
      setGroup: [
        {
          id: 0, // Временный ID для фронтенда
          exerciseId: 0, // Временное значение, будет установлено сервером
          sets: [], // Пустой массив сетов
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ], // Явно указываем как SetGroupType[]
    };

    setExercises((prev) => [
      ...prev,
      {
        ...newExercise,
        id: Date.now(), // Временный ID для Exercise
        exerciseType: {
          id: newExercise.exerciseTypeId,
          name: exerciseName,
          userId: 0, // Временное значение
          createdAt: new Date(),
          updatedAt: new Date(),
        }, // Временный exerciseType
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ExerciseType,
    ]);
  };

  const handleDeleteExercise = (exerciseId: number) => {
    setExercises((prev) => prev.filter((exercise) => exercise.id !== exerciseId));
    setIsChanged(true);
  };

  const handleUpdateWorkout = async (updates: { title?: string; color?: string }) => {
    if (!workout) return;

    try {
      const response = await fetch(`/api/workouts/${workout.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updates.title,
          color: updates.color,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update workout: ${response.status}`);
      }

      const updatedWorkout = await response.json();

      setWorkout((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          title: updatedWorkout.title,
          color: updatedWorkout.color,
        };
      });
    } catch (error) {
      console.error('Ошибка при обновлении тренировки:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin">
          <Loader size={36} />
        </div>
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

      <WorkoutModals
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
