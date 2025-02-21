"use client";

import {
  Button,
  MyCalendar,
  Container,
  Title,
  WorkoutDay,
  Skeleton,
} from "@/components/shared/components";
import * as React from "react";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { WorkoutType, } from "@/app/types/types"


export default function Home() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  // const [selectedDate, setSelectedDate] = useState<string | null>(null);
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
		console.log(date)
    // setSelectedDate(date);
		
  };

  // const handleCloseDialog = () => {
  //   setSelectedDate(null);
  // };

  const sortedWorkouts = React.useMemo(() => {
    const today = new Date();

    return [...workouts]
      .map((workout) => {
        const lastDay = workout.days.reduce((latest, currentDay) => {
          const currentDate = new Date(currentDay.date);
          return currentDate > new Date(latest.date) ? currentDay : latest;
        }, workout.days[0]);

        const daysAgo = lastDay
          ? Math.floor(
              (today.getTime() - new Date(lastDay.date).getTime()) /
              (1000 * 60 * 60 * 24)
            )
          : null;

        return {
          ...workout,
          lastDay,
          daysAgo,
        };
      })
      .sort((a, b) => {
        if (a.daysAgo === null) return 1;
        if (b.daysAgo === null) return -1;
        return b.daysAgo - a.daysAgo;
      });
  }, [workouts]);

  const events = workouts.flatMap((workout) =>
    workout.days.map((day) => ({
      date: day.date?.split("T")[0],
      color: workout.color,
    }))
  );

  // const workoutsForSelectedDate = selectedDate
  //   ? workouts.filter((workout) =>
  //       workout.days.some((day) => day.date.split("T")[0] === selectedDate)
  //     )
  //   : [];

  return (
    <>
      <Container className="bg-bgBase pb-2.5 pt-5 rounded-b-2xl drop-shadow-3xl">
        <MyCalendar events={events} onDayClick={handleCalendarClick} />
      </Container>

      <Container className="px-7 pt-10">
<<<<<<< HEAD
        <Title 
				text="Workouts" 
				size="lg" 
				className="text-title font-bold mb-3" />

				{isLoading ? (
				  <>
				    <Skeleton className="w-full h-20 mb-4" />
				    <Skeleton className="w-full h-20 mb-4" />
				    <Skeleton className="w-full h-20 mb-4" />
				  </>
				) : sortedWorkouts.length > 0 ? (
				  sortedWorkouts.map((workout) => (
				    <WorkoutDay key={workout.id} workout={workout} />
				  ))
				) : (
				  <p className="text-center text-muted text-lg mt-4">
				    No workouts yet, create your first one!
				  </p>
				)}

=======
        <Title text="Workouts" size="lg" className="text-title font-bold mb-3" />

        {isLoading ? (
					<>
          <Skeleton className="w-full h-20 mb-4" />
          <Skeleton className="w-full h-20 mb-4" />
          <Skeleton className="w-full h-20 mb-4" />
					</>
        ) : (
          sortedWorkouts.map((workout) => {
            return (
              <WorkoutDay
                key={workout.id}
                workout={workout}
              />
            );
          })
        )}
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4

        <Button className={cn("w-full mb-6 mt-5")} onClick={handleAddWorkout}>
          <Plus strokeWidth={3} size={20} />
          Add Workout
        </Button>
      </Container>

      {/* <CalendarDialog
        open={!!selectedDate}
        onClose={handleCloseDialog}
        workouts={workoutsForSelectedDate}
      /> */}
    </>
  );
}
