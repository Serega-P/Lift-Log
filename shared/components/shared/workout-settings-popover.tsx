'use client';

import { Popover, PopoverContent, PopoverTrigger, Button } from '@/shared/components';
import { Ellipsis, Settings2, Trash2, ListPlus, CirclePlus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  workoutId: number | string;
  onRename: () => void;
  onDelete: () => void;
  onCreateExercise: () => void;
  onAddExercise: () => void;
}

export function WorkoutSettingsPopover({
  onRename,
  onDelete,
  onCreateExercise,
  onAddExercise,
}: Props) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-6 bg-bgSoft/30 border-muted/10 backdrop-blur-xl text-muted rounded-full hover:bg-bgBase/40 hover:text-muted/40">
          <Ellipsis size={24} />
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {isPopoverOpen && (
          <PopoverContent forceMount asChild className="rounded-3xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-auto min-w-[240px] p-0 mr-6 rounded-3xl bg-bgSoft/30 border-muted/10 shadow-xxl backdrop-blur-lg overflow-hidden"
              style={{
                transformOrigin: 'top right',
                pointerEvents: 'auto',
                touchAction: 'auto',
                willChange: 'transform, opacity',
                zIndex: 9999,
              }}>
              <div className="flex flex-col">
                <button
                  className="flex items-center px-4 py-3.5 rounded-full text-white hover:bg-bgMuted transition w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopoverOpen(false);
                    onAddExercise();
                  }}>
                  <ListPlus size={20} strokeWidth={2} className="mr-4" /> Add exercise
                </button>

                <button
                  className="flex items-center px-4 py-3.5 rounded-full text-white hover:bg-bgMuted transition w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopoverOpen(false);
                    onCreateExercise();
                  }}>
                  <CirclePlus size={20} strokeWidth={2} className="mr-4" /> Create exercise
                </button>

                <button
                  className="flex items-center px-4 py-3.5 rounded-full text-white hover:bg-bgMuted transition w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopoverOpen(false);
                    onRename();
                  }}>
                  <Settings2 size={20} strokeWidth={2} className="mr-4" /> Edit
                </button>

                <button
                  className="flex items-center px-4 py-3.5 rounded-full text-red-500 hover:bg-red-500/10 transition w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPopoverOpen(false);
                    onDelete();
                  }}>
                  <Trash2 size={20} strokeWidth={2} className="mr-4" /> Delete
                </button>
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}

export default WorkoutSettingsPopover;
