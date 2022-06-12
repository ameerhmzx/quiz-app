import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../lib/auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = await verifyAuth(req, res);
  return res.status(200).json(payload);
}