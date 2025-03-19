'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button, WorkoutSettingsPopover, ModalForm } from '@/shared/components';

interface WorkoutHeaderProps {
  workoutTitle: string;
  isChanged: boolean;
  isSaving: boolean;
  onSave: () => void;
  onRename: (newTitle: string) => void;
}

export function WorkoutHeader({
  workoutTitle,
  isChanged,
  isSaving,
  onSave,
  onRename,
}: WorkoutHeaderProps) {
  const router = useRouter();
  const [isRenameWorkoutModalOpen, setIsRenameWorkoutModalOpen] = React.useState(false);
  const [newWorkoutTitle, setNewWorkoutTitle] = React.useState(workoutTitle);

  const handleRenameWorkout = () => {
    onRename(newWorkoutTitle);
    setIsRenameWorkoutModalOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-bgBase px-6 py-4 flex justify-between items-center z-50">
      <Button
        className="text-white border-none bg-bgSoft h-12 w-12 p-2"
        onClick={() => router.back()}>
        <ChevronLeft size={24} />
      </Button>
      <div className="flex items-center space-x-4">
        <WorkoutSettingsPopover onRename={() => setIsRenameWorkoutModalOpen(true)} />
        <ModalForm
          isOpen={isRenameWorkoutModalOpen}
          onClose={() => setIsRenameWorkoutModalOpen(false)}
          title="Rename Workout"
          description="Enter a new name for your workout"
          inputPlaceholder={workoutTitle}
          inputValue={newWorkoutTitle}
          onInputChange={setNewWorkoutTitle}
          onSubmit={handleRenameWorkout}
        />
        {isChanged && (
          <Button
            variant="accent"
            size="default"
            className="bg-green-500 h-12 px-6 text-lg font-normal relative overflow-hidden hover:bg-green-400"
            onClick={onSave}
            disabled={isSaving}>
            <span
              className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
              style={{ opacity: isSaving ? 1 : 0 }}>
              {isSaving && <Loader className="h-5 w-5 text-white animate-spin" />}
            </span>
            <span
              className={cn('transition-opacity duration-300', {
                'opacity-0': isSaving,
                'opacity-100': !isSaving,
              })}>
              Save
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}
