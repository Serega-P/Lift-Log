"use client";

import React, { useState } from "react";
import { Button, Title, ScrollArea, SetControls } from "@/components/shared/components";
import { SetType } from "@/app/types/types";

interface Props {
  name: string;
  sets: SetType[];
  onClose: () => void;
  onSave: (updatedSets: SetType[]) => void;
}

export const EditExerciseModal: React.FC<Props> = ({ name, sets, onClose, onSave }) => {
  // Копируем массив сетов, чтобы избежать мутации пропсов
  const [setSequence, setSetSequence] = useState<SetType[]>(structuredClone(sets));

  const handleSave = () => {
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
      <div className="flex flex-col items-start w-full h-full min-h-svh px-6 pt-20 pb-10 space-y-7 bg-bgBase">
        <div className="flex flex-col items-start pb-2 border-b border-gray-700 w-full">
          <Button variant="link" className="text-accentSoft text-base font-bold px-0 mb-7" onClick={onClose}>
            Cancel
          </Button>
          <Title text={name} size="lg" className="font-bold pb-2" />
        </div>

        <SetControls sequence={setSequence} setSequence={setSetSequence} />

        <Button variant="accent" size="accent" className="w-full text-lg font-bold mt-10" onClick={handleSave}>
          Save results
        </Button>
      </div>
    </ScrollArea>
  );
};
