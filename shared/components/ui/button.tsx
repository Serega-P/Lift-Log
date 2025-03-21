import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-auto [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'text-primary text-base text-accent font-normal border border-dashed border-accent', // Основной стиль
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90', // Деструктивная кнопка
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground', // Контурная кнопка
        secondary: 'bg-bgSoft hover:bg-bgSoft/80', // Вторичная кнопка
        ghost: 'hover:bg-accent hover:text-accent-foreground', // Прозрачная кнопка
        link: 'text-primary underline-offset-4 hover:underline', // Ссылка
        accent: 'bg-accent text-primary hover:bg-accent', // Кастомный стиль для кнопки Save
        icons: 'text-primary [&_svg]:size-auto',
      },
      size: {
        default: 'h-10 rounded-[6px] px-4 py-6',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        accent: 'py-6 px-4 rounded-[16px]',
        icons: 'h-auto w-auto',
        secondary: 'h-auto w-auto',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
