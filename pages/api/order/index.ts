import type { NextApiRequest, NextApiResponse } from "next";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { createOrder } from "controllers/orderController";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup
   .object()
   .shape({
      productId: yup.string().required("'productId' is required"),
   })
   .noUnknown(true)
   .strict();

async function postOrder(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const productId = req.query.productId as string;
      const aditionalInfo = req.body;
      const initPoint = await createOrder({ productId, userId, aditionalInfo });
      res.status(200).send({ initPoint });
   } catch (error) {
      res.status(404).json({ error });
   }
}

const handler = method({ post: authMiddleware(postOrder) });
export default valideteMiddleware(querySchema, handler, "query");
