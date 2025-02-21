import { ExerciseCard } from "./exercise-card";

interface Props {
  exercises: Exercise[];
}

export const ExerciseList: React.FC<Props> = ({ exercises }) => {
  return (
    <div className="space-y-4">
      {exercises.map((exercise) => (
        <ExerciseCard key={exercise.id} exercise={exercise} />
      ))}
    </div>
  );
};
