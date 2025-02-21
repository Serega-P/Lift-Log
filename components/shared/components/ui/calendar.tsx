"use client";

import React, { useState } from "react";
import Calendar from "react-calendar";
import { DayWithColor } from "@/app/types/types"; // Импорт типизации

interface Props {
  events: DayWithColor[]; // Список событий
  onDayClick: (date: string) => void; // Обработчик клика на день
}

export const MyCalendar: React.FC<Props> = ({ events, onDayClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Преобразование списка событий в карту для быстрого доступа
  const eventMap: Record<string, string[]> = events.reduce((acc, event) => {
    acc[event.date] = acc[event.date] ? [...acc[event.date], event.color] : [event.color];
    return acc;
  }, {});
  // Кастомизация ячейки календаря
  const tileContent = ({ date }: { date: Date }) => {
    const dateKey = date.toISOString().split("T")[0];
    const colors = eventMap[dateKey] || []; // Получаем массив цветов для данной даты

    return (
      <div className="absolute b-0 r-0 w-full h-full">
        {colors.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {colors.map((color, index) => (
              <span
                key={index}
                style={{
                  backgroundColor: color, // HEX-значение
                }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Обработчик клика по дню
  const handleDayClick = (value: Date) => {
    const dateString = value.toISOString().split("T")[0];
    setSelectedDate(value); // Обновляем выбранную дату
    onDayClick(dateString); // Передаем дату в формате "YYYY-MM-DD"
  };

  return (
    <div className="home-calendar max-w-full mx-auto">
      <Calendar
        onClickDay={handleDayClick} // Клик по дню
        tileContent={tileContent} // Добавляем кастомизацию ячеек
        value={selectedDate} // Текущая выбранная дата
        className="react-calendar"
        navigationLabel={({ date, label }) => label} // Оставляем только название месяца
        next2Label={null} // Убираем кнопку "вперёд на 2 года"
        prev2Label={null} // Убираем кнопку "назад на 2 года"
      />
    </div>
  );
};
