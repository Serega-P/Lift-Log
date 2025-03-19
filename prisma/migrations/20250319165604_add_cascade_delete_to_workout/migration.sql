-- DropForeignKey
ALTER TABLE "workout_days" DROP CONSTRAINT "workout_days_workoutId_fkey";

-- AlterTable
ALTER TABLE "workout_days" ALTER COLUMN "workoutId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "workout_days" ADD CONSTRAINT "workout_days_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
