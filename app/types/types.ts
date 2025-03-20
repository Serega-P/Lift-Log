import { Prisma } from '@prisma/client';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserType {
  id: number;
  fullName: string;
  email: string;
  image?: string;
  password: string;
  role: UserRole;
  emailVerified?: string | null;
  provider: string;
  workouts?: WorkoutType[];
}

export interface WorkoutType {
  id?: number | string;
  title: string;
  color: string;
  userId?: number;
  user?: UserType;
  days?: WorkoutDayType[];
  exercises?: ExerciseType[];
}

export interface WorkoutDayType {
  id?: number;
  date: string;
  workoutId?: number | null;
  workout?: WorkoutType;
  exercises?: ExerciseType[];
}

export interface ExerciseType {
  id?: number;
  name: string;
  workoutId?: number;
  workoutDayId?: number;
  workout?: WorkoutType;
  workoutDay?: WorkoutDayType;
  setGroup?: SetGroupType[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type ExerciseCreateType = Pick<ExerciseType, 'name' | 'setGroup'>;

export interface SetGroupType {
  id?: number;
  exerciseId: number;
  exercise?: ExerciseType | null;
  sets?: SetType[];
}

export interface SetType {
  id?: number;
  type: string;
  order: number;
  setGroupId?: number;
  isTriSet: boolean;
  subSets?: SubSetType[];
  weight?: number | string;
  reps?: number | string;
}

export interface SubSetType {
  id?: number;
  setId: number;
  set?: SetType[];
  isAutoFilled: boolean;
  weight?: number | string;
  reps?: number | string;
  originalWeight?: number | string;
  originalReps?: number | string;
  order: number;
}

export interface DayWithColor {
  date: object;
  color: string;
}

export type WorkoutDayWithExercises = Prisma.WorkoutDayGetPayload<{
  include: {
    exercises: {
      include: {
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
  };
}>;
