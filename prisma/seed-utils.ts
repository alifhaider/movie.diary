import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import { faker } from '@faker-js/faker'
import { prisma } from '~/db.server'
import { memoizeUnique } from '~/tests/memoize-unique'
import { fileURLToPath } from 'url'

// const __dirname = path.dirname(fileURLToPath(import.meta.url));
// export const fixturesDirPath = path.join(__dirname, `../tests/fixtures`);
const unique = memoizeUnique(faker.internet.userName)

export function createUser() {
	const firstName = faker.person.firstName()
	const lastName = faker.person.lastName()

	const username = unique({
		firstName: firstName.toLowerCase(),
		lastName: lastName.toLowerCase(),
	})

	return {
		username,
		email: `${username}@example.com`,
	}
}

export function createMovie() {
	return {
		title: faker.word.noun({ length: { min: 5, max: 7 } }),
		description: faker.lorem.paragraph(),
		releaseDate: faker.date.past({ years: 10 }).toISOString(),
		imdbLink: faker.internet.url(),
	}
}

export function createNote() {
	return {
		content: faker.lorem.paragraph(),
	}
}

export function createPassword(username: string = faker.internet.userName()) {
	return {
		hash: bcrypt.hashSync(username, 10),
	}
}

// export async function insertImage(imagePath: string) {
//   const image = await prisma.image.create({
//     data: await createImageFromFile(imagePath),
//     select: { fileId: true },
//   });
//   return image.fileId;
// }

// export async function createImageFromFile(imagePath: string) {
//   const extension = path.extname(imagePath);
//   return {
//     contentType: `image/${extension.slice(1)}`,
//     file: {
//       create: {
//         blob: await fs.promises.readFile(imagePath),
//       },
//     },
//   };
// }

// export function getImagePath(
//   type: "user" | "movie",
//   number: number = faker.number.int({ min: 1, max: 10 })
// ) {
//   const imageIndex = number % 10;
//   return path.join(fixturesDirPath, "images", type, `${imageIndex}.png`);
// }
