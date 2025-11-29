'use client';

import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@/shared/components';
import { Settings2, Edit, Trash2 } from 'lucide-react';

interface Props {
  onDelete: () => void;
  onRename: () => void;
}

export function ExerciseSettingsPopover({ onDelete, onRename }: Props) {
  const [open, setOpen] = useState(false);

  const handleRename = () => {
    onRename();
    setOpen(false); // <-- закрыть
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false); // <-- закрыть
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="icons" className="text-muted bg-none hover:text-muted">
          <Settings2 size={24} />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto min-w-[200px] p-0 mr-7 bg-bgSoft rounded-2xl border-muted/25 shadow-xxl">
        <div className="flex flex-col">
          <button
            className="flex items-center px-5 py-3 rounded-none text-white hover:bg-bgMuted transition w-full border-b border-muted/25"
            onClick={handleRename}>
            <Edit size={18} className="mr-4" /> Rename
          </button>

          <button
            className="flex items-center px-5 py-3 rounded-none text-red-500 hover:bg-red-500/10 transition"
            onClick={handleDelete}>
            <Trash2 size={18} className="mr-4" /> Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
