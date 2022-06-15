import type { NextApiRequest, NextApiResponse } from "next";
import { getProductById } from "controllers/productsController";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup.object().shape({ id: yup.string().required() });

async function get(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { id } = await querySchema.validate(req.query);
      const product = await getProductById(id);
      res.status(200).json({ product });
   } catch (err) {
      res.status(404).json({ err });
   }
}

export default method({ get: authMiddleware(get) });
