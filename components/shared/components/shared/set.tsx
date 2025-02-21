import React from "react";
import {Skeleton } from "@/components/shared/components";
import { SetType } from "@/app/types/types";


export function Set({ set }: { set: SetType }) {
  if (!set) {
		return <Skeleton className="w-full h-8 mb-4"/>
  }


  return (
    <div className="flex justify-start items-center border-b border-dashed border-customBorder">
      {/* Блок веса */}
      <div className="flex items-center">
        <p className="font-bold mr-2 text-2xl">{set?.weight ?? "—"}</p>
        <p className="font-bold">kg</p>
      </div>

      {/* Разделитель */}
      <div className="flex items-center">
        <p className="text-muted mx-8">x</p>
      </div>

      {/* Блок повторений */}
      <div className="flex items-center">
        <p className="font-bold mr-2 text-2xl">{set?.reps ?? "—"}</p>
        <p className="font-bold">Reps</p>
      </div>
    </div>
  );
}
