import {NextApiRequest, NextApiResponse} from "next";
import {JWTPayload} from "jose";
import {prisma} from "../../../../../lib/db";
import {verifyAuth} from "../../../../../lib/authServer";

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
  }

  // Invalid method
  return res.status(404).json({error: 'not found'});
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const {qid} = req.query;
  const quiz_id = Number.parseInt(qid.toString());

  if (tokenPayload.role === 'teacher') {
    // Teacher
    let quiz = await prisma.quiz.findFirst({
      where: {id: quiz_id, teacherId: tokenPayload.user_id as number},
      include: {
        results: {
          include: {
            student: {
              select: {name: true}
            }
          }
        },
      }
    });

    if (!quiz) return res.status(404).json({});

    let results = quiz.results.map((result) => {
      return {
        id: result.id,
        name: result.student.name,
        submittedAt: result.createdAt,
        obtainedMarks: result.obtainedMarks,
        totalMarks: result.totalMarks,
      }
    });
    return res.status(200).json({name: quiz.name, results: results});
  } else {
    return res.status(401).json({error: 'unauthorized'});
  }
}
