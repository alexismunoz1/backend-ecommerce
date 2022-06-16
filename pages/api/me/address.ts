import type { NextApiRequest, NextApiResponse } from "next";
import { updateUserAddress } from "controllers/userController";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";
import * as yup from "yup";

let bodySchema = yup
   .object()
   .shape({
      emial: yup.string(),
      userName: yup.string(),
      userPhone: yup.number(),
      userAddress: yup.string(),
   })
   .noUnknown(true)
   .strict();

async function patch(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const userData = await bodySchema.validate(req.body);
      const resUserData = await updateUserAddress(userId, userData);
      res.status(200).send(resUserData);
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({ patch: authMiddleware(patch) });
