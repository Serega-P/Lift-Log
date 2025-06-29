'use client';

import React, { useState } from 'react';
import { ExerciseType, SetType } from '@/app/types/types';
import { ArrowRight } from 'lucide-react';
import {
  Button,
  Set,
  TriSet,
  Title,
  EditExerciseModal,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  ExerciseSettingsPopover,
  ModalForm,
} from '@/shared/components';

interface Props {
  exercise: ExerciseType;
  onUpdate: (updatedExercise: ExerciseType) => void;
  onDelete: (id: number) => void;
}

export function Exercise({ exercise, onUpdate, onDelete }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // const [done, setDone] = useState(true);
  const [sets, setSets] = useState<SetType[]>(() =>
    (exercise.setGroup ?? [])
      .flatMap((group) => group.sets ?? [])
      .sort((a, b) => a.order - b.order),
  );

  // Функция для обновления имени упражнения
  const handleRenameExercise = async () => {
    if (!newExerciseName.trim()) return;

    const exerciseId = exerciseData.exerciseType?.id ?? exerciseData.exerciseTypeId;

    try {
      setIsLoading(true); // 🔄 Показываем спиннер

      const res = await fetch(`/api/exercises/${exerciseId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newExerciseName }),
      });

      if (!res.ok) {
        throw new Error('Failed to rename exercise');
      }

      // ✅ Обновляем локальный стейт
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
      setIsModalOpen(false); // ✅ Закрываем модалку
    } catch (error) {
      console.error('❌ Ошибка при переименовании:', error);
      alert('Не удалось переименовать упражнение');
    } finally {
      setIsLoading(false); // 🔽 Скрываем спиннер
    }
  };

  // Обновление сетов упражнения
  const handleUpdateExercise = (updatedSets: SetType[]) => {
    const updatedExercise: ExerciseType = {
      ...exerciseData,
      setGroup:
        updatedSets.length > 0
          ? [
              {
                ...(exerciseData.setGroup?.[0] ?? {}), // Сохраняем существующие свойства группы, если есть
                exerciseId: exerciseData.id, // Устанавливаем связь с упражнением
                sets: updatedSets, // Обновляем сеты
              },
            ]
          : [], // Если сетов нет, оставляем пустой массив
    };

    setExerciseData(updatedExercise);
    setSets(updatedSets);
    onUpdate(updatedExercise);
    setIsOpen(false);
    // setDone(false);
  };

  return (
    <div className="bg-bgBase rounded-2xl text-primary mb-5 overflow-hidden">
      {/* Верхняя часть */}
      <div className="flex justify-between items-center pl-5  border-b border-muted/25">
        <div className="flex items-center gap-2">
          <Title
            text={exerciseData.exerciseType?.name}
            className="font-medium text-primary text-lg"
          />
        </div>
        <ExerciseSettingsPopover
          onDelete={() => onDelete(exerciseData.id ?? 0)}
          onRename={() => setIsModalOpen(true)}
        />
      </div>

      <ModalForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Rename Exercise"
        description="Enter a new name for the exercise"
        inputPlaceholder={exerciseData.exerciseType?.name}
        inputValue={newExerciseName}
        onInputChange={setNewExerciseName}
        onSubmit={handleRenameExercise}
        loading={isLoading}
      />

      {/* Список сетов и трисетов */}
      <div>
        {sets.map((set) => (
          <div key={set.order}>
            {set.type === 'set' && (
              <>
                <span className="font-normal text-sm text-muted pl-5">Set</span>
                <Set set={set} />
              </>
            )}
            {set.type === 'triset' && (
              <>
                <span className="font-normal text-sm text-muted pl-5">Tri-set</span>
                <TriSet triSet={set} />
              </>
            )}
          </div>
        ))}

        {/* Кнопка и модалка для редактирования сетов */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="w-full font-normal uppercase text-base"
              variant="accent"
              onClick={() => setIsOpen(true)}>
              SET A NEW RECORD <ArrowRight size={20} />
            </Button>
          </DialogTrigger>

          <DialogContent
            className="custom-dialog w-full h-full min-h-svh max-w-none flex items-center justify-center border-none p-0"
            forceMount>
            <DialogTitle className="sr-only">Edit Exercise</DialogTitle>
            <DialogDescription className="sr-only">
              Here you can edit your exercise details and set a new record.
            </DialogDescription>

            <EditExerciseModal
              name={exerciseData.exerciseType?.name}
              sets={sets}
              onClose={() => setIsOpen(false)}
              onSave={handleUpdateExercise}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
