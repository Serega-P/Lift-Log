"use client";

import React, { useState } from "react";
import { ExerciseType, SetType } from "@/app/types/types";
import { 
	Button, 
	Set, 
	TriSet, 
	Title, 
	EditExerciseModal, 
	Dialog, 
	DialogContent, 
	DialogTrigger, 
	DialogTitle,
	DialogDescription,
	ExerciseSettingsPopover
} from "@/shared/components";

interface Props {
  exercise: ExerciseType;
  onUpdate: (updatedExercise: ExerciseType) => void; // ✅ Передаём коллбэк
}

export function Exercise({ exercise, onUpdate }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [exerciseData, setExerciseData] = useState(exercise);
	const [done, setDone] =  useState(true)
  const [sets, setSets] = useState<SetType[]>(() => 
    exercise.setGroup?.flatMap((group) => group.sets)?.sort((a, b) => a.order - b.order) || []
  );
	// console.log("exerciseData:", exerciseData)
  const handleUpdateExercise = (updatedSets: SetType[]) => {
    const updatedExercise = {
      ...exerciseData,
      setGroup: exerciseData.setGroup.map((group) => ({
        ...group,
        sets: updatedSets,
      })),
    };

    setExerciseData(updatedExercise); // ✅ Обновляем локальный стейт
    setSets(updatedSets); // ✅ Обновляем `sets`
    onUpdate(updatedExercise); // ✅ Отправляем изменения вверх
    setIsOpen(false);
    setDone(false);
  };

  return (
    <div className={`${done ? "border-none" : "border-accent"} bg-bgBase rounded-[10px] text-primary mb-5 border-2 overflow-hidden`}>
      {/* Верхняя часть */}
      <div className="flex justify-between items-center pl-5  py-2.5 bg-bgSoft">
        <div className="flex items-center gap-2">
          <Title text={exerciseData.name} className="font-medium text-[20px]" />
        </div>
        <ExerciseSettingsPopover />
      </div>

      {/* Список сетов и трисетов */}
      <div className="p-3">
        {sets.map((set) => (
          <div key={set.order} className="py-1">
            {set.type === "set" && (
              <>
                <span className="font-normal text-sm text-muted pl-6">Set</span>
                <Set set={set} />
              </>
            )}

            {set.type === "triset" && (
              <>
                <span className="font-normal text-sm text-muted pl-6">Tri-set</span>
                <TriSet triSet={set} />
              </>
            )}
          </div>
        ))}

        {/* Кнопка открытия модального окна */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
         <DialogTrigger asChild>
           <Button className="mt-6 w-full font-bold uppercase text-base" variant="accent" onClick={() => setIsOpen(true)}>
             SET A NEW RECORD
           </Button>
         </DialogTrigger>
      
         <DialogContent className="custom-dialog w-full h-full min-h-svh max-w-none flex items-center justify-center border-none p-0" forceMount>
           <DialogTitle className="sr-only">Edit Exercise</DialogTitle>
           <DialogDescription className="sr-only">
             Here you can edit your exercise details and set a new record.
           </DialogDescription>
       
           <EditExerciseModal name={exerciseData.name} sets={sets} onClose={() => setIsOpen(false)} onSave={handleUpdateExercise} />
         </DialogContent>
       </Dialog>

      </div>
    </div>
  );
}
