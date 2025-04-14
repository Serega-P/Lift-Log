'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
const Calendar = dynamic(() => import('react-calendar'), { ssr: false });
import { DayWithColor } from '@/app/types/types';

interface Props {
  events: DayWithColor[];
  onDayClick: (date: string | null) => void;
}

export const MyCalendar: React.FC<Props> = ({ events, onDayClick }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Преобразование списка событий в карту (ключ: "YYYY-MM-DD" в локальном времени)
  const eventMap: Record<string, string[]> = events.reduce((acc, event) => {
    let dateKey: string;

    if (event.date instanceof Date) {
      // Извлекаем дату в локальном времени
      const year = event.date.getFullYear();
      const month = String(event.date.getMonth() + 1).padStart(2, '0');
      const day = String(event.date.getDate()).padStart(2, '0');
      dateKey = `${year}-${month}-${day}`;
    } else if (typeof event.date === 'string' || typeof event.date === 'number') {
      const date = new Date(event.date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      dateKey = `${year}-${month}-${day}`;
    } else {
      console.error('Invalid date format:', event.date);
      return acc;
    }

    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(event.color);
    return acc;
  }, {} as Record<string, string[]>);

  // Кастомизация ячейки календаря
  const tileContent = ({ date }: { date: Date }) => {
    // Извлекаем дату в локальном времени
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateKey = `${year}-${month}-${day}`;

    const colors = eventMap[dateKey] || [];

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
    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const isEventDay = eventMap[dateString] !== undefined;

    setSelectedDate(value);
    onDayClick(isEventDay ? dateString : null);
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
