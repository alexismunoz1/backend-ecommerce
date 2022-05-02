import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "lib/middlewares";
import { getUserById } from "controllers/user";

async function handler(req: NextApiRequest, res: NextApiResponse, token) {
   const user = getUserById(token.userId);
   res.send(user);
}

export default authMiddleware(handler);
