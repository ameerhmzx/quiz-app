import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../lib/auth";
import {JWTPayload} from "jose";
import {PrismaClient} from "@prisma/client";


/**
 * Routes the request the appropriate handler
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // handling each request in particular handler
  switch (req.method) {
    case 'GET':
      return handleGet(req, res);
    case 'PUT':
      return handlePut(req, res);
    case 'DELETE':
      return handleDelete(req, res);
    case 'POST':
      return handlePost(req, res);
  }

  // Invalid method
  return res.status(404).json({error: 'not found'});
}

/**
 * Students Post Answers
 * @param req
 * @param res
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const prisma = new PrismaClient()
  const {qid} = req.query;
  const quiz_id = Number.parseInt(qid.toString())

  if ('user_id' in tokenPayload) {
    if (tokenPayload.role === 'student') {

      if (!req.body || !req.body.answers) {
        return res.status(400).json({status: 'required parameters missing'});
      }

      const quiz = await prisma.quiz.findUnique({
        where: {id: quiz_id},
        include: {questions: true}
      });

      if (!quiz) return res.status(404).json({status: 'not found.'})

      type Answer = {
        questionId: number,
        selected?: number,
      };

      try {
        let obtainedMarks = 0;
        let answers = req.body.answers as Answer[];
        let totalMarks = quiz.questions.length;

        for (let answer of answers) {
          let question = quiz.questions.find((question) => question.id === answer.questionId);
          if (question && question.answer === answer.selected)
            obtainedMarks++;
        }

        let updated = await prisma.studentQuiz.updateMany({
          where: {studentId: req.body.user_id as number, quizId: quiz_id},
          data: {
            obtainedMarks: obtainedMarks,
            totalMarks: totalMarks
          }
        });

        return res.status(201).json({updated});

      } catch (err) {
        return res.status(400).json({error: 'invalid parameters'});
      }
    } else {
      return res.status(401).json({error: 'unauthorized'});
    }
  }
  return res.status(500).json({});
}

/**
 * Returns the quiz details
 * also avoids answers in case of student's request.
 * @param req
 * @param res
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const prisma = new PrismaClient()
  const {qid} = req.query;
  const quiz_id = Number.parseInt(qid.toString())

  if ('user_id' in tokenPayload) {
    if (tokenPayload.role === 'teacher') {
      const quiz = await prisma.quiz.findFirst({
        where: {id: quiz_id, teacherId: tokenPayload.user_id as number},
        include: {questions: true}
      });

      if (!quiz) return res.status(404).json({status: 'not found.'})

      return res.status(200).json(quiz);
    } else {
      const studentQuiz = await prisma.studentQuiz.findFirst({
        where: {quizId: quiz_id, studentId: tokenPayload.user_id as number}
      });

      if (!studentQuiz) return res.status(404).json({status: 'not found.'})

      const quiz = await prisma.quiz.findFirst({
        where: {id: quiz_id},
        include: {questions: true}
      });

      if (!quiz) return res.status(404).json({status: 'not found.'})
      let questions = quiz.questions.map((question) => ({...question, answer: undefined}));

      return res.status(200).json({...quiz, questions: questions});
    }
  }
  return res.status(500).json({});
}

/**
 * Deletes the quiz and cascades the relations
 * @param req
 * @param res
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const prisma = new PrismaClient()
  const {qid} = req.query;
  const quiz_id = Number.parseInt(qid.toString())

  const quiz = await prisma.quiz.findUnique({
    where: {id: quiz_id},
  });

  if (!quiz) return res.status(404).json({status: 'not found.'})

  if ('user_id' in tokenPayload) {
    if (tokenPayload.role === 'teacher' && tokenPayload.user_id === quiz.teacherId) {
      let deleted = await prisma.quiz.delete({
        where: {id: quiz_id}
      });

      return res.status(200).json(deleted);
    } else {
      // Only owner can delete a Quiz
      return res.status(401).json({error: 'unauthorized'});
    }
  }
  return res.status(500).json({});
}

/**
 * Updates the quiz
 * @returns updated quiz
 * @param req
 * @param res
 */
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const prisma = new PrismaClient()
  const {qid} = req.query;
  const quiz_id = Number.parseInt(qid.toString())

  const quiz = await prisma.quiz.findUnique({
    where: {id: quiz_id},
  });

  if (!quiz) return res.status(404).json({status: 'not found.'})

  if ('user_id' in tokenPayload) {
    if (tokenPayload.role === 'teacher' && tokenPayload.user_id === quiz.teacherId) {

      if (!req.body) {
        return res.status(400).json({status: 'required parameters missing'});
      }

      try {
        // Verify deleting valid questions
        let questions = req.body.questions.filter((question: any) => question.quizId === quiz_id);
        questions = questions.map((q: any) => {
          delete q.quizId;
          return q
        });

        await prisma.question.deleteMany({
          where: {quizId: quiz_id}
        });

        let updated = await prisma.quiz.update({
          where: {id: quiz_id},
          data: {
            name: req.body.name,
            questions: {
              createMany: {
                data: questions
              }
            }
          },
          include: {
            questions: true
          }
        });

        return res.status(200).json({updated});
      } catch (err) {
        console.log(err)
        return res.status(400).json({status: 'invalid body parameters'});
      }
    } else {
      // Only owner can delete a Quiz
      return res.status(401).json({error: 'unauthorized'});
    }
  }
  return res.status(500).json({});
}
