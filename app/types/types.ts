export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// Пользователь
export interface UserType {
  id: number;
  fullName: string;
  email: string;
	image?: string;
  password: string;
  role: UserRole;
  emailVerified?: string | null;
	provider: string;
  workouts: WorkoutType[];
}

// Тренировка
export interface WorkoutType {
  id?: number | string;
  title: string;
  color: string;
  userId: number;
  user: UserType;
  days: WorkoutDayType[];
	exercises: ExerciseType[];
}

// День тренировки
export interface WorkoutDayType {
  id?: number;
  date: string;
  workoutId: number;
  workout: WorkoutType;
  exercises: ExerciseType[];
}

// Упражнение
export interface ExerciseType {
  id?: number;
  name: string;
  workoutId: number;
  dayExercises: number;
	setGroup: SetGroupType[];
  workout: WorkoutType;
  dayExercise: WorkoutDayType;
}

// Группа сетов (может включать обычные сеты или трисеты)
export interface SetGroupType {
  id?: number;
  exerciseId: number;
  exercise: ExerciseType | null;
  sets: SetType[];
}

// Обычный сет
export interface SetType {
  id?: number;
  type: string;
	order: number;
  setGroupId?: number;
	isTriSet: boolean;
	subSets: SubSetType[];
  weight?: number | string;
  reps?: number | string;
}

export interface SubSetType {
  id?: number;
  setId: number;
  set: SetType[];
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

