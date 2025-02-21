import { ExerciseList, } from "@/components/shared/components";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shared/components/ui/popover";
import { Menu, Edit, Trash } from "lucide-react";

interface Props {
  id: number;
  title: string;
  date: string; // Дата последней тренировки
  exercises: Exercise[];
}

interface Exercise {
  id: number;
  name: string;
  records: Record[];
}

interface Record {
  set: number;
  weight: number;
  reps: number;
  trend: "up" | "down" | "neutral";
}

export const WorkoutPage: React.FC<Props> = ({ id, title, date, exercises }) => {
  return (
    <div className="p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground">Last {date}</p>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="p-2 text-muted-foreground hover:text-primary">
              <Menu size={24} />
            </button>
          </PopoverTrigger>
          <PopoverContent>
            <button className="flex items-center gap-2 w-full px-2 py-1 text-red-500 hover:bg-red-50">
              <Trash size={16} /> Delete Workout
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-50">
              <Edit size={16} /> Edit Workout
            </button>
            <button className="flex items-center gap-2 w-full px-2 py-1 hover:bg-gray-50">
              <Menu size={16} /> Duplicate Workout
            </button>
          </PopoverContent>
        </Popover>
      </header>

      {/* Exercise List */}
      <ExerciseList exercises={exercises} />

      {/* Footer */}
      <div className="mt-6">
        <button
          className="w-full py-3 text-white bg-green-500 rounded-lg hover:bg-green-600"
        >
          Set a New Record
        </button>
      </div>
    </div>
  );
};
