'use client';

import React, { useState } from 'react';
import { SetType } from '@/app/types/types';
import { Title, Button, Input } from '@/shared/components';
import { RefreshCcw, Check, Trash2 } from 'lucide-react';

interface Props {
  data: SetType;
  onUpdate: (updatedTriSet: SetType) => void;
  onDelete: (order: number) => void;
}

export const TriSetItem: React.FC<Props> = ({ data, onUpdate, onDelete }) => {
  // Локальное состояние для каждого сета
  const [sets, setSets] = useState<
    {
      weight: string;
      reps: string;
      isRefreshed: boolean;
      originalWeight: number;
      originalReps: number;
    }[]
  >(
    data.subSets?.map((set) => ({
      weight: '', // Начальное значение пустое (input изначально пуст)
      reps: '', // Начальное значение пустое
      isRefreshed: false,
      originalWeight: set.weight ?? 0,
      originalReps: set.reps ?? 0,
    })) ?? [],
  );

  // Функция обновления локального состояния + передача данных в `onUpdate`
  const updateSet = (index: number, field: 'weight' | 'reps', value: string) => {
    const updatedSets = sets.map((set, idx) =>
      idx === index
        ? {
            ...set,
            [field]: value, // Сохраняем строку для локального состояния
            isRefreshed: set.weight !== '' && set.reps !== '', // Если оба поля заполнены — обновляем
          }
        : set,
    );

    setSets(updatedSets);

    // Передаём данные вверх, преобразуя строки в number | null
    onUpdate({
      ...data,
      subSets: updatedSets.map((set, i) => {
        const existingSubSet = (data.subSets ?? [])[i] || {};
        const weightValue = set.weight === '' ? set.originalWeight : Number(set.weight);
        const repsValue = set.reps === '' ? set.originalReps : Number(set.reps);

        return {
          ...existingSubSet,
          weight: isNaN(weightValue) ? null : weightValue, // Преобразуем в number | null
          reps: isNaN(repsValue) ? null : repsValue, // Преобразуем в number | null
          order: existingSubSet.order ?? i + 1, // Устанавливаем порядок
        };
      }),
    });
  };

  // Функция сброса значений на оригинальные
  const refreshSet = (index: number) => {
    const updatedSets = sets.map((set, idx) =>
      idx === index
        ? {
            ...set,
            weight: String(set.originalWeight), // Приводим к строке для input
            reps: String(set.originalReps), // Приводим к строке для input
            isRefreshed: true, // Теперь это авто-заполнение
          }
        : set,
    );

    setSets(updatedSets);

    // Передаём данные вверх
    onUpdate({
      ...data,
      subSets: updatedSets.map((set, i) => {
        const existingSubSet = (data.subSets ?? [])[i] || {};
        return {
          ...existingSubSet,
          weight: set.originalWeight, // Уже number | null
          reps: set.originalReps, // Уже number | null
          order: existingSubSet.order ?? i + 1, // Устанавливаем порядок
        };
      }),
    });
  };

  return (
    <div className="w-full m-auto bg-bgBase rounded-2xl text-primary pb-2.5 mb-5 overflow-hidden">
      {/* Верхняя часть */}
      <div className="flex justify-between items-center mb-2.5 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <Title text="Tri-set" className="font-medium text-base" />
        </div>
        <button className="text-red-400" onClick={() => onDelete(data.order)}>
          <Trash2 size={26} />
        </button>
      </div>

      {sets.map((set, index) => {
        const isAutoFilled = set.isRefreshed || (set.weight !== '' && set.reps !== '');

        return (
          <div
            key={index}
            className="flex items-center justify-between space-x-2 max-w-[430px] mx-auto px-5 py-2">
            {/* Ввод веса */}
            <div className="flex items-center space-x-2 w-[45%]">
              <Input
                type="number"
                placeholder={String(set.originalWeight)}
                value={set.weight}
                onChange={(e) => updateSet(index, 'weight', e.target.value)}
                className={`w-full max-w-[100px] min-w-20 rounded-[6px] bg-bgBase border-muted h-12 px-0 py-0 text-center text-2xl placeholder:text-muted text-primary font-medium
                  ${isAutoFilled ? 'border-accentSoft' : 'border-muted'}`}
              />
              <span
                className={`text-base font-medium ${isAutoFilled ? 'text-primary' : 'text-muted'}`}>
                kg
              </span>
            </div>

            {/* Ввод повторений */}
            <div className="flex items-center space-x-2 w-[45%]">
              <Input
                type="number"
                placeholder={String(set.originalReps)}
                value={set.reps}
                onChange={(e) => updateSet(index, 'reps', e.target.value)}
                className={`w-full max-w-[100px] min-w-20 rounded-[6px] bg-bgBase border-muted h-12 px-0 py-0 text-center text-2xl placeholder:text-muted text-primary font-medium
                  ${isAutoFilled ? 'border-accentSoft' : 'border-muted'}`}
              />
              <span
                className={`text-base font-medium ${isAutoFilled ? 'text-primary' : 'text-muted'}`}>
                reps
              </span>
            </div>

            {/* Кнопка обновления */}
            <div className="flex items-center justify-end w-[10%]">
              <Button
                variant="icons"
                size="icons"
                onClick={() => refreshSet(index)}
                className="bg-none opacity-100 disabled:opacity-100"
                disabled={isAutoFilled} // Отключаем кнопку, если уже обновлено
              >
                {isAutoFilled ? (
                  <Check size={28} strokeWidth={3} className="text-accentSoft" />
                ) : (
                  <RefreshCcw size={28} strokeWidth={2} />
                )}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
