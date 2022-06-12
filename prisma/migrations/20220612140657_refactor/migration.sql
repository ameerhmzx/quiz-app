/*
  Warnings:

  - You are about to drop the `StudentQuiz` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StudentQuiz" DROP CONSTRAINT "StudentQuiz_quizId_fkey";

-- DropForeignKey
ALTER TABLE "StudentQuiz" DROP CONSTRAINT "StudentQuiz_studentId_fkey";

-- DropTable
DROP TABLE "StudentQuiz";

-- CreateTable
CREATE TABLE "Result" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "obtainedMarks" INTEGER,
    "totalMarks" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_teacherStudent" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Result_quizId_studentId_key" ON "Result"("quizId", "studentId");

-- CreateIndex
CREATE UNIQUE INDEX "_teacherStudent_AB_unique" ON "_teacherStudent"("A", "B");

-- CreateIndex
CREATE INDEX "_teacherStudent_B_index" ON "_teacherStudent"("B");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teacherStudent" ADD CONSTRAINT "_teacherStudent_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_teacherStudent" ADD CONSTRAINT "_teacherStudent_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
