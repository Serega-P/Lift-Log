"use client";

import React, { useState } from "react";
import { SetType } from "@/app/types/types";
import { Title, Button, Input } from "@/shared/components";
import { RefreshCcw, Check, Trash2 } from "lucide-react";

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
    <div className="w-full m-auto bg-bgBase rounded-[10px] text-primary pb-2.5 mb-5 overflow-hidden">
			{/* Верхняя часть */}
      <div className="flex justify-between items-center mb-2.5 px-5 py-2.5 bg-bgSoft">
        <div className="flex items-center gap-2">
          <Title text="Tri-set" className="font-medium text-[20px]" />
        </div>
        <button 
					className="text-muted"
					onClick={() => console.log("Settings clicked")}
					>
          <Trash2 size={26} />
        </button>
      </div>

      {sets.map((set, index) => {
        const isAutoFilled = set.isRefreshed || (set.weight !== "" && set.reps !== "");

        return (
          <div key={index} className="flex items-center justify-between space-x-2 max-w-[430px] mx-auto px-5 py-2">
            {/* Ввод веса */}
            <div className="flex items-center space-x-2 w-[45%]">
              <Input
                type="number"
                placeholder={String(set.originalWeight)}
                value={set.weight}
                onChange={(e) => updateSet(index, "weight", e.target.value)}
                className={`w-full max-w-[100px] min-w-20 rounded-[6px] bg-bgSoft border-muted h-12 px-0 py-0 text-center text-3xl placeholder:text-muted text-primary font-medium
									${isAutoFilled ? "border-accentSoft" : "border-muted"}`}
              />
              <span className={`text-lg font-bold ${isAutoFilled ? "text-primary" : "text-muted"}`}>kg</span>
            </div>

            {/* Ввод повторений */}
            <div className="flex items-center space-x-2 w-[45%]">
              <Input
                type="number"
                placeholder={String(set.originalReps)}
                value={set.reps}
                onChange={(e) => updateSet(index, "reps", e.target.value)}
                className={`w-full max-w-[100px] min-w-20 rounded-[6px] bg-bgSoft border-muted h-12 px-0 py-0 text-center text-3xl placeholder:text-muted text-primary font-medium
									${isAutoFilled ? "border-accentSoft" : "border-muted"}`}
              />
              <span className={`text-lg font-bold ${isAutoFilled ? "text-primary" : "text-muted"}`}>reps</span>
            </div>

            {/* Кнопка обновления */}
            <div className="flex items-center justify-end w-[10%]">
              <Button
                variant="icons"
                size="icons"
                onClick={() => refreshSet(index)}
                className="bg-non opacity-100 disabled:opacity-100"
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
