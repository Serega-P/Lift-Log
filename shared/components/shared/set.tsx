'use client';

import React from 'react';
import { Skeleton } from '@/shared/components';
import { SetType } from '@/app/types/types';
import { ArrowDownRight } from 'lucide-react';

export function Set({ set }: { set: SetType }) {
  if (!set) {
    return <Skeleton className="w-full h-8 mb-4" />;
  }

  return (
    <div className="w-full border-b border-dashed border-muted/25">
      {/* MAIN SET */}
      <div className="flex w-full text-muted">
        {/* НОМЕР СЕТА */}
        <div className="flex items-center w-[15%] justify-start h-10 pl-4">
          <p className="font-normal text-sm text-muted/50">{set.order ?? ''}</p>
        </div>

        {/* WEIGHT */}
        <div className="flex items-center w-[30%] justify-start h-10 pl-2">
          <p className="font-normal mr-1 text-xl">{set.weight ?? '—'}</p>
          <p className="font-normal text-sm">kg</p>
        </div>

        <div className="flex items-center w-[10%] justify-start h-10" />

        {/* REPS */}
        <div className="flex items-center w-[30%] justify-start h-10">
          <p className="font-normal mr-1 text-xl">{set.reps ?? '—'}</p>
          <p className="font-normal text-sm">Reps</p>
        </div>
      </div>

      {/* DROPSETS */}
      {set.dropSets?.length > 0 &&
        set.dropSets.map((drop) => (
          <div key={drop.id} className="flex w-full text-muted pl-10">
            {/* ICON */}
            <div className="flex items-center w-[15%] justify-start h-8 pl-4">
              <ArrowDownRight className="w-4 h-4 text-muted/50" />
            </div>

            {/* WEIGHT */}
            <div className="flex items-center w-[30%] justify-start h-8 pl-2">
              <p className="font-normal mr-1 text-base">{drop.weight ?? '—'}</p>
              <p className="font-normal text-sm">kg</p>
            </div>

            <div className="flex items-center w-[5%] justify-start h-8" />

            {/* REPS */}
            <div className="flex items-center w-[30%] justify-start h-8">
              <p className="font-normal mr-1 text-base">{drop.reps ?? '—'}</p>
              <p className="font-normal text-sm">Reps</p>
            </div>
          </div>
        ))}
    </div>
  );
}
