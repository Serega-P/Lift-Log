import { prisma } from './prisma-client';
import { hashSync } from 'bcrypt';

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
  console.log("Creating users...");
<<<<<<< HEAD
  // const user1 = await prisma.user.create({
  //   data: {
  //     fullName: 'User Test',
  //     email: 'user@test.ru',
  //     password: hashSync('111111', 10),
  //     emailVerified: new Date(),
  //     role: 'USER',
  //   },
  // });

  // console.log("Creating workouts...");
  // const workout1 = await prisma.workout.create({
  //   data: {
  //     title: 'Full Body',
  //     color: '#FF5733',
  //     userId: user1.id,
  //   },
  // });

  // const workout2 = await prisma.workout.create({
  //   data: {
  //     title: 'Strength Training',
  //     color: '#33FF57',
  //     userId: user1.id,
  //   },
  // });

  // console.log("Creating workout days...");
  // const day1 = await prisma.workoutDay.create({
  //   data: {
  //     date: new Date('2025-01-29'),
  //     workoutId: workout1.id,
  //   },
  // });

  // const day2 = await prisma.workoutDay.create({
  //   data: {
  //     date: new Date('2025-02-01'),
  //     workoutId: workout2.id,
  //   },
  // });

  // const day3 = await prisma.workoutDay.create({
  //   data: {
  //     date: new Date('2025-02-07'),
  //     workoutId: workout2.id,
  //   },
  // });

  // console.log("Creating exercises...");
  // const exercise1 = await prisma.exercise.create({
  //   data: { workoutId: workout1.id, workoutDayId: day1.id, name: 'Push-ups' },
  // });

  // const exercise2 = await prisma.exercise.create({
  //   data: { workoutId: workout1.id, workoutDayId: day1.id, name: 'Jump Squats' },
  // });

  // const exercise3 = await prisma.exercise.create({
  //   data: { workoutId: workout2.id, workoutDayId: day2.id, name: 'Bench Press' },
  // });

  // const exercise4 = await prisma.exercise.create({
  //   data: { workoutId: workout2.id, workoutDayId: day2.id, name: 'Pull-ups' },
  // });

  // const exercise5 = await prisma.exercise.create({
  //   data: { workoutId: workout2.id, workoutDayId: day3.id, name: 'Bench Press' },
  // });

  // const exercise6 = await prisma.exercise.create({
  //   data: { workoutId: workout2.id, workoutDayId: day3.id, name: 'Pull-ups' },
  // });

  // console.log("Creating sets...");
  // const setGroup3 = await prisma.sets.create({ data: { exerciseId: exercise3.id } });
  // const setGroup4 = await prisma.sets.create({ data: { exerciseId: exercise4.id } });
  // const setGroup5 = await prisma.sets.create({ data: { exerciseId: exercise5.id } });
  // const setGroup6 = await prisma.sets.create({ data: { exerciseId: exercise6.id } });

  // const setGroups = [setGroup3, setGroup4, setGroup5, setGroup6];

  // // 1. Создаём все сеты и трисеты
  // const createdSets = [];
  // for (const setGroup of setGroups) {
  //   const setsData = [
  //     { setGroupId: setGroup.id, type: 'set', weight: 100, reps: 5, isTriSet: false, order: 1 },
  //     { setGroupId: setGroup.id, type: 'set', weight: 110, reps: 5, isTriSet: false, order: 2 },
  //     { setGroupId: setGroup.id, type: 'triset', weight: null, reps: null, isTriSet: true, order: 3 }, // TriSet без веса
  //     { setGroupId: setGroup.id, type: 'set', weight: 50, reps: 8, isTriSet: false, order: 4 },
  //   ];
  
  //   for (const setData of setsData) {
  //     const createdSet = await prisma.set.create({
  //       data: setData,
  //     });
  
  //     createdSets.push(createdSet);
  //   }
  // }
  
  // // 2. Добавляем `SubSet` только к `TriSet`
  // for (const set of createdSets) {
  //   if (set.isTriSet) {
  //     await prisma.subSet.createMany({
  //       data: [
  //         { setId: set.id, weight: 40, reps: 12, order: 1 },
  //         { setId: set.id, weight: 45, reps: 10, order: 2 },
  //         { setId: set.id, weight: 50, reps: 8, order: 3 },
  //       ],
  //     });
  //   }
  // }
=======
  const user1 = await prisma.user.create({
    data: {
      fullName: 'User Test',
      email: 'user@test.ru',
      password: hashSync('111111', 10),
      verified: new Date(),
      role: 'USER',
    },
  });

  console.log("Creating workouts...");
  const workout1 = await prisma.workout.create({
    data: {
      title: 'Full Body',
      color: '#FF5733',
      userId: user1.id,
    },
  });

  const workout2 = await prisma.workout.create({
    data: {
      title: 'Strength Training',
      color: '#33FF57',
      userId: user1.id,
    },
  });

  console.log("Creating workout days...");
  const day1 = await prisma.workoutDay.create({
    data: {
      date: new Date('2025-01-29'),
      workoutId: workout1.id,
    },
  });

  const day2 = await prisma.workoutDay.create({
    data: {
      date: new Date('2025-02-01'),
      workoutId: workout2.id,
    },
  });

  const day3 = await prisma.workoutDay.create({
    data: {
      date: new Date('2025-02-07'),
      workoutId: workout2.id,
    },
  });

  console.log("Creating exercises...");
  const exercise1 = await prisma.exercise.create({
    data: { workoutId: workout1.id, workoutDayId: day1.id, name: 'Push-ups' },
  });

  const exercise2 = await prisma.exercise.create({
    data: { workoutId: workout1.id, workoutDayId: day1.id, name: 'Jump Squats' },
  });

  const exercise3 = await prisma.exercise.create({
    data: { workoutId: workout2.id, workoutDayId: day2.id, name: 'Bench Press' },
  });

  const exercise4 = await prisma.exercise.create({
    data: { workoutId: workout2.id, workoutDayId: day2.id, name: 'Pull-ups' },
  });

  const exercise5 = await prisma.exercise.create({
    data: { workoutId: workout2.id, workoutDayId: day3.id, name: 'Bench Press' },
  });

  const exercise6 = await prisma.exercise.create({
    data: { workoutId: workout2.id, workoutDayId: day3.id, name: 'Pull-ups' },
  });

  console.log("Creating sets...");
  const setGroup3 = await prisma.sets.create({ data: { exerciseId: exercise3.id } });
  const setGroup4 = await prisma.sets.create({ data: { exerciseId: exercise4.id } });
  const setGroup5 = await prisma.sets.create({ data: { exerciseId: exercise5.id } });
  const setGroup6 = await prisma.sets.create({ data: { exerciseId: exercise6.id } });

  const setGroups = [setGroup3, setGroup4, setGroup5, setGroup6];

  // 1. Создаём все сеты и трисеты
  const createdSets = [];
  for (const setGroup of setGroups) {
    const setsData = [
      { setGroupId: setGroup.id, type: 'set', weight: 100, reps: 5, isTriSet: false, order: 1 },
      { setGroupId: setGroup.id, type: 'set', weight: 110, reps: 5, isTriSet: false, order: 2 },
      { setGroupId: setGroup.id, type: 'triset', weight: null, reps: null, isTriSet: true, order: 3 }, // TriSet без веса
      { setGroupId: setGroup.id, type: 'set', weight: 50, reps: 8, isTriSet: false, order: 4 },
    ];
  
    for (const setData of setsData) {
      const createdSet = await prisma.set.create({
        data: setData,
      });
  
      createdSets.push(createdSet);
    }
  }
  
  // 2. Добавляем `SubSet` только к `TriSet`
  for (const set of createdSets) {
    if (set.isTriSet) {
      await prisma.subSet.createMany({
        data: [
          { setId: set.id, weight: 40, reps: 12, order: 1 },
          { setId: set.id, weight: 45, reps: 10, order: 2 },
          { setId: set.id, weight: 50, reps: 8, order: 3 },
        ],
      });
    }
  }
>>>>>>> 95a5d6c282f7157bde0eaf63dd1b509c73ffbfe4




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