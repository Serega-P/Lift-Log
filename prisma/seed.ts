import { prisma } from './prisma-client';
// import { hashSync } from 'bcrypt';

async function down() {
  console.log("Deleting all data...");

  await prisma.subSet.deleteMany({});
  await prisma.set.deleteMany({});
  await prisma.sets.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.workoutDay.deleteMany({});
  await prisma.workout.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Data deleted!");
}

async function up() {
  console.log("All data successfully added!");
}

async function main() {
  try {
    await down();
    await up();
  } catch (e) {
    console.error("Error during seed execution:", e);
  } finally {
    await prisma.$disconnect();
  }
}

main();