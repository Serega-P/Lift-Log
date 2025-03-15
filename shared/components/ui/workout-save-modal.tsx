import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Button,
} from '@/shared/components';
import { Loader } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isSaving: boolean;
  onClose: () => void;
  onUpdate: () => void;
  onCreateNew: () => void;
}

export function WorkoutSaveModal({ isOpen, onClose, onUpdate, onCreateNew, isSaving }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-bgBase border-none max-w-[400px] py-10 rounded-[10px] flex flex-col items-center justify-center">
        {isSaving && (
          <div className="absolute inset-0 bg-black/25 flex justify-center items-center z-10">
            <Loader size={48} className="text-white animate-spin" />
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-xl">You already have a workout for today!</DialogTitle>
          <DialogDescription className="mb-5 text-base">
            Do you want to update your results or save as a new one?
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-between space-x-5">
          <Button
            variant="accent"
            className=" text-lg rounded-[6px] w-full"
            onClick={onUpdate}
            disabled={isSaving}>
            Refresh
          </Button>
          <Button
            variant="accent"
            className=" text-lg rounded-[6px] w-full"
            onClick={onCreateNew}
            disabled={isSaving}>
            Add a new one
          </Button>
        </div>
        <DialogFooter className="flex items-end w-full mt-6">
          <Button variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
