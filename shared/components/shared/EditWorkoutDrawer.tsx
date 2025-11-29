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
import { X, Check, Loader2 } from 'lucide-react';

const COLORS = [
  '#34C759',
  '#FF9500',
  '#00C7BE',
  '#6750A4',
  '#007AFF',
  '#C00F0C',
  '#682D03',
  '#F19EDC',
];

interface Props {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  description?: string;
  inputPlaceholder?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const EditWorkoutDrawer: React.FC<Props> = ({
  isOpen,
  loading,
  onClose,
  inputPlaceholder = 'Workout name',
  inputValue,
  onInputChange,
  onSubmit,
  selectedColor,
  onColorChange,
}) => {
  useEffect(() => {
    if (!isOpen) {
      onInputChange('');
    }
  }, [isOpen]);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="h-[99.5vh] m-auto max-w-[720px] bg-bgBase p-5 pt-2 border border-bgSoft/70 rounded-t-6xl">
        <DrawerHeader className="flex items-center justify-between px-0 py-2">
          <div>
            <DrawerTitle className="text-2xl font-light">Update Workout</DrawerTitle>
            <DrawerDescription className="text-muted mt-1 text-base">
              Enter a new name and color for your workout
            </DrawerDescription>
          </div>

          <DrawerClose asChild>
            <button className="p-2 w-12 h-12 rounded-full bg-black/50 text-muted" onClick={onClose}>
              <X size={24} strokeWidth={1} className="m-auto" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        <ScrollArea className="h-full w-full">
          <div className="flex flex-col items-center w-full px-4 py-8 space-y-6">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="pl-4 py-3 rounded-[6px] bg-bgSoft placeholder:font-normal font-bold border-muted/25 max-w-[430px] w-full"
            />

            {/* Colors always shown */}
            <div className="w-full max-w-[430px] space-y-1">
              <label className="block font-medium text-base text-muted pl-3">Select Color</label>

              <div className="grid grid-cols-8 gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                      selectedColor === color ? 'border-primary' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorChange(color)}>
                    {selectedColor === color && <Check size={16} className="text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="w-full max-w-[430px] mx-auto mt-5">
          <Button
            variant="accent"
            className="w-full h-12 rounded-full text-lg font-normal bg-accent hover:bg-accent/90"
            onClick={onSubmit}
            disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Save'}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
