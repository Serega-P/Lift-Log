import { Prisma } from '@prisma/client';

// Роли пользователя
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

// Тип пользователя
export interface UserType {
  id: number;
  fullName: string;
  email: string;
  password?: string | null;
  role: UserRole;
  image?: string | null;
  provider?: string | null;
  emailVerified?: Date | null;
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
  date?: Date | null;
  workoutId?: number | null;
  workout?: WorkoutType;
  exercises?: ExerciseType[];
  createdAt: Date;
  updatedAt: Date;
}

// Тип определения упражнения (ExerciseType table)
export interface ExerciseTypeDef {
  id: number;
  name: string;
  userId: number;
  user?: UserType;
  exercises?: ExerciseType[];
  createdAt: Date;
  updatedAt: Date;
}

// Выполнение упражнения
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

export type ExerciseCreateType = Pick<ExerciseType, 'exerciseTypeId' | 'setGroup' | 'workoutDayId'>;

// Группа сетов
export interface SetGroupType {
  id?: number;
  exerciseId: number;
  exercise?: ExerciseType | null;
  sets?: SetType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SetGroupCreateType {
  sets?: SetType[];
}

// 🔥 Тип DropSet
export interface DropSetType {
  id: number;
  parentSetId: number;
  parentSet?: SetType;

  weight?: number | null;
  reps?: number | null;
  order: number;

  createdAt: Date;
  updatedAt: Date;
}

export type DropSetCreateType = Pick<DropSetType, 'weight' | 'reps' | 'order'>;

// 🔥 Обновленный SetType
export interface SetType {
  id?: number;
  type: string; // например "working"
  order: number;
  weight?: number | null;
  reps?: number | null;

  dropSets: DropSetType[]; // 🔥 заменили subSets

  setGroupId?: number;
  setGroup?: SetGroupType;

  createdAt?: Date;
  updatedAt?: Date;
}

// Создание сета
export type SetCreateType = Pick<SetType, 'type' | 'order' | 'weight' | 'reps' | 'dropSets'> & {
  dropSets?: { create: DropSetCreateType[] };
};

// Для UI
export interface DayWithColor {
  date: Date | null;
  color: string;
}

// Для Prisma Include
export type WorkoutDayWithExercises = Prisma.WorkoutDayGetPayload<{
  include: {
    exercises: {
      include: {
        exerciseType: true;
        setGroup: {
          include: {
            sets: {
              include: {
                dropSets: true; // 🔥 заменили subSets
              };
            };
          };
        };
      };
    };
    workout: true;
  };
}>;
