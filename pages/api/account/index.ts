import {NextApiRequest, NextApiResponse} from "next";
import {verifyAuth} from "../../../lib/authServer";

/**
 * Endpoint to verify the authentication
 * @param req
 * @param res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const payload = await verifyAuth(req, res);
  return res.status(200).json(payload);
}