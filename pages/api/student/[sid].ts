import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../lib/auth";
import {JWTPayload} from "jose";
import {PrismaClient} from "@prisma/client";

/**
 * Teacher deletes student account
 * @param req
 * @param res
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const {sid} = req.query;
  const stud_id = Number.parseInt(sid.toString())

  if (tokenPayload.role === 'teacher') {
    const prisma = new PrismaClient();

    const teacher = await prisma.user.update({
      where: {id: tokenPayload.user_id as number},
      data: {
        students: {
          disconnect: {id: stud_id}
        }
      },
      include: {students: true}
    });

    if (!teacher) return res.status(404).json({});

    return res.status(200).json(teacher.students);
  } else {
    return res.status(401).json({error: 'unauthorized'});
  }
}

/**
 * Routes the request the appropriate handler
 * @param req
 * @param res
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // handling each request in particular handler
  switch (req.method) {
    case 'DELETE':
      return handleDelete(req, res);
  }

  // Invalid method
  return res.status(404).json({error: 'not found'});
}