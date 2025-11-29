'use client';

import React from 'react';
import { Button, SetItem } from '@/shared/components';
import { SetType, DropSetType } from '@/app/types/types';
import { CirclePlus } from 'lucide-react';

interface Props {
  sequence: SetType[];
  setSequence: React.Dispatch<React.SetStateAction<SetType[]>>;
}

export function SetControls({ sequence, setSequence }: Props) {
  const getNextOrder = () =>
    sequence.length > 0 ? Math.max(...sequence.map((s) => s.order)) + 1 : 1;

  const addSet = () => {
    setSequence((prev) => [
      ...prev,
      {
        id: Date.now(),
        type: 'set',
        order: getNextOrder(),
        weight: null,
        reps: null,
        dropSets: [],
      },
    ]);
  };

  const updateItem = (updatedItem: SetType) => {
    setSequence((prev) => prev.map((s) => (s.order === updatedItem.order ? updatedItem : s)));
  };

  const deleteItem = (order: number) => {
    setSequence((prev) => {
      const filtered = prev.filter((s) => s.order !== order);
      return filtered.map((s, i) => ({ ...s, order: i + 1 }));
    });
  };

  const addDropSet = (setOrder: number) => {
    setSequence((prev) =>
      prev.map((s) =>
        s.order === setOrder
          ? {
              ...s,
              dropSets: [
                ...s.dropSets,
                {
                  id: Date.now(),
                  order: s.dropSets.length + 1,
                  weight: null,
                  reps: null,
                } as DropSetType,
              ],
            }
          : s,
      ),
    );
  };

  const deleteDropSet = (setId: number, dropSetId: number) => {
    setSequence((prev) =>
      prev.map((s) => {
        if (s.order !== setId) return s;

        const filtered = s.dropSets.filter((d) => d.order !== dropSetId);

        const reordered = filtered.map((d, i) => ({
          ...d,
          order: i + 1,
        }));

        return {
          ...s,
          dropSets: reordered,
        };
      }),
    );
  };

  return (
    <div className="space-y-5 w-full max-w-[430px]">
      {sequence.length > 0 ? (
        sequence
          .sort((a, b) => a.order - b.order)
          .map((item) => (
            <SetItem
              key={item.id}
              data={item}
              onUpdate={updateItem}
              onDelete={deleteItem}
              onAddDropSet={addDropSet}
              onDeleteDropSet={deleteDropSet}
            />
          ))
      ) : (
        <p className="text-gray-500">No sets added yet.</p>
      )}

      <div className="flex max-w-[430px] mx-auto">
        <Button onClick={addSet} className="bg-none border-none text-base font-normal mt-2">
          <CirclePlus strokeWidth={1} /> + Set
        </Button>
      </div>
    </div>
  );
}
