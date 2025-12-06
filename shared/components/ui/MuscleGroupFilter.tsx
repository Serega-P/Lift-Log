'use client';

import { useState } from 'react';
import { Popover, PopoverTrigger, PopoverContent, Button } from '@/shared/components';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronsUpDown } from 'lucide-react';

const MUSCLE_GROUPS = ['All', 'chest', 'back', 'legs', 'arms', 'shoulders', 'core'];

export function MuscleGroupFilter({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="px-4 py-2 flex items-center gap-2 text-lg bg-black/50 border-muted/10 text-muted rounded-full hover:bg-black/10 hover:text-muted/40">
          {value}
          <ChevronsUpDown size={18} />
        </Button>
      </PopoverTrigger>

      <AnimatePresence>
        {open && (
          <PopoverContent forceMount asChild className="rounded-3xl overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.1 }}
              className="w-auto min-w-[240px] p-0 mr-6 rounded-3xl bg-bgSoft/30 border-muted/10 shadow-xxl backdrop-blur-lg overflow-hidden"
              style={{
                transformOrigin: 'top right',
                pointerEvents: 'auto',
                touchAction: 'auto',
                willChange: 'transform, opacity',
                zIndex: 9999,
              }}>
              <div className="flex flex-col">
                {MUSCLE_GROUPS.map((group) => (
                  <button
                    key={group}
                    className={`flex items-center px-4 py-3.5 rounded-full text-white transition w-full hover:bg-bgMuted`}
                    onClick={() => {
                      onChange(group);
                      setOpen(false);
                    }}>
                    <span className="mr-4 capitalize">{group}</span>
                    {value === group && <Check size={20} strokeWidth={2} />}
                  </button>
                ))}
              </div>
            </motion.div>
          </PopoverContent>
        )}
      </AnimatePresence>
    </Popover>
  );
}
