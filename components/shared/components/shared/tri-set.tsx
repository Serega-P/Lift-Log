import React from "react";
import { Set } from "@/components/shared/components";
import { TrisetType } from "@/app/types/types";

interface TriSetProps {
	triSet: TrisetType;
}

export function TriSet({ triSet }: TriSetProps) {
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
