import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../lib/authServer";
import {PrismaClient} from "@prisma/client";
import {JWTPayload} from "jose";

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
    case 'POST':
      return handlePost(req, res);
  }

  // Invalid method
  return res.status(404).json({error: 'not found'});
}

/**
 * @returns created quiz for teachers and assigned quiz to students
 * @param req
 * @param res
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;

  if ('user_id' in tokenPayload) {
    const prisma = new PrismaClient()
    if (tokenPayload.role === 'teacher') {
      const user = await prisma.user.findUnique({
        where: {id: tokenPayload.user_id as number},
        include: {
          quiz: true
        }
      })

      if (!user) return res.status(500).json({});
      return res.status(200).json(user.quiz);
    } else {
      // Student getting assigned quizzes

      const user = await prisma.user.findUnique({
        where: {id: tokenPayload.user_id as number},
        include: {
          teachers: {
            include: {
              quiz: true
            }
          },
          results: true,
        }
      });

      if (!user) return res.status(404).json({});

      let quizzes = user.teachers.map((teacher: any) => {
        return {
          name: teacher.name,
          quiz: teacher.quiz,
          result: user.results.find((res) => res.quizId === teacher.quiz.id)
        }
      });

      return res.status(200).json(quizzes);
    }
  }
  return res.status(500).json({});
}

/**
 * Creates new Quiz
 * @return created Quiz
 * @param req
 * @param res
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;

  if ('user_id' in tokenPayload && tokenPayload.user_id) {
    const prisma = new PrismaClient();
    if (tokenPayload.role === 'teacher') {

      // Verifying parameters
      if (!req.body || !req.body.name || !req.body.questions) {
        return res.status(400).json({error: 'missing required parameters'});
      }

      // Verifying quiz name
      if (req.body.name.trim() === "") {
        return res.status(400).json({error: 'name cannot be empty'});
      }

      // Verifying quiz questions
      if (req.body.questions.length === 0) {
        return res.status(400).json({error: 'quiz must contain at least 1 question'});
      }

      // Creating new quiz
      try {
        type Question = {
          title: string,
          option1: string,
          option2: string,
          option3: string,
          option4: string,
          answer: number
        };

        let questions: Question[] = req.body.questions;

        const quiz = await prisma.quiz.create({
          data: {
            teacherId: tokenPayload.user_id as number,
            name: req.body.name,
            questions: {
              createMany: {
                data: questions
              }
            }
          }
        });

        return res.status(201).json(quiz);
      } catch (e) {
        return res.status(400).json({error: 'data not formatted correctly'});
      }

    } else {
      // Students are not allowed to create any quiz
      return res.status(401).json({error: 'unauthorized'});
    }
  }
  // Handling Unknown error
  return res.status(500).json({});
}
