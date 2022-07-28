import type { NextApiRequest, NextApiResponse } from "next";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { searchProductByName } from "controllers/productsController";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";
import * as yup from "yup";

const querySchema = yup
   .object()
   .shape({
      query: yup.string().required(),
      limit: yup.string().required(),
      offset: yup.string().required(),
   })
   .noUnknown(true)
   .strict();

async function getProducts(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { query, limit, offset } = req.query;
      const products = await searchProductByName(
         query as string,
         limit as string,
         offset as string
      );
      res.status(200).json(products);
   } catch (err) {
      res.status(500).json({ err });
   }
}

const handler = method({ get: authMiddleware(getProducts) });
export default valideteMiddleware(querySchema, handler, "query");
