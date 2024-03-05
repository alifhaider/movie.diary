/*
  Warnings:

  - You are about to drop the column `description` on the `Movie` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Movie" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "plot" TEXT,
    "releaseDate" DATETIME,
    "imdbLink" TEXT,
    "poster" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Movie" ("createdAt", "id", "imdbLink", "poster", "releaseDate", "title", "updatedAt") SELECT "createdAt", "id", "imdbLink", "poster", "releaseDate", "title", "updatedAt" FROM "Movie";
DROP TABLE "Movie";
ALTER TABLE "new_Movie" RENAME TO "Movie";
CREATE UNIQUE INDEX "Movie_id_key" ON "Movie"("id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
