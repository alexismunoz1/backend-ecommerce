import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "utils/middlewares";
import { updateUserAddress } from "controllers/userController";
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

//permite actualizar un dato puntual de un usuario
async function patch(
   req: NextApiRequest,
   res: NextApiResponse,
   token: { userId: string }
) {
   try {
      const userData = await bodySchema.validate(req.body);
      const resUserData = await updateUserAddress(token.userId, userData);
      res.status(200).send(resUserData);
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({ patch: authMiddleware(patch) });
