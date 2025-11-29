'use client';

import React, { useEffect, useState } from 'react';
import { DropSetType, SetType } from '@/app/types/types';
import { Input } from '@/shared/components';
import { Trash2, ArrowDownRight } from 'lucide-react';

interface Props {
  parentSet: SetType;
  drop: DropSetType;
  onChange: (updated: DropSetType) => void;
  onDelete: (setId: number, dropSetId: number) => void;
}

export const DropSetRow: React.FC<Props> = ({ parentSet, drop, onChange, onDelete }) => {
  const [touched, setTouched] = useState({
    weight: false,
    reps: false,
  });

  const [weight, setWeight] = useState<string>(drop.weight != null ? String(drop.weight) : '');
  const [reps, setReps] = useState<string>(drop.reps != null ? String(drop.reps) : '');

  useEffect(() => {
    if (!touched.weight) setWeight(drop.weight != null ? String(drop.weight) : '');
    if (!touched.reps) setReps(drop.reps != null ? String(drop.reps) : '');
  }, [drop]);

  const handleUpdate = (field: 'weight' | 'reps', value: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'weight') setWeight(value);
    if (field === 'reps') setReps(value);

    const parsed = value === '' ? null : Number(value);
    onChange({
      ...drop,
      [field]: parsed,
    });
  };

  const weightActive = touched.weight && weight.trim() !== '';
  const repsActive = touched.reps && reps.trim() !== '';

  const weightClass = weightActive ? 'border-accent text-primary' : 'border-muted text-muted';
  const repsClass = repsActive ? 'border-accent text-primary' : 'border-muted text-muted';

  return (
    <div className="flex items-center justify-start gap-2 py-2">
      {/* Icon before inputs */}
      <div className="ml-8 p-2 rounded-xl flex items-center justify-center">
        <ArrowDownRight className="text-muted w-5 h-5" />
      </div>

      {/* Weight input */}
      <Input
        type="number"
        className={`w-[80px] h-10 text-center text-lg bg-bgBase border ${weightClass} rounded-lg`}
        placeholder={!touched.weight ? (drop.weight != null ? String(drop.weight) : '') : ''}
        value={weight}
        onChange={(e) => handleUpdate('weight', e.target.value)}
      />
      <span className="text-muted text-sm">kg</span>

      {/* Reps input */}
      <Input
        type="number"
        className={`w-[80px] h-10 text-center text-lg bg-bgBase border ${repsClass} rounded-lg`}
        placeholder={!touched.reps ? (drop.reps != null ? String(drop.reps) : '') : ''}
        value={reps}
        onChange={(e) => handleUpdate('reps', e.target.value)}
      />
      <span className="text-muted text-sm">reps</span>

      {/* Delete button */}
      <button
        type="button"
        className="p-4 bg-none text-muted hover:text-neutral-200 transition ml-auto"
        onClick={() => onDelete(parentSet.order, drop.order)}
        title="Delete DropSet">
        <Trash2 size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
};

export default DropSetRow;
