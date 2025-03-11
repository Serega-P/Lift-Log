'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Input, Title } from '@/shared/components';
import { Trash2, Check, ChevronLeft, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';

const COLORS = [
  '#34C759',
  '#FF9500',
  '#00C7BE',
  '#6750A4',
  '#007AFF',
  '#C00F0C',
  '#682D03',
  '#F19EDC',
];

export default function NewWorkout() {
  const [workoutName, setWorkoutName] = React.useState<string>('');
  const [exercises, setExercises] = React.useState([{ id: Date.now(), name: '' }]);
  const [selectedColor, setSelectedColor] = React.useState(COLORS[0]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isChanged, setIsChanged] = React.useState(false); // Флаг изменений

  const router = useRouter();

  // Исходное состояние для отслеживания изменений
  const initialState = React.useRef({
    workoutName: '',
    exercises: [{ id: exercises[0].id, name: '' }],
  });

  // Проверяем, были ли изменения
  React.useEffect(() => {
    const hasChanges =
      workoutName !== initialState.current.workoutName &&
      JSON.stringify(exercises) !== JSON.stringify(initialState.current.exercises);

    setIsChanged(hasChanges);
  }, [workoutName, exercises]);

  const handleAddExercise = () => {
    setExercises([...exercises, { id: Date.now(), name: '' }]);
  };

  const handleRemoveExercise = (id: number) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id));
  };

  const handleExerciseChange = (id: number, value: string) => {
    setExercises(
      exercises.map((exercise) => (exercise.id === id ? { ...exercise, name: value } : exercise)),
    );
  };

  const handleSubmit = async () => {
    if (!workoutName.trim() || exercises.some((e) => !e.name.trim())) {
      setErrorMessage('Please fill in all fields');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: workoutName,
          color: selectedColor,
          exercises: exercises.map((e) => ({ name: e.name })),
        }),
      });

      if (!response.ok) throw new Error('Failed to create workout');

      router.push('/');
    } catch (error) {
      console.error('Error creating workout:', error);
      setErrorMessage('Error creating workout');
      setTimeout(() => setErrorMessage(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="w-full px-6 py-20 space-y-7 relative min-h-screen">
      {/* Fixed header with buttons */}
      <div className="fixed top-0 left-0 w-full bg-bgBase px-6 py-4 flex justify-between items-center z-50">
        <Button
          className="text-white border-none bg-bgSoft h-12 w-12 p-2"
          onClick={() => router.back()}>
          <ChevronLeft size={24} />
        </Button>
        <Button
          variant="accent"
          size="default"
          className="bg-green-500 h-12 px-6 text-lg font-normal relative overflow-hidden hover:bg-green-400"
          onClick={handleSubmit}
          disabled={!isChanged || loading} // Блокируем, если нет изменений
        >
          <span
            className="absolute inset-0 flex items-center justify-center bg-accent/50 transition-opacity duration-300"
            style={{ opacity: loading ? 1 : 0 }}>
            {loading && <Loader className="h-5 w-5 text-white animate-spin" />}
          </span>
          <span
            className={cn('transition-opacity duration-300', {
              'opacity-0': loading,
              'opacity-100': !loading,
            })}>
            Save
          </span>
        </Button>
      </div>

      {/* Offset content to account for fixed header */}
      <div className="pt-20 space-y-6">
        <Title text="New workout" size="md" className="font-extrabold" />

        <div className="w-full space-y-1">
          <label className="block font-medium text-base text-muted pl-3">Workout Name</label>
          <Input
            type="text"
            placeholder="Name your workout"
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            className="pl-4 bg-bgSoft border-transparent placeholder:text-primary font-bold"
          />
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
                className="pl-4 bg-bgSoft border-transparent placeholder:text-primary font-bold"
              />
              {exercises.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-10 w-10 p-2"
                  onClick={() => handleRemoveExercise(exercise.id)}>
                  <Trash2 size={20} strokeWidth={2} className="text-red-300" />
                </Button>
              )}
            </div>
          </div>
        ))}

        <Button
          className="w-full flex items-center justify-center h-12"
          onClick={handleAddExercise}>
          + Add exercise
        </Button>

        <div className="w-full space-y-1 pb-10">
          <label className="block font-medium text-base text-muted pl-3">Select Color</label>
          <div className="flex justify-between">
            {COLORS.map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                  selectedColor === color ? 'border-primary' : 'border-transparent'
                }`}
                style={{ backgroundColor: color }}
                onClick={() => setSelectedColor(color)}>
                {selectedColor === color && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="h-6 flex justify-center items-center">
          {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}
        </div>
      </div>
    </Container>
  );
}
