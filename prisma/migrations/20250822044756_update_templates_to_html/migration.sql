/*
  Warnings:

  - You are about to drop the column `structure` on the `ResumeTemplate` table. All the data in the column will be lost.
  - Added the required column `cssStyles` to the `ResumeTemplate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `htmlContent` to the `ResumeTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ResumeTemplate" DROP COLUMN "structure",
ADD COLUMN     "cssStyles" TEXT NOT NULL,
ADD COLUMN     "htmlContent" TEXT NOT NULL;
