/*
  Warnings:

  - You are about to drop the `StudenQuiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudenQuiz" DROP CONSTRAINT "StudenQuiz_quizId_fkey";

-- DropForeignKey
ALTER TABLE "StudenQuiz" DROP CONSTRAINT "StudenQuiz_studentId_fkey";

-- DropTable
DROP TABLE "StudenQuiz";

-- CreateTable
CREATE TABLE "StudentQuiz" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "obtainedMarks" INTEGER,

    CONSTRAINT "StudentQuiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "StudentQuiz" ADD CONSTRAINT "StudentQuiz_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentQuiz" ADD CONSTRAINT "StudentQuiz_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
