"use client";

import React, { useState } from "react";
import { SetType } from "@/app/types/types";
import { Title, Button, Input } from "@/components/shared/components";
import { RefreshCcw, Check } from "lucide-react";

interface Props {
  data: SetType;
  onUpdate: (updatedTriSet: SetType) => void;
}

export const TriSetItem: React.FC<Props> = ({ data, onUpdate }) => {
  // Локальное состояние для каждого сета
  const [sets, setSets] = useState(
    data.subSets.map((set) => ({
      weight: "", // Начальное значение пустое (input изначально пуст)
      reps: "", // Начальное значение пустое
      isRefreshed: false,
      originalWeight: set.weight ?? 0,
      originalReps: set.reps ?? 0,
    }))
  );

  // Функция обновления локального состояния + передача данных в `onUpdate`
  const updateSet = (index: number, field: "weight" | "reps", value: string) => {
    const updatedSets = sets.map((set, idx) =>
      idx === index
        ? {
            ...set,
            [field]: value, // Сохраняем строку
            isRefreshed: set.weight !== "" && set.reps !== "", // Если оба поля заполнены — обновляем
          }
        : set
    );

    setSets(updatedSets);

    // Передаём данные вверх
    onUpdate({
      ...data,
      subSets: updatedSets.map((set, i) => ({
        ...data.subSets[i],
        weight: set.weight === "" ? set.originalWeight : set.weight,
        reps: set.reps === "" ? set.originalReps : set.reps,
      })),
    });
  };

  // Функция сброса значений на оригинальные
  const refreshSet = (index: number) => {
    const updatedSets = sets.map((set, idx) =>
      idx === index
        ? {
            ...set,
            weight: String(set.originalWeight), // Приводим к строке
            reps: String(set.originalReps), // Приводим к строке
            isRefreshed: true, // Теперь это авто-заполнение
          }
        : set
    );

    setSets(updatedSets);

    // Передаём данные вверх
    onUpdate({
      ...data,
      subSets: updatedSets.map((set, i) => ({
        ...data.subSets[i],
        weight: set.originalWeight,
        reps: set.originalReps,
      })),
    });
  };

  return (
    <div className="w-full border-b border-customBorder pb-4 space-y-4">
      <div className="flex justify-start items-center space-x-5 mx-auto">
        <Title text="Tri-set" size="xs" />
      </div>

      {sets.map((set, index) => {
        const isAutoFilled = set.isRefreshed || (set.weight !== "" && set.reps !== "");

        return (
          <div key={index} className="flex items-center justify-between space-x-4 max-w-[430px] mx-auto">
            {/* Ввод веса */}
            <div className="flex items-center space-x-2 w-[40%]">
              <Input
                type="number"
                placeholder={String(set.originalWeight)}
                value={set.weight}
                onChange={(e) => updateSet(index, "weight", e.target.value)}
                className={`w-full max-w-[100px] bg-bgSurface border-muted h-12 px-0 py-0 text-center text-3xl placeholder:text-muted text-primary font-medium
									${isAutoFilled ? "border-accentSoft" : "border-muted"}`}
              />
              <span className={`text-lg font-bold ${isAutoFilled ? "text-primary" : "text-muted"}`}>kg</span>
            </div>

            {/* Ввод повторений */}
            <div className="flex items-center space-x-2 w-[40%]">
              <Input
                type="number"
                placeholder={String(set.originalReps)}
                value={set.reps}
                onChange={(e) => updateSet(index, "reps", e.target.value)}
                className={`w-full max-w-[100px] bg-bgSurface border-muted h-12 px-0 py-0 text-center text-3xl placeholder:text-muted text-primary font-medium
									${isAutoFilled ? "border-accentSoft" : "border-muted"}`}
              />
              <span className={`text-lg font-bold ${isAutoFilled ? "text-primary" : "text-muted"}`}>reps</span>
            </div>

            {/* Кнопка обновления */}
            <div className="flex items-center justify-center w-[20%]">
              <Button
                variant="icons"
                size="icons"
                onClick={() => refreshSet(index)}
                className="bg-none"
                disabled={isAutoFilled} // Отключаем кнопку, если уже обновлено
              >
                {isAutoFilled ? <Check size={28} strokeWidth={3} className="text-accentSoft" /> : <RefreshCcw size={28} strokeWidth={2} />}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
