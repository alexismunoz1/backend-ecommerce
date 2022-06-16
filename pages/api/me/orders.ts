import type { NextApiResponse } from "next";
import { getUserOrders } from "controllers/userController";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";

async function get(res: NextApiResponse, userId: string) {
   try {
      const userOrders = await getUserOrders(userId);
      res.status(200).send({ userOrders });
   } catch (err) {
      res.status(404).json({ err });
   }
}

export default method({ get: authMiddleware(get) });
