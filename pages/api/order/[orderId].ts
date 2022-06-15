import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "utils/middlewares";
import { getOrderById } from "controllers/orderController";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup.object().shape({ orderId: yup.string().required() });

async function get(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { orderId } = await querySchema.validate(req.query);
      const order = await getOrderById(orderId as string);
      res.status(200).send({ order });
   } catch (err) {
      res.status(404).json({ err });
   }
}

export default method({ get: authMiddleware(get) });
