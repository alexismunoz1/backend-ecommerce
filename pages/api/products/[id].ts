import type { NextApiRequest, NextApiResponse } from "next";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { getProductById } from "controllers/productsController";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup
   .object()
   .shape({
      id: yup.string().required(),
   })
   .noUnknown(true)
   .strict();

async function getProduct(req: NextApiRequest, res: NextApiResponse) {
   try {
      const product = await getProductById(req.query.id as string);
      res.status(200).json(product);
   } catch (err) {
      res.status(404).json({ err });
   }
}

const handler = method({ get: authMiddleware(getProduct) });
export default valideteMiddleware(querySchema, handler, "query");
