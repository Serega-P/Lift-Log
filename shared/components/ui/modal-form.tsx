import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Input,
} from '@/shared/components';
import { Check } from 'lucide-react';
import { useEffect } from 'react';

const COLORS = [
  '#34C759',
  '#FF9500',
  '#00C7BE',
  '#6750A4',
  '#007AFF',
  '#C00F0C',
  '#682D03',
  '#F19EDC',
];

type ModalFormProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  inputPlaceholder?: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  isWorkoutEdit?: boolean;
  selectedColor?: string; // Опционально, если isWorkoutEdit === false
  onColorChange?: (color: string) => void; // Опционально, если isWorkoutEdit === false
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
  isWorkoutEdit = false,
  selectedColor,
  onColorChange,
}) => {
  // Сбрасываем значения при закрытии модального окна
  useEffect(() => {
    if (!isOpen) {
      onInputChange(''); // Сбрасываем значение поля ввода
      if (isWorkoutEdit && onColorChange) {
        onColorChange(COLORS[0]); // Сбрасываем цвет на первый в списке
      }
    }
  }, [isOpen, onInputChange, isWorkoutEdit, onColorChange]);

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
          className="pl-4 py-3 rounded-[6px] bg-bgSoft placeholder:font-normal font-bold border-muted/25 mb-5"
        />

        {/* Показываем выбор цвета только если isWorkoutEdit === true */}
        {isWorkoutEdit && selectedColor !== undefined && onColorChange && (
          <div className="w-full space-y-1 pb-10">
            <label className="block font-medium text-base text-muted pl-3">Select Color</label>
            <div className="flex justify-between">
              {COLORS.map((color) => (
                <button
                  key={color}
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    selectedColor === color ? 'border-primary' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}>
                  {selectedColor === color && <Check size={16} className="text-primary" />}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="w-full flex justify-between space-x-5">
          <Button variant="secondary" className="text-base rounded-[6px] w-full" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="accent"
            className="text-base text-primary rounded-[6px] w-full bg-accent hover:text-primary"
            onClick={onSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
