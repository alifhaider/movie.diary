# Movie-Diary App

Track your watched Movies

## Setup
To set up the project, you can run the following command:

```sh
npm install
npm run setup
```

This command performs the following tasks:

- `prisma generate:` This command reads your Prisma schema and generates the Prisma Client code. Prisma Client is an auto-generated and type-safe query builder for Node.js & TypeScript.

- `prisma migrate deploy:` This command applies the database schema changes. It's a way to keep your database schema in sync with the Prisma schema.

- `prisma db seed:` This command seeds your database. It's a way to populate your database with initial data. I already have a seed script to populate db

Please ensure that you have the Prisma CLI installed and configured before running this command.

## Development

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app
server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`
