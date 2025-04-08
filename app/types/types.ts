import { Prisma } from '@prisma/client';

// Перечисление ролей пользователя
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Тип пользователя
export interface UserType {
  id: number;
  fullName: string;
  email: string;
  password?: string | null; // Пароль необязателен (например, для OAuth)
  role: UserRole;
  image?: string | null;
  provider?: string | null; // Провайдер авторизации (Google, email и т.д.)
  emailVerified?: Date | null; // Используем Date вместо string
  workouts?: WorkoutType[];
  createdAt: Date;
  updatedAt: Date;
}

// Тип тренировки
export interface WorkoutType {
  id: number;
  title: string;
  color: string;
  userId: number;
  user?: UserType;
  days?: WorkoutDayType[];
  createdAt: Date;
  updatedAt: Date;
}

// Тип дня тренировки
export interface WorkoutDayType {
  id: number;
  date?: Date | null; // Используем Date вместо string
  workoutId?: number | null;
  workout?: WorkoutType;
  exercises?: ExerciseType[];
  createdAt: Date;
  updatedAt: Date;
}

// Тип упражнения (уникальный тип, например "Жим лёжа")
export interface ExerciseTypeDef {
  id: number;
  name: string;
  userId: number;
  user?: UserType;
  exercises?: ExerciseType[]; // Все выполнения этого типа упражнения
  createdAt: Date;
  updatedAt: Date;
}

// Тип выполнения упражнения
export interface ExerciseType {
  id: number;
  workoutDayId: number;
  exerciseTypeId: number;
  exerciseType?: {
    id: number;
    name: string;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
  };
  setGroup?: SetGroupType[];
  createdAt: Date;
  updatedAt: Date;
}

// Тип для создания выполнения упражнения
export type ExerciseCreateType = Pick<ExerciseType, 'exerciseTypeId' | 'setGroup' | 'workoutDayId'>;

// Тип группы сетов
export interface SetGroupType {
  id?: number;
  exerciseId: number;
  exercise?: ExerciseType | null;
  sets?: SetType[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Тип для создания группы сетов
export interface SetGroupCreateType {
  sets?: SetType[];
}

// Тип сета
export interface SetType {
  id: number;
  type: string; // Например, "warmup", "working"
  order: number; // Порядок в группе сетов
  weight?: number | null; // Убрано string, используем только number или null
  reps?: number | null; // То же самое для reps
  isTriSet: boolean;
  subSets?: SubSetType[];
  setGroupId: number;
  setGroup?: SetGroupType;
  createdAt: Date;
  updatedAt: Date;
}

// Тип для создания сета
export type SetCreateType = Pick<
  SetType,
  'type' | 'order' | 'weight' | 'reps' | 'isTriSet' | 'subSets'
> & {
  subSets?: { create: SubSetCreateType[] };
};

// Тип подсета (для TriSet)
export interface SubSetType {
  id: number;
  setId: number;
  set?: SetType;
  weight?: number | null;
  reps?: number | null;
  order: number; // Порядок в TriSet
  createdAt: Date;
  updatedAt: Date;
}

// Тип для создания подсета
export type SubSetCreateType = Pick<SubSetType, 'weight' | 'reps' | 'order'>;

// Тип для дня с цветом (если используется в UI)
export interface DayWithColor {
  date: Date | null; // Используем Date вместо object
  color: string;
}

// Тип для получения данных из Prisma с включением связанных сущностей
export type WorkoutDayWithExercises = Prisma.WorkoutDayGetPayload<{
  include: {
    exercises: {
      include: {
        exerciseType: true; // Включаем тип упражнения
        setGroup: {
          include: {
            sets: {
              include: {
                subSets: true;
              };
            };
          };
        };
      };
    };
    workout: true;
  };
}>;
