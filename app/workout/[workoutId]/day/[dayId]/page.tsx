"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Title, Exercise, Button } from "@/shared/components";
import { ChevronLeft, Disc3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { WorkoutType, ExerciseType } from "@/app/types/types";

export default function WorkoutDay({ params }: { params: { workoutId: number } }) {
  const { workoutId } = params;
  const [workout, setWorkout] = useState<WorkoutType | null>(null);
  const [exercises, setExercises] = useState<ExerciseType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

	// console.log("exercises", exercises)

  useEffect(() => {
    async function fetchWorkout() {
      try {
        const res = await fetch(`/api/workouts/${workoutId}`);
        if (!res.ok) throw new Error(`Failed to fetch workout: ${res.status}`);

        const data: WorkoutType = await res.json();
        setWorkout(data);

        if (data.days?.length) {
          setExercises(data.days[data.days.length - 1].exercises);
        } else if (data.exercises?.length) {
          setExercises(data.exercises);
        }
      } catch (error) {
        console.error("Ошибка загрузки тренировки:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWorkout();
  }, [workoutId]);

  const saveWorkout = async () => {
    setIsSaving(true);

    try {
      const res = await fetch(`/api/workouts/${workoutId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutId, exercises }),
      });

      if (!res.ok) throw new Error("Failed to save workout");

      router.push("/");
    } catch (error) {
      console.error("❌ Ошибка при сохранении тренировки:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Функция для обновления упражнения
  const updateExercise = (updatedExercise: ExerciseType) => {
    setExercises((prev) =>
      prev.map((exercise) => (exercise.id === updatedExercise.id ? updatedExercise : exercise))
    );
  };

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin"><Disc3 size={36} /></div>
      </div>
    );
  }

  if (!workout) {
    return <div className="text-center text-gray-500">Workout not found.</div>;
  }

  return (
    <Container className="w-full px-6 py-20 relative min-h-screen">
      {/* Fixed header with buttons */}
      <div className="fixed top-0 left-0 w-full bg-bgBase px-6 py-4 flex justify-between items-center z-50">
        <Button
          className="text-white border-none bg-bgSoft h-12 w-12 p-2"
          onClick={() => router.back()}
        >
          <ChevronLeft size={24} />
        </Button>
        <div className="flex items-center space-x-4"> {/* Добавлен отступ 20px через space-x-4 (16px ≈ 20px) */}
				<Button
            variant="ghost"
            className="h-12 w-12 p-2 bg-bgSoft text-muted hover:bg-bgMuted"
            onClick={() => console.log("Settings clicked")} // Замените на вашу логику
          >
            <Settings size={24} />
          </Button>
          <Button
            variant="accent"
            size="default"
            className="h-12 px-6 text-lg font-bold relative overflow-hidden"
            onClick={saveWorkout}
            disabled={isSaving}
          >
            <span className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
                  style={{ opacity: isSaving ? 1 : 0 }}>
              {isSaving && (
                <Disc3 className="h-5 w-5 text-white animate-spin" />
              )}
            </span>
            <span className={cn("transition-opacity duration-300", { "opacity-0": isSaving, "opacity-100": !isSaving })}>
              Save
            </span>
          </Button>
        </div>
      </div>

      {/* Offset content to account for fixed header */}
      <div className="pt-20">
        {/* Заголовок тренировки */}
        <div className="mb-4">
          {workout.days?.length ? (
            <p className="flex items-center text-muted text-sm">
              Last workout:{" "}
              {new Date(workout.days[workout.days.length - 1].date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          ) : (
            <p className="flex items-center text-muted text-sm">No workout yet</p>
          )}

          <Title text={workout.title} size="sm" className="font-bold" />
        </div>

        {/* Упражнения */}
        <div className="space-y-6"> {/* Добавлено space-y-6 для расстояния между упражнениями */}
          {exercises.length > 0 ? (
            exercises.map((exercise) => (
              <Exercise key={exercise.id} exercise={exercise} onUpdate={updateExercise} />
            ))
          ) : (
            <p className="text-gray-500">No exercises available.</p>
          )}
        </div>
				<Button className="w-full mb-6 mt-5">
         + Add exercise
        </Button>

      </div>
    </Container>
  );
}