'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Button, Container, Input, Title } from '@/shared/components';
import { Trash2, Check, ArrowLeft, Loader } from 'lucide-react';
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
  const [exercises, setExercises] = React.useState<{ id: number; name: string }[]>([]);
  const [selectedColor, setSelectedColor] = React.useState(COLORS[0]);
  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [isChanged, setIsChanged] = React.useState(false);

  const router = useRouter();

  const initialState = React.useRef({
    workoutName: '',
    exercises: [],
  });

  React.useEffect(() => {
    const hasChanges =
      workoutName !== initialState.current.workoutName ||
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
    // Проверяем только название тренировки
    if (!workoutName.trim()) {
      setErrorMessage('Please fill in the workout name');
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    // Если есть упражнения, проверяем, что их названия заполнены
    if (exercises.length > 0 && exercises.some((e) => !e.name.trim())) {
      setErrorMessage('Please fill in all exercise names');
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
          exercises:
            exercises.length > 0
              ? exercises.map((e) => ({
                  name: e.name,
                  setGroup: [{}], // Пустой setGroup для совместимости
                }))
              : [], // Отправляем пустой массив, если нет упражнений
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create workout');
      }

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
      <div className="fixed top-0 left-0 w-full bg-black flex justify-center items-center z-50">
        <div className="w-full max-w-[430px] px-5 py-2 flex justify-between items-center">
          <Button className="text-muted border-none h-12 w-12 p-2" onClick={() => router.back()}>
            <ArrowLeft size={24} strokeWidth={3} />
          </Button>
          <Button
            variant="accent"
            size="default"
            className="bg-none h-12 px-6 text-lg font-normal relative overflow-hidden hover:bg-none"
            onClick={handleSubmit}
            disabled={!isChanged || loading}>
            <span
              className="absolute inset-0 flex items-center justify-center transition-opacity duration-300"
              style={{ opacity: loading ? 1 : 0 }}>
              {loading && <Loader className="h-5 w-5 text-white animate-spin" />}
            </span>
            <span
              className={cn('transition-opacity duration-300 ', {
                'opacity-0': loading,
                'opacity-100': !loading,
              })}>
              Save
            </span>
          </Button>
        </div>
      </div>

      {/* Offset content to account for fixed header */}
      <div className="space-y-6">
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

        <div className="w-full space-y-1">
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

        {/* Упражнения отображаются только если они есть */}
        {exercises.length > 0 && (
          <div className="space-y-4">
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
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-10 w-10 p-2"
                    onClick={() => handleRemoveExercise(exercise.id)}>
                    <Trash2 size={20} strokeWidth={2} className="text-red-300" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Button
          className="w-full flex items-center justify-center h-12"
          onClick={handleAddExercise}>
          + Add exercise
        </Button>

        <div className="h-6 flex justify-center items-center">
          {errorMessage && <p className="text-red-500 font-bold">{errorMessage}</p>}
        </div>
      </div>
    </Container>
  );
}
