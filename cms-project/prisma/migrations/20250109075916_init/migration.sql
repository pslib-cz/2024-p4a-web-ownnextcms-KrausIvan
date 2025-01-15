/*
  Warnings:

  - The primary key for the `Authenticator` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `credentialID` on the `Authenticator` table. All the data in the column will be lost.
  - Added the required column `credentialId` to the `Authenticator` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Authenticator" (
    "credentialId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "credentialPublicKey" TEXT NOT NULL,
    "counter" INTEGER NOT NULL,
    "credentialDeviceType" TEXT NOT NULL,
    "credentialBackedUp" BOOLEAN NOT NULL,
    "transports" TEXT,

    PRIMARY KEY ("userId", "credentialId"),
    CONSTRAINT "Authenticator_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Authenticator" ("counter", "credentialBackedUp", "credentialDeviceType", "credentialPublicKey", "providerAccountId", "transports", "userId") SELECT "counter", "credentialBackedUp", "credentialDeviceType", "credentialPublicKey", "providerAccountId", "transports", "userId" FROM "Authenticator";
DROP TABLE "Authenticator";
ALTER TABLE "new_Authenticator" RENAME TO "Authenticator";
CREATE UNIQUE INDEX "Authenticator_credentialId_key" ON "Authenticator"("credentialId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
