'use client';

import { Popover, PopoverContent, PopoverTrigger, Button } from '@/shared/components';
import { Ellipsis, Settings2, Trash2, SquarePen, Plus } from 'lucide-react';
import { useState } from 'react';

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
          className="h-9 w-9 p-2 bg-bgBase text-muted rounded-full hover:bg-bgMuted">
          <Ellipsis size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto min-w-[200px] p-0 mr-5 bg-bgBase rounded-2xl border-muted/25 shadow-xxl">
        <div className="flex flex-col">
          <button
            className="flex items-center px-5 py-3 rounded-md text-white hover:bg-bgMuted transition w-full border-b border-muted/25"
            onClick={() => {
              onAddExercise();
            }}>
            <Plus size={18} className="mr-4" /> Add exercise
          </button>
          <button
            className="flex items-center px-5 py-3 rounded-md text-white hover:bg-bgMuted transition w-full border-b border-muted/25"
            onClick={() => {
              onCreateExercise();
            }}>
            <SquarePen size={18} className="mr-4" /> Create exercise
          </button>
          <button
            className="flex items-center px-5 py-3 rounded-md text-white hover:bg-bgMuted transition w-full border-b border-muted/25"
            onClick={() => {
              // setIsPopoverOpen(false); // Закрываем Popover
              onRename();
            }}>
            <Settings2 size={18} className="mr-4" /> Edit
          </button>
          <button
            className="flex items-center px-5 py-3 rounded-md text-red-500 hover:bg-red-500/10 transition"
            onClick={() => {
              setIsPopoverOpen(false); // Закрываем Popover перед AlertDialog
              onDelete();
            }}>
            <Trash2 size={18} className="mr-4" /> Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
