"use client";

import { useState, useEffect } from "react";
import { WorkoutType, } from "@/app/types/types"


export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);


  useEffect(() => {
    async function fetchWorkouts() {
      const response = await fetch("/api/workouts");
      const data = await response.json();
      setWorkouts(data);
    }
    fetchWorkouts();
  }, []);


  return (
    <div>
      <h1>All Workouts !</h1>
      <ul>
        {workouts.map((workout) => (
          <li key={workout.id}>
            {workout.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
