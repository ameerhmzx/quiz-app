// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import {SignJWT} from 'jose';
import {nanoid} from 'nanoid';
import bcrypt from 'bcryptjs';
import {prisma} from "../../../lib/db";

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
    return res.status(404).json({error: `${req.method} method not allowed.`});
  }

  // Verifying request contains body parameters
  if (!req.body || !('email' in req.body) || !('password' in req.body)) {
    return res.status(400).json({error: 'email and password is required for authentication.'});
  }

  // Getting matched user from the database
  const user = await prisma.user.findUnique({
    where: {email: req.body.email},
  })

  // check id user exists
  if (!user) {
    return res.status(401).json({error: 'email not registered.'});
  }

  // Verify the user password
  if (!bcrypt.compareSync(req.body.password, user.password)) {
    return res.status(401).json({error: 'wrong password.'});
  }

  // User's credentials verified
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

  res.status(200).json({token})
}
