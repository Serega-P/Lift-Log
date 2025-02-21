const mockWorkouts = [
  {
    id: 1,
    title: "Chest, Biceps, Shoulders",
    date: "2024-12-20",
    exercises: [
      { id: 1, name: "Bench Press", records: [{ set: 1, weight: 80, reps: 10, trend: "up" }] },
      { id: 2, name: "Dumbbell Curl", records: [{ set: 1, weight: 20, reps: 12, trend: "neutral" }] },
    ],
  },
  {
    id: 2,
    title: "Full body",
    date: "2024-12-19",
    exercises: [
      { id: 3, name: "Deadlift", records: [{ set: 1, weight: 100, reps: 8, trend: "down" }] },
    ],
  },
];

export const getWorkoutById = (id: number) => {
  return mockWorkouts.find((workout) => workout.id === id);
};
