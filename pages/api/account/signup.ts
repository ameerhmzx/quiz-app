import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";
import {SignJWT} from "jose";
import {nanoid} from "nanoid";
import {PrismaClientKnownRequestError} from "@prisma/client/runtime";

type Data = {
  token?: string,
  error?: string,
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  // Rejecting every request other than POST.
  if (req.method !== 'POST') {
    return res.status(400).json({error: `${req.method} method not allowed.`});
  }

  // Verifying request contains body parameters
  if (!req.body || !('email' in req.body) || !('password' in req.body) || !('name' in req.body)) {
    return res.status(400).json({error: 'name, email and password is required for registration.'});
  }

  // validate name
  if (req.body.name.length <= 0) {
    return res.status(400).json({error: 'invalid name'});
  }

  // Validating email address
  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(req.body.email)) {
    return res.status(400).json({error: 'invalid email address'});
  }

  // Validate password
  if (req.body.password.length < 6) {
    return res.status(400).json({error: 'password must contains at least 6 characters'});
  }

  const prisma = new PrismaClient()
  try {
    // Creating new user
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: 'teacher'
      }
    })

    // User created
    // sign and returns the JWT token
    const token = await new SignJWT({
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    })
      .setProtectedHeader({alg: 'HS256'})
      .setJti(nanoid())
      .setIssuedAt()
      .sign(new TextEncoder().encode(process.env.JWT_SECRET_KEY))

    res.status(201).json({token})
  } catch (err) {
    if (err instanceof PrismaClientKnownRequestError)
      if (err.code == 'P2002')
        return res.status(409).json({error: 'user already exists, try signing in.'});
    return res.status(500).json({error: 'its not your fault, something went wrong in our server.'});
  }
}