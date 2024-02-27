import { prisma } from "~/db.server";
import bcrypt from "bcryptjs";
import {
  createMovie,
  createNote,
  createPassword,
  createUser,
} from "./seed-utils";
import { faker } from "@faker-js/faker";

async function seed() {
  console.log("🌱 Seeding...");
  console.time(`🌱 Database has been seeded`);

  console.time("🧹 Cleaned up the database...");
  await prisma.user.deleteMany({ where: {} });
  await prisma.movie.deleteMany({ where: {} });
  await prisma.note.deleteMany({ where: {} });
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

  const totdalUsers = 20;
  console.time(`✅ Created ${totdalUsers} users...`);
  const users = await Promise.all(
    Array.from({ length: totdalUsers }, async (_, index) => {
      const userData = createUser();
      const user = await prisma.user.create({
        data: {
          ...userData,
          watchedMovies: {
            connect: faker.helpers
              .shuffle(movies)
              .slice(0, 5)
              .map((movie) => ({
                id: movie.id,
              })),
          },
          watchNextMovies: {
            connect: faker.helpers
              .shuffle(movies)
              .slice(0, 5)
              .map((movie) => ({
                id: movie.id,
              })),
          },
          notes: {
            create: faker.helpers
              .shuffle(movies)
              .slice(0, 5)
              .map((movie) => ({
                ...createNote(),
                movie: {
                  connect: {
                    id: movie.id,
                  },
                },
              })),
          },
          password: {
            create: { ...createPassword(userData.username) },
          },
        },
      });
      return user;
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
