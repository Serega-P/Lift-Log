"use client";

import React, { useState } from "react";
import { Dumbbell, Settings2 } from "lucide-react";
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
} from "@/components/shared/components";

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
    <div className={`${done ? "border-none" : "border-accentSoft"} bg-bgBase rounded-[20px] text-primary mb-5 border-2`}>
      {/* Верхняя часть */}
      <div className="flex justify-between items-center border-b border-customBorder p-5">
        <div className="flex items-center gap-2">
          <Dumbbell size={26} className="text-accentSoft" />
          <Title text={exerciseData.name} size="sm" className="font-bold" />
        </div>
        <button className="text-muted">
          <Settings2 size={26} />
        </button>
      </div>

      {/* Список сетов и трисетов */}
      <div className="px-12 pb-5">
        {sets.map((set) => (
          <div key={set.order} className="py-2">
            {set.type === "set" && (
              <>
                <span className="font-base pb-2 text-muted">Set</span>
                <Set set={set} />
              </>
            )}

            {set.type === "triset" && (
              <>
                <span className="font-base pb-2 text-muted">Tri-set</span>
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
       
         {/* Оставляем только контент, без крестика */}
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
