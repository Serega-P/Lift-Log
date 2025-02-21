"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button, Container, Input, Title, MuscleGroupPopover } from "@/components/shared/components";
import { Plus, Trash, Check } from "lucide-react";

const COLORS = ['#34C759', '#FF9500', '#00C7BE', '#6750A4', '#007AFF', '#C00F0C', '#682D03', '#F19EDC'];

export default function NewWorkout() {
  const [selectedGroups, setSelectedGroups] = React.useState<string>("");
  const [exercises, setExercises] = React.useState([{ id: Date.now(), name: "" }]);
  const [selectedColor, setSelectedColor] = React.useState(COLORS[0]); 
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null); // ❗ Для ошибки

  const router = useRouter();

  const toggleGroup = (group: string) => {
    setSelectedGroups((prev) => {
      const groupsArray = prev ? prev.split(" - ") : [];
      const newGroups = groupsArray.includes(group)
        ? groupsArray.filter((g) => g !== group)
        : [...groupsArray, group];

      return newGroups.join(" - ");
    });
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { id: Date.now(), name: "" }]);
  };

  const handleRemoveExercise = (id: number) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const handleExerciseChange = (id: number, value: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === id ? { ...exercise, name: value } : exercise
      )
    );
  };

  const handleSubmit = async () => {
    if (selectedGroups.length === 0 || exercises.some(e => !e.name.trim())) {
      setErrorMessage("Please fill in all fields"); // ❗ Показываем ошибку
      setTimeout(() => setErrorMessage(null), 3000); // ❗ Убираем через 3 секунды
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: selectedGroups,
          color: selectedColor,
          exercises: exercises.map(e => ({ name: e.name })),
        }),
      });

      if (!response.ok) throw new Error("Failed to create workout");

      router.push("/"); // ✅ Переход на главную после успешного создания
    } catch (error) {
      console.error("Error creating workout:", error);
      setErrorMessage("Error creating workout"); // ❗ Ошибка запроса
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="w-full px-6 py-20 space-y-7">
      <Button variant="link" className="text-accentSoft text-base font-bold px-0 mb-7" onClick={router.back}>
        Cancel
      </Button>

      <Title text="New workout" size="md" className="font-extrabold" />

      <div className="relative w-full space-y-1">
        <label className="block font-medium text-base text-muted pl-3">Muscle Group(s)</label>
        <MuscleGroupPopover selectedGroups={selectedGroups} toggleGroup={toggleGroup} />
      </div>

      {exercises.map((exercise, index) => (
        <div key={exercise.id} className="w-full space-y-1">
          <label className="block font-medium text-base text-muted pl-3">
            Exercise {index + 1}
          </label>
          <div className="relative flex items-center space-x-2">
            <Input
              type="text"
              placeholder="Write an exercise"
              value={exercise.name}
              onChange={(e) => handleExerciseChange(exercise.id, e.target.value)}
              className="pl-4 bg-bgSurface border-transparent placeholder:text-primary font-bold"
            />
            {exercises.length > 1 && (
              <Button variant="destructive" size="icon" className="p-2" onClick={() => handleRemoveExercise(exercise.id)}>
                <Trash size={16} strokeWidth={3} className="text-muted" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <Button className="w-full flex items-center justify-center" onClick={handleAddExercise}>
        <Plus strokeWidth={2} size={20} />
        Add exercise
      </Button>

      <div className="w-full space-y-1 pb-10">
        <label className="block font-medium text-base text-muted pl-3">Select Color</label>
        <div className="flex justify-between">
          {COLORS.map((color) => (
            <button
              key={color}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${selectedColor === color ? "border-primary" : "border-transparent"}`}
              style={{ backgroundColor: color }}
              onClick={() => setSelectedColor(color)}
            >
              {selectedColor === color && <Check size={16} className="text-primary" />}
            </button>
          ))}
        </div>
      </div>

      <div className="h-6 flex justify-center items-center">
        {errorMessage && (
          <p className="text-red-500 font-bold">{errorMessage}</p>
        )}
      </div>

      <Button
        variant="accent"
        size="accent"
        className="w-full text-lg font-bold mt-10"
        onClick={handleSubmit}
        disabled={loading}
      >
				{loading ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-t-4 border-white"></div>
          Saving...
        </>
      ) : (
        "Create"
      )}
      </Button>
    </Container>
  );
}
