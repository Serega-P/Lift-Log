'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  Button,
  ScrollArea,
  Title,
  SetControls,
} from '@/shared/components';
import { ArrowRight, Loader, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SetType } from '@/app/types/types';
import { motion, AnimatePresence } from 'framer-motion';

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

  const handleSave = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
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

    await onSave(updatedSets);

    initialSets.current = structuredClone(updatedSets);
    setIsSaving(false);
    setIsOpen(false);
  };

  const handleClose = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* ✅ КНОПКА ОТКРЫТИЯ */}
      <DialogTrigger asChild>
        <Button
          type="button"
          className="w-full font-normal uppercase text-base"
          variant="accent"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}>
          SET A NEW RECORD <ArrowRight size={20} />
        </Button>
      </DialogTrigger>

      {/* ✅ FULLSCREEN CONTENT — внутри Dialog */}
      <DialogContent
        forceMount
        className="fixed inset-0 z-50 h-screen w-screen max-w-[480px] mx-auto p-5 pb-0 pt-2 bg-bgBase border border-bgSoft/70 rounded-t-6xl shadow-xxl flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}>
        {/* Анимация выезда снизу */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="h-full flex flex-col">
              {/* HEADER */}
              <div className="flex px-0 py-2 justify-between items-center">
                <button
                  type="button"
                  className="p-2 w-12 h-12 rounded-full bg-black/50 text-muted"
                  onClick={handleClose}>
                  <X size={24} strokeWidth={1} className="m-auto" />
                </button>

                {hasChanges && (
                  <Button
                    type="button"
                    variant="accent"
                    className="rounded-full h-12 text-lg font-normal relative overflow-hidden hover:bg-accent"
                    onClick={handleSave}
                    disabled={isSaving}>
                    <span
                      className="absolute inset-0 flex items-center justify-center bg-accent/50"
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

              {/* SCROLLABLE CONTENT */}
              <ScrollArea className="w-full flex-1 overflow-y-auto touch-pan-y overscroll-contain">
                <div className="flex flex-col items-center w-full h-full px-4 py-10 space-y-5 pb-[300px]">
                  <div className="text-start w-full max-w-[430px]">
                    <Title text={name} size="xl" className="font-light" />
                  </div>

                  <SetControls sequence={setSequence} setSequence={setSetSequence} />
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default SetNewRecordDrawer;
