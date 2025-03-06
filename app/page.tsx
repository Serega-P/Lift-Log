"use client";

import {
  Button,
  MyCalendar,
  Container,
  Title,
  WorkoutDay,
  Skeleton,
} from "@/shared/components";
import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutType, DayWithColor } from "@/app/types/types";

export default function Home() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts")
      .then((res) => res.json())
      .then((data) => {
        setWorkouts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Ошибка загрузки:", err);
        setIsLoading(false);
      });
  }, []);

  const handleAddWorkout = () => {
    router.push("/workout/create");
  };

  const handleCalendarClick = (date: string) => {
    console.log(date);
  };

  const events: DayWithColor[] = workouts.flatMap((workout) =>
    workout.days.map((day) => ({
      date: new Date(day.date),
      color: workout.color,
    }))
  );

  return (
    <>
      <Container className="bg-bgBase pb-2.5 pt-5 rounded-b-2xl drop-shadow-3xl">
        <MyCalendar events={events} onDayClick={handleCalendarClick} />
      </Container>

      <Container className="px-7 pt-10">
        <Title text="Workouts" size="lg" className="text-title font-bold mb-3" />
        {isLoading ? (
          <>
            <Skeleton className="w-full h-20 mb-4" />
            <Skeleton className="w-full h-20 mb-4" />
            <Skeleton className="w-full h-20 mb-4" />
          </>
        ) : workouts.length > 0 ? (
          workouts.map((workout) => <WorkoutDay key={workout.id} workout={workout} />)
        ) : (
          <p className="text-center text-muted text-lg mt-4">No workouts yet, create your first one!</p>
        )}
        <Button className="w-full mb-6 mt-2.5" onClick={handleAddWorkout}>
         + Add Workout
        </Button>
      </Container>
    </>
  );
}