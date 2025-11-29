'use client';

import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Button,
  ScrollArea,
  Checkbox,
} from '@/shared/components';
import { X, Loader } from 'lucide-react';
import { ExerciseType } from '@/app/types/types';

interface Props {
  exercises: ExerciseType[];
  isOpen: boolean;
  onClose: () => void;
  setExercises: React.Dispatch<React.SetStateAction<ExerciseType[]>>;
}

export const AddExerciseDrawer: React.FC<Props> = ({
  exercises,
  isOpen,
  onClose,
  setExercises,
}) => {
  const [allExercises, setAllExercises] = useState<ExerciseType[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ExerciseType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchExercises = async () => {
        setLoading(true);
        try {
          const res = await fetch('/api/workouts/exercises');
          const data: ExerciseType[] = await res.json();
          setAllExercises(data);
        } catch (err) {
          console.error('Error fetching exercises:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchExercises();
    }
  }, [isOpen]);

  const availableExercises = allExercises.filter(
    (exercise) =>
      !exercises.some((existing) => existing.exerciseType?.id === exercise.exerciseType?.id),
  );

  const handleCheckboxChange = (exercise: ExerciseType, checked: boolean) => {
    if (checked) {
      setSelectedExercises((prev) => [...prev, exercise]);
    } else {
      setSelectedExercises((prev) => prev.filter((ex) => ex.id !== exercise.id));
    }
  };

  const handleSave = () => {
    setExercises((prev) => [...prev, ...selectedExercises]);
    setSelectedExercises([]);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[99.5vh] m-auto max-w-[720px] overflow-y-auto p-5 pb-0 pt-2 bg-bgBase border border-bgSoft/70 border-b-0 border-r-0 border-l-0 rounded-t-6xl overflow-hidden">
        <DrawerHeader className="flex px-0 py-2 justify-between items-center">
          <DrawerClose asChild>
            <button className="p-2 w-12 h-12 rounded-full bg-black/50 text-muted" onClick={onClose}>
              <X size={24} strokeWidth={1} className="m-auto" />
            </button>
          </DrawerClose>

          <Button
            variant="accent"
            size="default"
            className={`
                    bg-none rounded-full h-12 text-lg font-normal relative overflow-hidden
                    ${
                      selectedExercises.length === 0
                        ? 'opacity-40 pointer-events-none'
                        : 'hover:bg-accent'
                    }
            `}
            onClick={handleSave}
            disabled={loading || selectedExercises.length === 0}>
            <span
              className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
              style={{ opacity: loading ? 1 : 0 }}>
              {loading && <Loader className="h-5 w-5 text-white animate-spin" />}
            </span>

            <span className={loading ? 'opacity-0' : 'opacity-100'}>Add</span>
          </Button>
        </DrawerHeader>

        <ScrollArea className="w-full h-full">
          <div className="flex flex-col items-center w-full min-h-svh px-4 py-10 space-y-5">
            {/* Title */}
            <div className="text-start w-full max-w-[430px]">
              <DrawerTitle className="font-light text-3xl">All Exercises</DrawerTitle>
              <DrawerDescription className="text-muted text-base mt-1">
                Select an exercise
              </DrawerDescription>
            </div>

            {/* Exercises List */}
            <div className="w-full max-w-[430px]">
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
                        className="text-base font-medium leading-none">
                        {exercise.exerciseType?.name}
                      </label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted">No new exercises available</div>
              )}
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
