/*
  Warnings:

  - You are about to drop the column `answers` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `Question` table. All the data in the column will be lost.
  - Added the required column `data` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "answers",
DROP COLUMN "question",
ADD COLUMN     "data" JSONB NOT NULL;
