import React from "react";
import {Skeleton } from "@/shared/components";
import { SetType, SubSetType } from "@/app/types/types";


export function Set({ set }: { set: SetType | SubSetType }) {
  if (!set) {
		return <Skeleton className="w-full h-8 mb-4"/>
  }


  return (
    <div className="flex w-full border-b border-dashed border-muted/50">
  {/* Блок веса (40%) */}
  <div className="flex items-center w-[40%] justify-start pl-6">
    <p className="font-bold mr-2 text-xl">{set?.weight ?? "—"}</p>
    <p className="font-bold">kg</p>
  </div>

  {/* Разделитель (20%) */}
  <div className="flex items-center w-[20%] justify-start">
    <p className="text-muted">x</p>
  </div>

  {/* Блок повторений (40%) */}
  <div className="flex items-center w-[40%] justify-start">
    <p className="font-bold mr-2 text-xl">{set?.reps ?? "—"}</p>
    <p className="font-bold">Reps</p>
  </div>
</div>

  );
}
