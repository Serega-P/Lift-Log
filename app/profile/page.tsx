'use client';

import { useState } from 'react';
import { Pencil, Camera, LogOut } from 'lucide-react';
import { Button, ToggleGroup, ToggleGroupItem, BottomNavigation } from '@/shared/components';

export default function Profile() {
  const [unit, setUnit] = useState('kg');
  // const [name, setName] = useState('Your Name');

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 px-6">
      {/* Аватар */}
      <div className="relative w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center">
        <span className="text-gray-400 text-4xl">👤</span>
        <button className="absolute bottom-1 right-1 bg-gray-800 p-1 rounded-full border border-gray-700">
          <Camera className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Имя пользователя */}
      <div className="mt-4 flex items-center space-x-2">
        <h2 className="text-white text-lg font-semibold">Your Name</h2>
        <button className="text-gray-400 hover:text-gray-200">
          <Pencil className="w-4 h-4" />
        </button>
      </div>

      {/* Выбор единиц измерения */}
      <ToggleGroup
        type="single"
        className="mt-6 flex bg-gray-800 p-1 rounded-lg"
        value={unit}
        onValueChange={(val) => val && setUnit(val)}>
        <ToggleGroupItem value="kg" className="px-4 py-2 text-white data-[state=on]:bg-blue-500">
          kg
        </ToggleGroupItem>
        <ToggleGroupItem value="lbs" className="px-4 py-2 text-white data-[state=on]:bg-blue-500">
          lbs
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Кнопки */}
      <div className="mt-6 w-full max-w-xs space-y-3">
        <Button variant="secondary" className="w-full">
          Change Password
        </Button>
        <Button variant="destructive" className="w-full flex items-center justify-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span>Sign out</span>
        </Button>
      </div>
      <BottomNavigation />
    </div>
  );
}
