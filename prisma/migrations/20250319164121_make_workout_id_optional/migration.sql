-- DropForeignKey
ALTER TABLE "exercises" DROP CONSTRAINT "exercises_workoutId_fkey";

-- AlterTable
ALTER TABLE "exercises" ALTER COLUMN "workoutId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "workouts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
