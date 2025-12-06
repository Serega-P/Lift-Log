'use client';

import React, { useEffect } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Button,
  Input,
  ScrollArea,
} from '@/shared/components';
import { X, Loader } from 'lucide-react';

const GROUP_COLORS: Record<string, string> = {
  chest: 'bg-green-600',
  back: 'bg-amber-600',
  legs: 'bg-blue-600',
  arms: 'bg-purple-600',
  shoulders: 'bg-pink-600',
  core: 'bg-teal-600',
};

interface Props {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;

  nameValue: string;
  onNameChange: (value: string) => void;

  muscleGroupValue: string;
  onMuscleGroupChange: (value: string) => void;

  onSubmit: () => void;
}

export const EditExerciseDrawer: React.FC<Props> = ({
  isOpen,
  loading,
  onClose,
  nameValue,
  onNameChange,
  muscleGroupValue,
  onMuscleGroupChange,
  onSubmit,
}) => {
  useEffect(() => {
    if (!isOpen) {
      onNameChange('');
      onMuscleGroupChange('');
    }
  }, [isOpen, onNameChange, onMuscleGroupChange]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[99.5vh] m-auto max-w-[720px] bg-bgBase p-5 pt-2 border border-bgSoft/70 rounded-t-6xl">
        <DrawerHeader className="flex px-0 py-2 justify-between items-center">
          <DrawerClose asChild>
            <button className="p-2 w-12 h-12 rounded-full bg-black/50 text-muted" onClick={onClose}>
              <X size={24} strokeWidth={1} className="m-auto" />
            </button>
          </DrawerClose>

          <Button
            variant="accent"
            size="default"
            className={`
              bg-none rounded-full h-12 text-lg font-normal relative overflow-hidden
              ${nameValue === '' ? 'opacity-40 pointer-events-none' : 'hover:bg-accent'}
            `}
            onClick={onSubmit}
            disabled={loading}>
            <span
              className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
              style={{ opacity: loading ? 1 : 0 }}>
              {loading && <Loader className="h-5 w-5 text-white animate-spin" />}
            </span>

            <span className={loading ? 'opacity-0' : 'opacity-100'}>Save</span>
          </Button>
        </DrawerHeader>

        <ScrollArea className="h-full w-full">
          <div>
            <DrawerTitle className="text-2xl font-light">Edit Exercise</DrawerTitle>
            <DrawerDescription className="text-muted mt-1 text-base">
              Change name or muscle group
            </DrawerDescription>
          </div>

          <div className="flex flex-col items-center w-full px-4 py-8 space-y-6">
            {/* NAME INPUT */}
            <Input
              value={nameValue}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Exercise name"
              className="pl-4 py-3 rounded-[6px] bg-bgSoft placeholder:font-normal font-bold border-muted/25 max-w-[430px] w-full"
            />

            {/* MUSCLE GROUP SELECT */}
            <div className="w-full max-w-[430px]">
              <p className="text-muted mb-2 text-sm">Muscle group (optional)</p>

              <div className="grid grid-cols-3 gap-2">
                {Object.keys(GROUP_COLORS).map((group) => (
                  <button
                    key={group}
                    onClick={() => onMuscleGroupChange(group)}
                    className={`
                      ${GROUP_COLORS[group]}
                      text-white py-2 px-3 rounded-lg text-sm capitalize
                      transition border-2
                      ${
                        muscleGroupValue === group
                          ? 'border-accent'
                          : 'border-transparent opacity-70'
                      }
                    `}>
                    {group}
                  </button>
                ))}

                {/* NOT SELECTED */}
                <button
                  onClick={() => onMuscleGroupChange('')}
                  className={`
                    bg-bgSoft text-white py-2 px-3 rounded-lg text-sm
                    transition border-2
                    ${muscleGroupValue === '' ? 'border-accent' : 'border-transparent opacity-70'}
                  `}>
                  Not selected
                </button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
