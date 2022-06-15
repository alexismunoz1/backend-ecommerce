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
   try {
      const searchData = await querySchema.validate(req.query);
      const { total, products } = await searchProductByName(searchData);
      res.status(200).json({ total, products });
   } catch (err) {
      res.status(500).json({ err });
   }
}

export default method({ get: authMiddleware(get) });
