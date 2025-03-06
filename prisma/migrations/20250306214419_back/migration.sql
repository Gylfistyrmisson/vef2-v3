/*
  Warnings:

  - The `answers` column on the `Question` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `rightAnswer` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "rightAnswer" INTEGER NOT NULL,
DROP COLUMN "answers",
ADD COLUMN     "answers" TEXT[];
