"use client";

import React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/shared/components/ui/popover";

export function PopoverMenu({ children, options }: { children: React.ReactNode; options: { label: string; action: () => void }[] }) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col space-y-2">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={option.action}
              className="text-left px-4 py-2 hover:bg-gray-200 rounded"
            >
              {option.label}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
