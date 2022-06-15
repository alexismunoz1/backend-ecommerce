import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "utils/middlewares";
import { createOrder } from "controllers/orderController";
import method from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup.object().shape({
   aditionalInfo: yup.string(),
});

const querySchema = yup.object().shape({
   productId: yup.string().required("productId is required"),
});

async function post(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const { productId } = await querySchema.validate(req.query);
      const aditionalInfo = await bodySchema.validate(req.body);

      const initPoint = await createOrder({ productId, userId, aditionalInfo });
      res.status(200).send({ initPoint });
   } catch (err) {
      res.status(404).json({ err });
   }
}

export default method({ post: authMiddleware(post) });
