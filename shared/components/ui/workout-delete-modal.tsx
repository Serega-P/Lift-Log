import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from '@/shared/components';
import { Loader } from 'lucide-react';

interface Props {
  isOpen: boolean;
  isDeleting: boolean;
  onClose: () => void;
  onConfirmDelete: () => void;
}

export function WorkoutDeleteModal({ isOpen, onClose, onConfirmDelete, isDeleting }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-bgBase border-none max-w-[400px] py-10 rounded-[10px] flex flex-col items-center justify-center">
        {isDeleting && (
          <div className="absolute inset-0 bg-black/25 flex justify-center items-center z-10">
            <Loader size={48} className="text-white animate-spin" />
          </div>
        )}

        <DialogHeader>
          <DialogTitle className="text-xl">Are you sure?</DialogTitle>
          <DialogDescription className="mb-5 text-base">
            This action cannot be undone. This will permanently delete your workout.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full flex justify-between space-x-5">
          <Button
            variant="destructive"
            className="text-lg rounded-[6px] w-full bg-red-500 hover:bg-red-400"
            onClick={onConfirmDelete}
            disabled={isDeleting}>
            Delete
          </Button>
          <Button
            variant="secondary"
            className="text-lg rounded-[6px] w-full"
            onClick={onClose}
            disabled={isDeleting}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
