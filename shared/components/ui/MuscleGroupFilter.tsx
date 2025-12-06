'use client';

import { useState } from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="relative select-none">
      {/* TRIGGER */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="px-4 py-2 flex items-center gap-2 text-lg bg-black/50 border-muted/10 text-muted rounded-full hover:bg-black/20">
        {value}
        <ChevronsUpDown size={18} />
      </button>

      {/* DROPDOWN */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -6 }}
            transition={{ duration: 0.12 }}
            className="
              absolute right-0 mt-2 w-56 rounded-3xl
              bg-bgSoft/30 border border-muted/10 
              shadow-xxl backdrop-blur-xl overflow-hidden
              z-[9999]
            ">
            <div className="flex flex-col py-1">
              {MUSCLE_GROUPS.map((group) => (
                <label
                  key={group}
                  className="
                    flex items-center px-4 py-3 text-white rounded-full
                    hover:bg-bgMuted active:bg-bgMuted/60 transition
                  ">
                  <input
                    type="checkbox"
                    checked={value === group}
                    onChange={() => {
                      onChange(group);
                      setOpen(false);
                    }}
                    className="hidden"
                  />
                  <span className="mr-auto capitalize">{group}</span>
                  {value === group && <Check size={20} strokeWidth={2} />}
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
