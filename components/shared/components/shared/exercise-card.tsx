"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";
import { PopoverMenu } from "./popover-menu";

export function ExerciseCard({ exercise }: { exercise: any }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-white font-bold">{exercise.name}</h3>
        <PopoverMenu options={[{ label: "Edit", action: () => {} }, { label: "Delete", action: () => {} }]}>
          <MoreHorizontal className="text-gray-400 hover:text-white" />
        </PopoverMenu>
      </div>

      <div className="mt-2 space-y-2">
        {exercise.sets.map((set: any, index: number) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-400">Set {index + 1}</span>
            <span className="text-white">{set.weight}kg x {set.reps} reps</span>
          </div>
        ))}
      </div>

      <button className="mt-4 w-full bg-green-500 text-white py-2 rounded-lg">Set a New Record</button>
    </div>
  );
}

