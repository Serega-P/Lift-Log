'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  Button,
  ScrollArea,
  Title,
  SetControls,
} from '@/shared/components';
import { ArrowRight, Loader, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetType } from '@/app/types/types';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface Props {
  name: string | undefined;
  sets: SetType[];
  onSave: (updatedSets: SetType[]) => void;
}

export const SetNewRecordDrawer: React.FC<Props> = ({ name, sets, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [setSequence, setSetSequence] = useState<SetType[]>(structuredClone(sets));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialSets = useRef<SetType[]>(structuredClone(sets));

  useEffect(() => {
    const isDifferent = JSON.stringify(setSequence) !== JSON.stringify(initialSets.current);
    setHasChanges(isDifferent);
  }, [setSequence]);

  const handleSave = () => {
    setIsSaving(true);

    const updatedSets = setSequence.map((set, index) => ({
      ...set,
      order: index + 1,

      dropSets:
        set.dropSets?.map((drop, dropIndex) => ({
          ...drop,
          order: dropIndex + 1,
        })) || [],
    }));

    onSave(updatedSets);

    initialSets.current = structuredClone(updatedSets);

    setIsSaving(false);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button
          className="w-full font-normal uppercase text-base"
          variant="accent"
          onClick={() => setIsOpen(true)}>
          SET A NEW RECORD <ArrowRight size={20} />
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-h-screen m-auto max-w-[480px] p-5 pb-0 pt-2 bg-bgBase border border-bgSoft/70 rounded-t-6xl flex flex-col">
        <DrawerHeader className="flex px-0 py-2 justify-between items-center">
          <VisuallyHidden>
            <DrawerTitle>Hidden title for screen readers</DrawerTitle>
            <DrawerDescription>Hidden title for screen readers</DrawerDescription>
          </VisuallyHidden>
          <DrawerClose asChild>
            <button
              className="p-2 w-12 h-12 rounded-full bg-black/50 text-muted"
              onClick={handleClose}>
              <X size={24} strokeWidth={1} className="m-auto" />
            </button>
          </DrawerClose>
          {hasChanges && (
            <Button
              variant="accent"
              size="default"
              className="bg-none rounded-full h-12 text-lg font-normal relative overflow-hidden hover:bg-accent"
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
        </DrawerHeader>
        <ScrollArea className="w-full flex-1">
          <div className="flex flex-col items-center w-full min-h-[50vh] px-4 py-10 space-y-5">
            <div className="text-start w-full max-w-[430px]">
              <Title text={name} size="xl" className="font-light" />
            </div>

            <SetControls sequence={setSequence} setSequence={setSetSequence} />
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
};

export default SetNewRecordDrawer;
