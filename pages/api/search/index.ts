import type { NextApiRequest, NextApiResponse } from "next";
import { searchProductByName } from "controllers/productsController";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";
import * as yup from "yup";

async function getHandler(req: NextApiRequest, res: NextApiResponse) {
   const { query, offset, limit } = req.query;
   try {
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

const handler = method({
   get: getHandler,
});

export default authMiddleware(handler);
