import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@/shared/components';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onCreateNew: () => void;
}

export function WorkoutSaveModal({ isOpen, onClose, onUpdate, onCreateNew }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-bgBase border-none max-w-[400px] py-10 rounded-[10px]">
        <DialogHeader>
          <DialogTitle className="text-xl">You already have a workout for today!</DialogTitle>
          <DialogDescription className="mb-5 text-base">
            Do you want to update your results or save as a new one?
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-between space-x-5">
          <Button variant="accent" className="uppercase rounded-[6px] w-full" onClick={onUpdate}>
            Refresh
          </Button>
          <Button variant="accent" className="uppercase rounded-[6px] w-full" onClick={onCreateNew}>
            Create a new one
          </Button>
        </div>
        <DialogFooter className="flex justify-between mt-6">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
