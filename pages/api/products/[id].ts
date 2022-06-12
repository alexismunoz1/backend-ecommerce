import type { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "controllers/productsController";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup
   .object()
   .shape({
      id: yup.string().required(),
   })
   .noUnknown(true)
   .strict();

async function get(req: NextApiRequest, res: NextApiResponse) {
   const { id } = req.query;
   try {
      await querySchema.validate(req.query);
      const product = await getProductById(id as string);
      res.status(200).json({ product });
   } catch (err) {
      res.status(404).json({ message: err });
   }
}

const handler = method({ get });

export default authMiddleware(handler);
