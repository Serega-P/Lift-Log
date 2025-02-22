import React from "react";
import { Set } from "@/components/shared/components";
import { SetType } from "@/app/types/types";

interface Props {
	triSet: SetType;
}

export function TriSet({ triSet }: Props) {
  return (
    <div className="space-y-4">
      {/* Отображаем сабсеты для каждого сета в трисете */}
      {triSet.subSets && triSet.subSets.length > 0 && (
        <div className="space-y-2">
          {triSet.subSets.map((subSet, index) => (
            <div key={index}>
              <Set set={subSet} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
