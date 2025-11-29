'use client';

import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  Button,
} from '@/shared/components';
import { X, Loader } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onCreateNew: () => void;
}

export function WorkoutSaveDrawer({ isOpen, isSaving, onClose, onUpdate, onCreateNew }: Props) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className="
          xed bottom-0 left-0 right-0
      max-w-[720px] w-full
      h-[35vh]
      m-auto
      p-6
      bg-bgBase
      border border-bgSoft/70
      rounded-t-6xl
      flex flex-col
        ">
        {/* Overlay spinner */}
        {isSaving && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-t-3xl">
            <Loader size={42} className="text-white animate-spin" />
          </div>
        )}

        {/* Header */}
        <DrawerHeader className="flex justify-between items-start px-0 pb-3">
          <div>
            <DrawerTitle className="text-2xl font-light">
              You already have a workout for today!
            </DrawerTitle>
            <DrawerDescription className="text-muted mt-1 text-base">
              Do you want to update your results or save as a new one?
            </DrawerDescription>
          </div>

          {/* X Button */}
          <DrawerClose asChild>
            <button
              className="p-2 w-10 h-10 rounded-full bg-black/40 text-muted hover:bg-black/60"
              onClick={onClose}>
              <X size={22} strokeWidth={1} className="m-auto" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Buttons at bottom */}
        <div className="mt-auto flex flex-col w-full gap-3">
          <Button
            variant="accent"
            className="w-full text-lg py-3 rounded-xl"
            onClick={onUpdate}
            disabled={isSaving}>
            Refresh
          </Button>
          <Button
            variant="accent"
            className="w-full text-lg py-3 rounded-xl"
            onClick={onCreateNew}
            disabled={isSaving}>
            Add a new one
          </Button>
        </div>

        {/* Optional: extra Cancel button if needed at bottom */}
        {/* <div className="mt-3 w-full">
          <Button variant="secondary" onClick={onClose} disabled={isSaving} className="w-full">
            Cancel
          </Button>
        </div> */}
      </DrawerContent>
    </Drawer>
  );
}
