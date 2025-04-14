'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const Calendar = dynamic(() => import('react-calendar'), { ssr: false });
import { DayWithColor } from '@/app/types/types'; // Импорт типизации

interface Props {
  events: DayWithColor[]; // Список событий
  onDayClick: (date: string | null) => void; // Обработчик клика на день
}

export const MyCalendar: React.FC<Props> = ({ events, onDayClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Преобразование списка событий в карту (ключ: "YYYY-MM-DD")
  const eventMap: Record<string, string[]> = events.reduce((acc, event) => {
    let dateKey: string;

    if (event.date instanceof Date) {
      dateKey = event.date.toISOString().split('T')[0]; // Уже объект Date
    } else if (typeof event.date === 'string' || typeof event.date === 'number') {
      dateKey = new Date(event.date).toISOString().split('T')[0]; // Конвертируем строку/число в Date
    } else {
      // console.error('Invalid date format:', event.date); // Логируем ошибку
      return acc;
    }

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event.color);
    return acc;
  }, {} as Record<string, string[]>);

  console.log(eventMap);

  // Кастомизация ячейки календаря
  const tileContent = ({ date }: { date: Date }) => {
    const dateKey = date.toISOString().split('T')[0]; // Тот же формат
    const colors = eventMap[dateKey] || []; // Получаем массив цветов

    return (
      <div className="absolute w-full h-full">
        {colors.length > 0 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
            {colors.map((color, index) => (
              <span
                key={index}
                style={{ backgroundColor: color }}
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
    const dateString = value.toISOString().split('T')[0];
    const isEventDay = eventMap[dateString] !== undefined; // Проверяем, есть ли дата в eventMap

    setSelectedDate(value);
    onDayClick(isEventDay ? dateString : null); // Если дата есть в events, передаём её, иначе null
  };

  return (
    <div className="home-calendar max-w-full mx-auto">
      <Calendar
        onClickDay={handleDayClick}
        tileContent={tileContent}
        value={selectedDate}
        className="react-calendar"
        navigationLabel={({ label }) => label}
        next2Label={null}
        prev2Label={null}
      />
    </div>
  );
};
