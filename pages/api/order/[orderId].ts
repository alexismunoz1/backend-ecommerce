import type { NextApiRequest, NextApiResponse } from "next";
import { getOrderById } from "controllers/orderController";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup
   .object()
   .shape({
      orderId: yup.string().required(),
   })
   .noUnknown(true)
   .strict();

async function getOrder(req: NextApiRequest, res: NextApiResponse) {
   try {
      const order = await getOrderById(req.query.orderId as string);
      res.status(200).send(order);
   } catch (error) {
      res.status(404).json({ error });
   }
}

const handler = method({ get: authMiddleware(getOrder) });
export default valideteMiddleware(querySchema, handler, "query");
