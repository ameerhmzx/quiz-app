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
    case 'DELETE':
      return handleDelete(req, res);
  }

  // Invalid method
  return res.status(404).json({error: 'not found'});
}

/**
 * Deleted the student's result
 * @param req
 * @param res
 */
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;
  const {rid} = req.query;
  const res_id = Number.parseInt(rid.toString());

  if (tokenPayload.role === 'teacher') {
    // Teacher
    let deleted = await prisma.result.delete({
      where: {id: res_id}
    });

    if (!deleted) return res.status(404).json({});
    return res.status(200).json(deleted);
  } else {
    return res.status(401).json({error: 'unauthorized'});
  }
}
