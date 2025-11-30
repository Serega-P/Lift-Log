'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@/shared/components';
import { Settings2, Edit, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onDelete: () => void;
  onRename: () => void;
}

export function ExerciseSettingsPopover({ onDelete, onRename }: Props) {
  const [open, setOpen] = useState(false);

  const handleRename = () => {
    onRename();
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="icons" className="text-muted hover:text-muted/40">
          <Settings2 size={24} />
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {open && (
          <PopoverContent forceMount asChild className="rounded-3xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className="w-auto min-w-[240px] p-0 mr-7 rounded-3xl bg-bgSoft/30 border border-muted/10 shadow-xxl backdrop-blur-lg overflow-hidden"
              style={{
                transformOrigin: 'top right',
                pointerEvents: 'auto',
                touchAction: 'auto',
                willChange: 'transform, opacity',
                zIndex: 9999,
              }}>
              <div className="flex flex-col">
                <button
                  className="flex items-center px-5 py-3 rounded-full text-white hover:bg-bgMuted transition w-full"
                  onClick={handleRename}>
                  <Edit size={20} strokeWidth={2} className="mr-4" /> Rename
                </button>

                <button
                  className="flex items-center px-5 py-3 rounded-full text-red-500 hover:bg-red-500/10 transition w-full"
                  onClick={handleDelete}>
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

export default ExerciseSettingsPopover;
