/*
  Warnings:

  - A unique constraint covering the columns `[quizId,studentId]` on the table `StudentQuiz` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "StudentQuiz" ADD COLUMN     "totalMarks" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "StudentQuiz_quizId_studentId_key" ON "StudentQuiz"("quizId", "studentId");
