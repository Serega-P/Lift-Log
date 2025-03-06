import React from "react";
import { Set } from "@/shared/components";
import { SetType } from "@/app/types/types";

interface Props {
	triSet: SetType;
}

export function TriSet({ triSet }: Props) {
  return (
    <div>
      {/* Отображаем сабсеты для каждого сета в трисете */}
      {triSet.subSets && triSet.subSets.length > 0 && (
        <div>
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
