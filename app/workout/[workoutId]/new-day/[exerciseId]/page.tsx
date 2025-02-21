"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container, Button, SetItem, TriSetItem, Title } from "@/components/shared/components";
import { ExerciseType, SetType, TrisetType, SetGroupType } from "@/app/types/types";

interface Props {
  params: { workoutId: string; exerciseId: string };
}

export default function NewDay({ params }: Props) {
  const { workoutId, exerciseId } = params;
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(true);
  const [exercise, setExercise] = useState<ExerciseType | null>(null);
  const [sequence, setSequence] = useState<(SetType | TrisetType)[]>([]);

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const response = await fetch(`/api/workouts/${Number(workoutId)}`);
        if (!response.ok) {
          console.error(`API Error ${response.status}:`, await response.text());
          return;
        }
        const data = await response.json();
        
        const lastDay = data.days?.length > 0 ? data.days[data.days.length - 1] : null;
        const exerciseFound = lastDay?.exercises.find((ex: ExerciseType) => ex.id === Number(exerciseId)) ||
          data.exercises?.find((ex: ExerciseType) => ex.id === Number(exerciseId));
        
        if (!exerciseFound) {
          console.error("Exercise not found!");
          return;
        }
        setExercise(exerciseFound);

        const sets = exerciseFound.setGroup?.flatMap((group: SetGroupType) => group.set || []) || [];
        const triSets = exerciseFound.setGroup?.flatMap((group: SetGroupType) => group.triset || []) || [];
        setSequence([...sets, ...triSets]);
      } catch (error) {
        console.error("Error fetching workout data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchWorkout();
  }, [workoutId, exerciseId]);


  const saveWorkout = async () => {
    try {
      const response = await fetch(`/api/workouts/${workoutId}/day`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: new Date().toISOString().split("T")[0],
          exercise: { name: exercise?.name },
          sequence,
        }),
      });
      if (!response.ok) throw new Error(await response.text());
      router.back();
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!exercise) return <p>Exercise not found!</p>;

  return (
    <Container className="w-full px-6 pt-20 space-y-7">
      <div className="flex flex-col items-start pb-2 border-b border-gray-700">
        <Button variant="link" className="text-accentSoft text-base font-bold px-0 mb-7" onClick={() => router.back()}>
          Cancel
        </Button>
        <Title text={exercise.name} size="lg" className="font-bold pb-2" />
      </div>

      <div className="space-y-4">
        {sequence.length > 0 ? (
          sequence.map((item, index) =>
            "subSets" in item ? (
              <TriSetItem key={item.id} data={item} onUpdate={(updated) => setSequence((prev) => prev.map((s, i) => (i === index ? updated : s)))} />
            ) : (
              <SetItem key={item.id} data={item} onUpdate={(updated) => setSequence((prev) => prev.map((s, i) => (i === index ? updated : s)))} />
            )
          )
        ) : (
          <p className="text-gray-500">No sets added yet. Use the buttons below to add sets.</p>
        )}
      </div>

      <Button variant="accent" size="lg" className="w-full text-lg font-bold mt-10" onClick={saveWorkout}>
        Save Workout
      </Button>
    </Container>
  );
}
