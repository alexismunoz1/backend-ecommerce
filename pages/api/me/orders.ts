import type { NextApiRequest, NextApiResponse } from "next";
import { getUserOrders } from "controllers/userController";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";

async function get(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const userOrders = await getUserOrders(userId);
      res.status(200).send({ userOrders });
   } catch (error) {
      res.status(404).json({ error });
   }
}

export default method({ get: authMiddleware(get) });
