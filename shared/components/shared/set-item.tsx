'use client';

import React, { useState, useEffect } from 'react';
import { SetType } from '@/app/types/types';
import { Input, DropSetRow, SetSettingsPopover } from '@/shared/components';

interface Props {
  data: SetType;
  onUpdate: (updatedSet: SetType) => void;
  onDelete: (id: number) => void;
  onAddDropSet: (id: number) => void;
  onDeleteDropSet: (setId: number, dropSetId: number) => void;
}

export const SetItem: React.FC<Props> = ({
  data,
  onUpdate,
  onDelete,
  onAddDropSet,
  onDeleteDropSet,
}) => {
  const [touched, setTouched] = useState({
    weight: false,
    reps: false,
  });

  const [weight, setWeight] = useState<string>('');
  const [reps, setReps] = useState<string>('');

  useEffect(() => {
    if (!touched.weight) setWeight('');
    if (!touched.reps) setReps('');
  }, [data]);

  const update = (field: 'weight' | 'reps', val: string) => {
    const num = val === '' ? '' : Number(val);

    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'weight') setWeight(val);
    if (field === 'reps') setReps(val);

    onUpdate({
      ...data,
      [field]: val === '' ? null : num,
    });
  };

  // Independent activation per input
  const weightActive = touched.weight && weight.trim() !== '';
  const repsActive = touched.reps && reps.trim() !== '';

  // Independent classes
  const weightClass = weightActive ? 'border-accent text-primary' : 'border-muted text-muted';

  const repsClass = repsActive ? 'border-accent text-primary' : 'border-muted text-muted';

  return (
    <div className="w-full bg-bgMuted rounded-2xl text-primary mb-4 overflow-hidden">
      <div className="flex items-center w-full py-4 pr-0">
        <div className="text-muted text-lg px-4 text-left">{data.order}</div>

        <div className="flex items-center gap-2 flex-1 pl-2">
          {/* WEIGHT */}
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className={`w-[90px] h-12 text-center text-xl bg-bgBase border ${weightClass} rounded-xl transition`}
              placeholder={!touched.weight ? (data.weight != null ? String(data.weight) : '') : ''}
              value={weight}
              onChange={(e) => update('weight', e.target.value)}
            />
            <span className="text-muted text-base">kg</span>
          </div>

          {/* REPS */}
          <div className="flex items-center gap-1">
            <Input
              type="number"
              className={`w-[90px] h-12 text-center text-xl bg-bgBase border ${repsClass} rounded-xl transition`}
              placeholder={!touched.reps ? (data.reps != null ? String(data.reps) : '') : ''}
              value={reps}
              onChange={(e) => update('reps', e.target.value)}
            />
            <span className="text-muted text-base">reps</span>
          </div>
        </div>

        <div>
          <SetSettingsPopover order={data.order} onAddDropSet={onAddDropSet} onDelete={onDelete} />
        </div>
      </div>

      {!!data.dropSets?.length && (
        <div className="pb-4">
          {data.dropSets.map((drop) => (
            <DropSetRow
              key={drop.id}
              parentSet={data}
              drop={drop}
              onChange={(updatedDrop) => {
                const newDropSets = data.dropSets.map((d) =>
                  d.id === updatedDrop.id ? updatedDrop : d,
                );

                onUpdate({
                  ...data,
                  dropSets: newDropSets,
                });
              }}
              onDelete={onDeleteDropSet}
            />
          ))}
        </div>
      )}
    </div>
  );
};
