'use client';

import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger, Button } from '@/shared/components';
import { Ellipsis, Copy, ArrowDownRight, Trash2 } from 'lucide-react';

interface Props {
  onAddDropSet: (id: number) => void;
  onCopyPaste?: () => void;
  onDelete: (id: number) => void;
  order: number;
}

export function SetSettingsPopover({ onAddDropSet, onCopyPaste, onDelete, order }: Props) {
  const [open, setOpen] = useState(false);

  const handleDropset = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault(); // 🔥 важно для iOS
    onAddDropSet(order);
    setOpen(false);
  };

  const handleCopyPaste = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onCopyPaste?.();
    setOpen(false);
  };

  const handleDelete = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onDelete(order);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="icons"
          className="text-muted bg-none hover:text-muted hover:bg-bgPrimary"
          aria-label="Open set settings"
          onTouchStart={(e) => e.preventDefault()} // 🔥 помогает ловить tap
        >
          <Ellipsis size={24} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto min-w-[200px] p-0 mr-7 bg-bgSoft rounded-2xl border-muted/25 shadow-xxl"
        sideOffset={8} // 🔥 добавили
        align="end" // 🔥 позиция для телефона
        style={{ pointerEvents: 'auto', touchAction: 'auto' }} // 🔥 добавили touchAction
      >
        <div className="flex flex-col">
          <button
            type="button"
            className="flex items-center px-5 py-3 text-white hover:bg-bgMuted w-full border-b border-muted/25"
            onClick={handleDropset}
            onTouchEnd={handleDropset} // 🔥 ловим касание
          >
            <ArrowDownRight size={24} className="mr-4" /> Dropset
          </button>

          <button
            type="button"
            className="flex items-center px-5 py-3 text-white hover:bg-bgMuted w-full border-b border-muted/25"
            onClick={handleCopyPaste}
            onTouchEnd={handleCopyPaste}>
            <Copy size={22} className="mr-4" /> Copy + paste
          </button>

          <button
            type="button"
            className="flex items-center px-5 py-3 text-red-500 hover:bg-red-500/10 w-full"
            onClick={handleDelete}
            onTouchEnd={handleDelete}>
            <Trash2 size={22} className="mr-4" /> Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SetSettingsPopover;
