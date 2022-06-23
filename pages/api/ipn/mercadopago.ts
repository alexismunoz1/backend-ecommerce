import type { NextApiRequest, NextApiResponse } from "next";
import { updateOrderStatus } from "controllers/orderController";
import method from "micro-method-router";

async function post(req: NextApiRequest, res: NextApiResponse) {
   try {
      if (req.query.topic == "merchant_order") {
         const order = await updateOrderStatus(req.query.id as string);
         res.status(200).send(order);
      }
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({ post });
