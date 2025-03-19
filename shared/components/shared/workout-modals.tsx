'use client';

import React from 'react';
import { WorkoutSaveModal } from '@/shared/components';

interface WorkoutModalsProps {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onCreateNew: () => void;
}

export function WorkoutModals({
  isOpen,
  isSaving,
  onClose,
  onUpdate,
  onCreateNew,
}: WorkoutModalsProps) {
  return (
    <WorkoutSaveModal
      isOpen={isOpen}
      onClose={onClose}
      isSaving={isSaving}
      onUpdate={onUpdate}
      onCreateNew={onCreateNew}
    />
  );
}
