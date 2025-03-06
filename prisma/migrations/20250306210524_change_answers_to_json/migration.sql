/*
  Warnings:

  - You are about to drop the column `rightAnswer` on the `Question` table. All the data in the column will be lost.
  - Changed the type of `answers` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Question" DROP COLUMN "rightAnswer",
DROP COLUMN "answers",
ADD COLUMN     "answers" JSONB NOT NULL;
