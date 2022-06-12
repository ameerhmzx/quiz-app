import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../lib/auth";
import {JWTPayload} from "jose";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

/**
 * Teacher Get student accounts
 * @param req
 * @param res
 */
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;

  if (tokenPayload.role === 'teacher') {
    const prisma = new PrismaClient();

    const teacher = await prisma.user.findUnique({
      where: {id: tokenPayload.user_id as number},
      include: {students: true}
    });

    if (!teacher) return res.status(404).json({});

    const students = teacher.students.map((student: any) => {
      delete student.password;
      return student;
    });

    return res.status(200).json(students);
  } else {
    return res.status(401).json({error: 'unauthorized'});
  }
}


/**
 * Teacher create student account
 * @param req
 * @param res
 */
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
  const tokenPayload = await verifyAuth(req, res) as JWTPayload;

  if (tokenPayload.role === 'teacher') {

    // Verifying parameters
    if (!req.body) {
      return res.status(400).json({error: 'missing required parameters'});
    }

    type Student = {
      name: string,
      email: string,
    }
    const student = req.body as Student;
    const prisma = new PrismaClient();

    try {
      let studentExisted = await prisma.user.findFirst({
        where: {email: student.email, role: 'student'}
      });

      if (!studentExisted) {
        studentExisted = await prisma.user.create({
          data: {
            name: student.name,
            email: student.email,
            password: bcrypt.hashSync('123456', 8),
            role: 'student',
          },
        });
      }

      const updated = await prisma.user.update({
        where: {id: tokenPayload.user_id as number},
        data: {
          students: {
            connect: {id: studentExisted.id}
          }
        },
        include: {
          students: true
        }
      });

      const students = updated.students.map((student: any) => {
        delete student.password;
        return student;
      });

      return res.status(201).json(students);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          return res.status(409).json({error: 'email already registered by a teacher.'});
        }
      }
      return res.status(500).json({});
    }
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
    case 'GET':
      return handleGet(req, res);
    case 'POST':
      return handlePost(req, res);
  }

  // Invalid method
  return res.status(404).json({error: 'not found'});
}