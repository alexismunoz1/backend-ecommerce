import type { NextApiRequest, NextApiResponse } from "next";
import { updateUserAddress } from "controllers/userController";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";
import * as yup from "yup";

let bodySchema = yup
   .object()
   .shape({
      emial: yup.string().email().lowercase().trim().optional(),
      userName: yup.string().optional(),
      userPhone: yup.number().optional(),
      userAddress: yup.string().optional(),
   })
   .noUnknown(true)
   .strict();

async function patchAddress(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const resUserData = await updateUserAddress(userId, req.body);
      res.status(200).send(resUserData);
   } catch (error) {
      res.status(400).send({ error });
   }
}

const handler = method({ patch: authMiddleware(patchAddress) });
export default valideteMiddleware(bodySchema, handler, "body");
