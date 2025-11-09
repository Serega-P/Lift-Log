'use client';

import React, { useState } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  Button,
  Input,
} from '@/shared/components';
import { toast } from 'sonner';

interface Props {
  onWorkoutCreated?: () => void;
}

export const NewWorkoutDrawer: React.FC<Props> = ({ onWorkoutCreated }) => {
  const [open, setOpen] = useState(false);
  const [workoutName, setWorkoutName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#4f46e5');
  const [loading, setLoading] = useState(false);

  const colors = [
    '#4f46e5', // Indigo
    '#10b981', // Emerald
    '#ef4444', // Red
    '#f59e0b', // Amber
    '#3b82f6', // Blue
    '#8b5cf6', // Violet
    '#ec4899', // Pink
  ];

  const handleSubmit = async () => {
    if (!workoutName.trim()) {
      toast.warning('Please enter a workout name.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: workoutName,
          color: selectedColor,
          exercises: [],
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to create workout');
      }

      toast.success('Workout created successfully!');

      // Перезагружаем список
      onWorkoutCreated?.();

      // Сбрасываем поля и закрываем Drawer
      setWorkoutName('');
      setSelectedColor('#4f46e5');
      setOpen(false);
    } catch (error) {
      console.error('Error creating workout:', error);
      toast.error('Failed to create workout. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="secondary" className="rounded-full border-bgSoft/90 font-medium mt-4">
          + Add Workout
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[95vh] m-auto max-w-[480px] overflow-y-auto p-5 pb-8 pt-0 bg-bgBase border border-bgSoft/70 rounded-t-6xl overflow-hidden">
        <DrawerHeader className="mb-10">
          <DrawerTitle className="mt-4 text-3xl font-normal text-center">New workout</DrawerTitle>
          <DrawerDescription className="text-base text-muted font-light text-center">
            Name your training day and pick a color.
          </DrawerDescription>
        </DrawerHeader>

        {/* Workout name */}
        <div className="flex flex-col space-y-3 mt-4">
          <label className="text-lg">Name</label>
          <Input
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            placeholder="Enter name..."
            className="text-lg rounded-2xl h-14 border-bgSoft/80 bg-bgMuted"
          />
        </div>

        {/* Color picker */}
        <div className="flex flex-col space-y-3 mt-8">
          <label className="text-lg">Color</label>
          <div className="flex justify-between">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-10 h-10 rounded-full border-2 transition-all ${
                  selectedColor === color
                    ? 'scale-110 border-white'
                    : 'border-transparent opacity-70'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        <DrawerFooter className="flex flex-col space-y-2">
          <Button
            variant="accent"
            onClick={handleSubmit}
            disabled={loading}
            className="h-14 w-full rounded-2xl font-normal text-lg">
            {loading ? 'Creating...' : 'Create'}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
