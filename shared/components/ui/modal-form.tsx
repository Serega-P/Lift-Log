import React from 'react';
import {
  Dialog,
  // DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from '@/shared/components';

type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  inputPlaceholder?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
};

export const ModalForm: React.FC<ModalFormProps> = ({
  isOpen,
  onClose,
  title,
  description,
  inputPlaceholder = 'Enter value',
  inputValue,
  onInputChange,
  onSubmit,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-bgBase border-none max-w-[400px] py-10 rounded-[10px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-left">{title}</DialogTitle>
          {description && (
            <DialogDescription className="text-left mb-5 text-muted">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="pl-4 rounded-[6px] bg-bgSoft placeholder:font-normal font-bold border-muted/25 mb-5"
        />
        <div className="w-full flex justify-between space-x-5">
          <Button variant="secondary" className="text-base rounded-[6px] w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="accent" className="text-base rounded-[6px] w-full" onClick={onSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
