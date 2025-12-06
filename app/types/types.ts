import { Prisma } from '@prisma/client';

// Роли пользователя
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

/* ============================
   👤 USER
============================= */

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
  exerciseTypes?: ExerciseDefinition[];

  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   🏋️ WORKOUT + DAY
============================= */

export interface WorkoutType {
  id: number;
  title: string;
  color: string;
  userId: number;

  days?: WorkoutDayType[];

  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutDayType {
  id: number;
  date: Date | null;
  workoutId: number | null;

  workout?: WorkoutType;
  exercises?: WorkoutExercise[];

  createdAt: Date;
  updatedAt: Date;
}

/* ============================
   📚 EXERCISE DEFINITION (Справочник)
============================= */

export interface ExerciseDefinition {
  id: number;
  name: string;
  muscleGroup: string | null;
  userId: string | null;

  exercises?: WorkoutExercise[];

  createdAt: Date;
  updatedAt: Date;

  lastExercise?: WorkoutExercise | null;
}

export type ExerciseDefinitionCreate = {
  name: string;
  muscleGroup: string;
};

/* ============================
   🟢 WORKOUT EXERCISE (выполнение)
============================= */

export interface WorkoutExercise {
  id: number;
  workoutDayId?: number | null;
  exerciseTypeId: number;

  exerciseType: ExerciseDefinition;
  setGroup: SetGroupType[];

  createdAt: Date;
  updatedAt: Date;
}

export type WorkoutExerciseCreate = {
  workoutDayId?: number | null;
  exerciseTypeId: number;
};

export interface ExerciseApiItem {
  exerciseType: {
    id: number;
    name: string;
    muscleGroup: string | null;
    userId: string | null;
    createdAt: string;
    updatedAt: string;
  };
  exercise: WorkoutExercise | null; // можешь описать глубже, если хочешь
}

/* ============================
   📦 SET GROUP
============================= */

export interface SetGroupType {
  id: number;
  exerciseId: number;

  sets: SetType[];

  createdAt: Date;
  updatedAt: Date;
}

export interface SetGroupCreateType {
  sets?: SetCreateType[];
}

/* ============================
   🟣 SET
============================= */

export interface SetType {
  id: number;
  type: string;
  order: number;

  weight?: number | null;
  reps?: number | null;

  isTriSet: boolean;

  subSets: SubSetType[];
  dropSets: DropSetType[];

  setGroupId: number;

  createdAt: Date;
  updatedAt: Date;
}

export type SetCreateType = {
  type: string;
  order: number;
  weight?: number | null;
  reps?: number | null;
  isTriSet?: boolean;
  dropSets?: DropSetCreateType[];
  subSets?: SubSetCreateType[];
};

/* ============================
   🔽 DROP SET
============================= */

export interface DropSetType {
  id: number;
  parentSetId: number;

  weight?: number | null;
  reps?: number | null;
  order: number;

  createdAt: Date;
  updatedAt: Date;
}

export type DropSetCreateType = {
  weight?: number | null;
  reps?: number | null;
  order: number;
};

/* ============================
   🔼 SUB SET
============================= */

export interface SubSetType {
  id: number;
  setId: number;

  weight?: number | null;
  reps?: number | null;
  order: number;

  createdAt: Date;
  updatedAt: Date;
}

export type SubSetCreateType = {
  weight?: number | null;
  reps?: number | null;
  order: number;
};

/* ============================
   🎨 UI
============================= */

export interface DayWithColor {
  date: Date | null;
  color: string;
}

/* ============================
   🔄 Prisma Include Types
============================= */

export type WorkoutDayWithExercises = Prisma.WorkoutDayGetPayload<{
  include: {
    exercises: {
      include: {
        exerciseType: true;
        setGroup: {
          include: {
            sets: {
              include: {
                subSets: true;
                dropSets: true;
              };
            };
          };
        };
      };
    };
    workout: true;
  };
}>;
