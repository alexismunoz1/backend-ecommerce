import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";
import { updateOrderStatus } from "controllers/orderController";

async function post(req: NextApiRequest, res: NextApiResponse) {
   const { id, topic } = req.query;

   try {
      if (topic == "merchant_order") {
         const order = await updateOrderStatus(id as string);
         res.status(200).send({ order, topic });
      }
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({ post: authMiddleware(post) });
