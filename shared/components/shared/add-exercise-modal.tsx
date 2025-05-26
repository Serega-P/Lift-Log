'use client';

import React, { useState, useEffect } from 'react';
import {
  ScrollArea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Checkbox,
} from '@/shared/components';
import { ExerciseType } from '@/app/types/types';

interface Props {
  exercises: ExerciseType[];
  isOpen: boolean;
  onClose: () => void;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseType[]>>;
}

export const AddExerciseModal: React.FC<Props> = ({ exercises, setExercises, isOpen, onClose }) => {
  const [allExercises, setAllExercises] = useState<ExerciseType[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(false);

  // Получение упражнений из API
  useEffect(() => {
    if (isOpen) {
      const fetchExercises = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/workouts/exercises');
          if (!response.ok) {
            throw new Error('Failed to fetch exercises');
          }
          const data: ExerciseType[] = await response.json();
          setAllExercises(data);
        } catch (error) {
          console.error('Error fetching exercises:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchExercises();
    }
  }, [isOpen]);

  // Фильтрация: убираем упражнения, которые уже есть в пропсах
  const availableExercises = allExercises.filter(
    (exercise) =>
      !exercises.some((existing) => existing.exerciseType?.id === exercise.exerciseType?.id),
  );

  // Обработка выбора упражнения
  const handleCheckboxChange = (exercise: ExerciseType, checked: boolean) => {
    if (checked) {
      setSelectedExercises((prev) => [...prev, exercise]);
    } else {
      setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exercise.id));
    }
  };

  // Сохранение выбранных упражнений
  const handleSave = () => {
    setExercises((prev) => [...prev, ...selectedExercises]);
    setSelectedExercises([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-bgBase border-none max-w-[400px] py-10 rounded-[10px] flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle className="text-xl">All Exercises</DialogTitle>
          <DialogDescription className="mb-5 text-base">Select an exercise</DialogDescription>
        </DialogHeader>
        <ScrollArea className="w-full max-h-[500px]">
          {loading ? (
            <div className="text-center text-muted">Loading exercises...</div>
          ) : availableExercises.length > 0 ? (
            <div className="space-y-2">
              {availableExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center space-x-2 p-2 border-b border-muted/25">
                  <Checkbox
                    id={`exercise-${exercise.id}`}
                    checked={selectedExercises.some((ex) => ex.id === exercise.id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(exercise, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`exercise-${exercise.id}`}
                    className="text-base font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {exercise.exerciseType?.name}
                  </label>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted">No new exercises available</div>
          )}
        </ScrollArea>
        <div className="w-full flex justify-between space-x-5 mt-5">
          <Button variant="secondary" className="text-base rounded-[6px] w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="accent"
            className="text-base text-primary rounded-[6px] w-full bg-accent hover:text-primary"
            onClick={handleSave}
            disabled={selectedExercises.length === 0 || loading}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
