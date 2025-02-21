"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/components/ui/popover";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const muscleGroups = [
  "Chest", "Back", "Shoulders", "Biceps", "Triceps",
  "Quadriceps", "Hamstrings", "Glutes", "Calves",
  "Abs", "Forearms", "Cardio", "Full Body"
];

interface Props {
  selectedGroups: string;
  toggleGroup: (group: string) => void;
}

export const MuscleGroupPopover: React.FC<Props> = ({ selectedGroups, toggleGroup }) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="w-full flex justify-between items-center px-6 py-4 text-lg rounded-[10px] bg-bgSurface text-primary font-bold focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          {selectedGroups ? selectedGroups : "Select muscle groups"}
          <ChevronDown size={20} className="text-accentSoft ml-2" />
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-[var(--radix-popper-anchor-width)] min-w-[300px] max-w-[430px] min-h-[346px] p-1 rounded-[10px] border-none bg-bgBase shadow-md max-h-60 overflow-y-auto">
        {muscleGroups.map((group) => (
          <button
            key={group}
            onClick={() => toggleGroup(group)}
            className={cn(
              "flex items-center justify-between border-b border-bgBase w-full px-4 py-3 text-lg font-medium hover:bg-bgMuted transition-all duration-150",
              selectedGroups.includes(group) ? "bg-bgMuted text-primary" : "text-muted"
            )}
          >
            {group}
            {selectedGroups.includes(group) && <Check size={20} className="ml-2 text-accentSoft" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
};

