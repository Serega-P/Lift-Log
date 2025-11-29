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

interface Props {
  isOpen: boolean;
  loading: boolean;
  onClose: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  inputPlaceholder: string | undefined;
}

export const RenameExerciseDrawer: React.FC<Props> = ({
  isOpen,
  loading,
  onClose,
  onInputChange,
  onSubmit,
  inputValue,
  inputPlaceholder,
}) => {
  useEffect(() => {
    if (!isOpen) {
      onInputChange('');
    }
  }, [isOpen, onInputChange]);

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
                    ${inputValue === '' ? 'opacity-40 pointer-events-none' : 'hover:bg-accent'}
            `}
            onClick={onSubmit}
            disabled={inputValue.trim() === '' || loading}>
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
            <DrawerTitle className="text-2xl font-light">Rename Exercise</DrawerTitle>
            <DrawerDescription className="text-muted mt-1 text-base">
              Add a new exercise name
            </DrawerDescription>
          </div>
          <div className="flex flex-col items-center w-full px-4 py-8 space-y-6">
            <Input
              value={inputValue}
              onChange={(e) => onInputChange(e.target.value)}
              placeholder={inputPlaceholder}
              className="pl-4 py-3 rounded-[6px] bg-bgSoft placeholder:font-normal font-bold border-muted/25 max-w-[430px] w-full"
            />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};
