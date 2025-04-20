'use client';

import React, { useState, useEffect } from 'react';
import { Button, Title, ScrollArea, SetControls } from '@/shared/components';
import { ArrowLeft, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetType } from '@/app/types/types';

interface Props {
  name: string | undefined;
  sets: SetType[];
  onClose: () => void;
  onSave: (updatedSets: SetType[]) => void;
}

export const EditExerciseModal: React.FC<Props> = ({ name, sets, onClose, onSave }) => {
  const [setSequence, setSetSequence] = useState<SetType[]>(structuredClone(sets));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Сохраняем исходное состояние для сравнения
  const initialSets = React.useRef<SetType[]>(structuredClone(sets));

  useEffect(() => {
    // Сравниваем текущее состояние с исходным
    const isDifferent = JSON.stringify(setSequence) !== JSON.stringify(initialSets.current);
    setHasChanges(isDifferent);
  }, [setSequence]);

  const handleSave = () => {
    setIsSaving(true);
    const updatedSets = setSequence.map((set, index) => ({
      ...set,
      order: index + 1,
      subSets:
        set.type === 'triset'
          ? set.subSets?.map((subSet, subIndex) => ({
              ...subSet,
              order: subIndex + 1,
            })) || []
          : [],
    }));

    onSave(updatedSets);
    initialSets.current = structuredClone(updatedSets); // Обновляем исходное состояние после сохранения
    setIsSaving(false);
    onClose();
  };

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col items-center w-full h-full min-h-svh px-4 pt-24 pb-10 space-y-5 bg-black">
        {/* Fixed header with buttons */}
        <div className="fixed top-0 left-0 w-full bg-black flex justify-center items-center z-50">
          <div className="w-full max-w-[430px] px-5 py-2 flex justify-between items-center">
            <Button className="text-muted border-none h-12 w-12 p-2" onClick={onClose}>
              <ArrowLeft size={24} strokeWidth={3} />
            </Button>
            {hasChanges && (
              <Button
                variant="accent"
                size="default"
                className="bg-none h-12 text-lg font-normal relative overflow-hidden hover:bg-accent"
                onClick={handleSave}
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
        <div className="text-start w-full max-w-[430px]">
          <Title text={name} size="sm" className="font-normal" />
        </div>
        <SetControls sequence={setSequence} setSequence={setSetSequence} />
      </div>
    </ScrollArea>
  );
};
