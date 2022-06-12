import type { NextApiRequest, NextApiResponse } from "next";
import { searchProductByName } from "controllers/productsController";
import { authMiddleware } from "utils/middlewares";
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

async function get(req: NextApiRequest, res: NextApiResponse) {
   const { query, offset, limit } = req.query;
   try {
      await querySchema.validate(req.query);
      const products = await searchProductByName(
         query as string,
         limit as string,
         offset as string
      );
      res.status(200).json(products);
   } catch (err: any) {
      res.status(500).json({ message: err.message });
   }
}

const handler = method({ get });

export default authMiddleware(handler);
