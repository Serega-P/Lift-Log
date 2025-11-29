'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Button,
} from '@/shared/components';
import { Loader } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isDeleting: boolean | undefined;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function ConfirmDeleteDrawer({ isOpen, onClose, onConfirmDelete, isDeleting }: Props) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent
        className="
      ixed bottom-0 left-0 right-0
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
        {isDeleting && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-20 flex items-center justify-center rounded-t-3xl">
            <Loader size={42} className="text-white animate-spin" />
          </div>
        )}

        {/* Header */}
        <DrawerHeader className="px-0 pb-3 flex items-center justify-between">
          <div>
            <DrawerTitle className="text-2xl font-light">Are you sure?</DrawerTitle>
            <DrawerDescription className="text-base text-muted">
              This action cannot be undone. It will permanently delete your workout.
            </DrawerDescription>
          </div>
        </DrawerHeader>

        {/* Bottom Buttons */}
        <div className="mt-auto pt-6 flex flex-col w-full gap-4">
          <Button
            variant="destructive"
            className="w-full text-lg py-8 rounded-full bg-red-500 hover:bg-red-400"
            onClick={onConfirmDelete}
            disabled={isDeleting}>
            Delete
          </Button>

          <Button
            variant="secondary"
            className="w-full text-lg py-8 rounded-full"
            onClick={onClose}
            disabled={isDeleting}>
            Cancel
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
