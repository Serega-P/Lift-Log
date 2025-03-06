import {
	Button,
	Dialog, 
	DialogContent, 
	DialogHeader, 
	DialogTitle
} from "@/shared/components";

interface Workout {
	id: number;
	title: string;
	color: string; 
	// days: WorkoutDay[];
}

interface CalendarDialogProps {
  open: boolean;
  onClose: () => void;
  workouts: Workout[];
}

export function CalendarDialog({ open, onClose, workouts }: CalendarDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Workouts on this day</DialogTitle>
        </DialogHeader>
        {workouts.length > 0 ? (
          <ul>
            {workouts.map((workout) => (
              <li key={workout.id} className="p-2 border-b">
                <span className="font-bold" style={{ color: workout.color }}>
                  {workout.title}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No workouts on this day</p>
        )}
        <Button className="w-full mt-4" onClick={onClose}>
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
}
