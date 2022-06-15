import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "utils/middlewares";
import { getUserOrders } from "controllers/userController";
import method from "micro-method-router";

async function get(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const userOrders = await getUserOrders(userId);
      res.status(200).send({ userOrders });
   } catch (err) {
      res.status(404).json({ err });
   }
}

export default method({ get: authMiddleware(get) });
