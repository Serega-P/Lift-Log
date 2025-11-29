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

  const handleDropset = (e: React.MouseEvent) => {
    e.stopPropagation(); // предотвращаем проскакивание клика
    try {
      onAddDropSet?.(order);
    } catch (err) {
      console.error('onAddDropSet error', err);
    }
    setOpen(false);
  };

  const handleCopyPaste = (e: React.MouseEvent) => {
    e.stopPropagation(); // предотвращаем проскакивание клика
    try {
      onCopyPaste?.();
    } catch (err) {
      console.error('onCopyPaste error', err);
    }
    setOpen(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // предотвращаем проскакивание клика
    try {
      onDelete(order);
    } catch (err) {
      console.error('onDelete error', err);
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="icons"
          className="text-muted bg-none hover:text-muted"
          aria-label="Open set settings">
          <Ellipsis size={24} />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto min-w-[200px] p-0 mr-7 bg-bgSoft rounded-2xl border-muted/25 shadow-xxl"
        style={{ pointerEvents: 'auto' }} // явно включаем обработку кликов
      >
        <div className="flex flex-col">
          <button
            type="button"
            className="flex items-center px-5 py-3 rounded-none text-white hover:bg-bgMuted transition w-full border-b border-muted/25"
            onClick={handleDropset}>
            <ArrowDownRight size={24} className="mr-4" /> Dropset
          </button>

          <button
            type="button"
            className="flex items-center px-5 py-3 rounded-none text-white hover:bg-bgMuted transition w-full border-b border-muted/25"
            onClick={handleCopyPaste}>
            <Copy size={22} className="mr-4" /> Copy + paste
          </button>

          <button
            type="button"
            className="flex items-center px-5 py-3 rounded-none text-red-500 hover:bg-red-500/10 transition"
            onClick={handleDelete}>
            <Trash2 size={22} className="mr-4" /> Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default SetSettingsPopover;
