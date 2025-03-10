"use client";

import React, { useState, useEffect } from "react";
import { Button, Title, ScrollArea, SetControls } from "@/shared/components";
import { ChevronLeft, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { SetType } from "@/app/types/types";

interface Props {
  name: string;
  sets: SetType[];
  onClose: () => void;
  onSave: (updatedSets: SetType[]) => void;
}

export const EditExerciseModal: React.FC<Props> = ({ name, sets, onClose, onSave }) => {
  const [setSequence, setSetSequence] = useState<SetType[]>(structuredClone(sets));
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setHasChanges(JSON.stringify(setSequence) !== JSON.stringify(sets));
  }, [setSequence, sets]);

  const handleSave = () => {
    setIsSaving(true);
    const updatedSets = setSequence.map((set, index) => ({
      ...set,
      order: index + 1,
      subSets: set.type === "triset"
        ? set.subSets.map((subSet, subIndex) => ({
            ...subSet,
            order: subIndex + 1,
          }))
        : [],
    }));

    onSave(updatedSets);
    onClose();
  };

  return (
    <ScrollArea className="w-full h-full">
      <div className="flex flex-col items-center w-full h-full min-h-svh px-4 pt-24 pb-10 space-y-5 bg-bgPrimary">
        {/* Fixed header with buttons */}
        <div className="fixed top-0 left-0 w-full bg-bgBase px-6 py-4 flex justify-between items-center z-50">
          <Button
            className="text-white border-none bg-bgSoft h-12 w-12 p-2"
            onClick={onClose}
          >
            <ChevronLeft size={24} />
          </Button>
          {hasChanges && (
            <Button
              variant="accent"
              size="default"
              className="bg-green-500 h-12 px-6 text-lg font-bold relative overflow-hidden"
              onClick={handleSave}
              disabled={isSaving}
            >
              <span className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
                    style={{ opacity: isSaving ? 1 : 0 }}>
                {isSaving && (
                  <Loader className="h-5 w-5 text-white animate-spin" />
                )}
              </span>
              <span className={cn("transition-opacity duration-300", { "opacity-0": isSaving, "opacity-100": !isSaving })}>
                Save
              </span>
            </Button>
          )}
        </div>
        <div className="text-start w-full max-w-[430px]">
          <Title text={name} size="sm" className="font-bold" />
        </div>
        <SetControls sequence={setSequence} setSequence={setSetSequence} />
      </div>
    </ScrollArea>
  );
};
