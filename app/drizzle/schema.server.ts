import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// user can mark a movie as watched or to watch next
// user can create a suggestion list for other users

export const session = sqliteTable('session', {
	id: integer('id').primaryKey(),
	userId: integer('userId').notNull(),
	token: text('token').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const movie = sqliteTable('movie', {
	id: integer('id').primaryKey(),
	title: text('title').notNull(),
	description: text('description'),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const watched = sqliteTable('watched', {
	// id: integer('id').primaryKey().generatedAlwaysAs,
	userId: integer('userId').notNull(),
	movieId: integer('movieId').notNull(),
	watchedAt: text('watchedAt').notNull(),
	note: text('note'),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const watchNext = sqliteTable('watchNext', {
	id: integer('id').primaryKey(),
	userId: integer('userId').notNull(),
	movieId: integer('movieId').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const genre = sqliteTable('genre', {
	id: integer('id').primaryKey(),
	name: text('name').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const movieActor = sqliteTable('movieActor', {
	id: integer('id').primaryKey(),
	movieId: integer('movieId').notNull(),
	actorId: integer('actorId').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const watchedMovie = sqliteTable('watchedMovie', {
	id: integer('id').primaryKey(),
	userId: integer('userId').notNull(),
	movieId: integer('movieId').notNull(),
	watchedAt: text('watchedAt').notNull(),
	note: text('note'),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const watchNextMovie = sqliteTable('watchNextMovie', {
	id: integer('id').primaryKey(),
	userId: integer('userId').notNull(),
	movieId: integer('movieId').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

// user can create a movie suggestion list for other users

export const movieSuggestion = sqliteTable('movieSuggestion', {
	id: integer('id').primaryKey(),
	userId: integer('userId').notNull(),
	movieId: integer('movieId').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})

export const movieSuggestionList = sqliteTable('movieSuggestionList', {
	id: integer('id').primaryKey(),
	userId: integer('userId').notNull(),
	movieSuggestionId: integer('movieSuggestionId').notNull(),
	createdAt: text('createdAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: text('updatedAt')
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
})
