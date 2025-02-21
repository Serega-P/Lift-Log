"use client";

import React, { useState } from "react";
import { SetType } from "@/app/types/types";
import { Title, Button, Input } from "@/components/shared/components";
import { RefreshCcw, Check } from "lucide-react";

interface Props {
  data: SetType;
  onUpdate: (updatedSet: SetType) => void;
}

export const SetItem: React.FC<Props> = ({ data, onUpdate }) => {
  const [weight, setWeight] = useState<number | string>(""); // По умолчанию импут пустой
  const [reps, setReps] = useState<number | string>(""); // По умолчанию импут пустой
  const [isRefreshed, setIsRefreshed] = useState(false); // Для отслеживания нажатия на кнопку Refresh

  // Проверка: оба поля заполнены (для отображения Check)
  const isAutoFilled = (weight !== "" && reps !== "") || isRefreshed;

  const handleInputChange = (field: "weight" | "reps", value: string) => {
    const updatedValue = value === "" ? "" : Number(value); // Пустая строка остаётся пустой
    if (field === "weight") {
      setWeight(updatedValue);
    } else {
      setReps(updatedValue);
    }

    // Сбрасываем состояние кнопки Refresh, если пользователь меняет значения вручную
    setIsRefreshed(false);

    // Передаём обновлённые данные в onUpdate
    onUpdate({ ...data, [field]: updatedValue });
  };

  const handleRefreshClick = () => {
    // Заполняем данные из props (data)
    setWeight(data.weight || "");
    setReps(data.reps || "");

    // Устанавливаем состояние для отображения Check
    setIsRefreshed(true);
  };

  return (
    <div className="w-full pb-4 border-b border-customBorder space-y-4">
      {/* Заголовок */}
      <div className="flex justify-start items-center space-x-5 mx-auto">
        <Title text="Set" size="xs" />
      </div>

      {/* Контейнер для ввода и кнопки */}
      <div className="flex items-center justify-between space-x-4 max-w-[430px] mx-auto">
        {/* Поле для веса */}
        <div className="flex items-center space-x-2 w-[40%]">
          <Input
            type="number"
            placeholder={data.weight === "" ? "" : String(data.weight)} // Placeholder из props
            value={weight === "" ? "" : String(weight)} // Значение импута
            onChange={(e) => handleInputChange("weight", e.target.value)} // Обработчик изменения
            className={`w-full max-w-[100px] bg-bgSurface border-muted h-12 px-0 py-0 text-center text-3xl placeholder:text-muted text-primary font-medium
							${isAutoFilled ? "border-accentSoft" : "border-muted"}`}
          />
          <span className={`${isAutoFilled ? "text-primary" : "text-muted"} text-lg font-bold`}>kg</span>
        </div>

        {/* Поле для повторений */}
        <div className="flex items-center space-x-2 w-[40%]">
          <Input
            type="number"
            placeholder={data.reps === "" ? "" : String(data.reps)} // Placeholder из props
            value={reps === "" ? "" : String(reps)} // Значение импута
            onChange={(e) => handleInputChange("reps", e.target.value)} // Обработчик изменения
            className={`w-full max-w-[100px] bg-bgSurface border-muted h-12 px-0 py-0 text-center text-3xl placeholder:text-muted text-primary font-medium
							${isAutoFilled ? "border-accentSoft" : "border-muted"}`}
          />
          <span className={`${isAutoFilled ? "text-primary" : "text-muted"} text-lg font-bold`}>reps</span>
        </div>

        {/* Кнопка Refresh/Check */}
        <div className="flex items-center justify-center w-[20%]">
          <Button
            variant="icons"
            size="icons"
            onClick={handleRefreshClick}
            className="bg-none"
          >
            {isAutoFilled ? <Check size={28} strokeWidth={3} className="text-accentSoft" /> : <RefreshCcw size={28} strokeWidth={2} />}
          </Button>
        </div>
      </div>
    </div>
  );
};
