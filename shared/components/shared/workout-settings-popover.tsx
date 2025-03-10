"use client";

import { Popover, PopoverContent, PopoverTrigger, Button } from "@/shared/components";
import { Settings, Edit, Trash2 } from "lucide-react";

export function WorkoutSettingsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="h-12 w-12 p-2 bg-bgSoft text-muted hover:bg-bgMuted"
        >
          <Settings size={24} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-40 p-2 bg-bgSoft rounded-[10px] border-muted/25 shadow-xxl">
        <div className="flex flex-col">
          <button
            className="flex items-center px-3 py-2 rounded-md text-white hover:bg-bgMuted transition"
            onClick={() => console.log("Rename clicked")}
          >
            <Edit size={18} className="mr-2" /> Rename
          </button>
          <button
            className="flex items-center px-3 py-2 rounded-md text-red-500 hover:bg-red-500/10 transition"
            onClick={() => console.log("Delete clicked")}
          >
            <Trash2 size={18} className="mr-2" /> Delete
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
