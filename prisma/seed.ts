import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import {
  createMovie,
  createNote,
  createPassword,
  createUser,
} from "./seed-utils";
import { faker } from "@faker-js/faker";
import { connect } from "node:http2";

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.user.deleteMany({ where: {} });
  await prisma.movie.deleteMany({ where: {} });
  await prisma.password.deleteMany({ where: {} });
  await prisma.watchedMovie.deleteMany({ where: {} });
  await prisma.watchNextMovie.deleteMany({ where: {} });

  console.timeEnd("🧹 Cleaned up the database...");

  const totalMovies = 100;
  console.time(`✅ Created ${totalMovies} movies...`);

  const movies = await Promise.all(
    Array.from({ length: totalMovies }, async (_, index) => {
      const movie = await prisma.movie.create({
        data: {
          ...createMovie(),
        },
      });
      return movie;
    })
  );
  console.timeEnd(`✅ Created ${totalMovies} movies...`);

  const shuffledMovies = faker.helpers.shuffle(movies);
  const watchedMovies = shuffledMovies.slice(0, 5);
  const watchNextMovies = shuffledMovies.slice(5, 10);
 
  const createUserWithMovies = async () => {
    const userData = createUser();
    const user = await prisma.user.create({
      data: {
        ...userData,
        watchedMovies: {
          create: watchedMovies.map((movie) => ({
            movieId: faker.helpers.arrayElement(movies).id,
            watchedAt: faker.date.between({
              from: new Date(2020, 1, 1),
              to: new Date(),
            }),
          })),
        },
        watchNextMovies: {
          create: watchNextMovies
            .map((movie) => ({
              movieId: faker.helpers.arrayElement(movies).id,
            })),
        },
        password: {
          create: { ...createPassword(userData.username) },
        },
      },
    });
    return user;
  };

  const totdalUsers = 20;
  console.time(`✅ Created ${totdalUsers} users...`);
  const users = await Promise.all(
    Array.from({ length: totdalUsers }, async () => {
      return await createUserWithMovies();
    })
  );
  console.timeEnd(`✅ Created ${totdalUsers} users...`);


  await prisma.user.create({
    data: {
      email: "alif@haider.dev",
      username: "alif",
      password: {
        create: {
          hash: await bcrypt.hash("alif", 10),
        },
      },
    },
  });

  console.timeEnd(`🌱 Database has been seeded`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
