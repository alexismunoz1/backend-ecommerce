import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById, updateUserData } from "controllers/userController";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { authMiddleware } from "lib/authMiddleware";
import method from "micro-method-router";
import * as yup from "yup";

async function getMeInfo(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const userData = await getUserById(userId);
      res.status(200).send(userData);
   } catch (error) {
      res.status(400).send({ error });
   }
}

const bodyPatchSchema = yup
   .object()
   .shape({
      userName: yup.string().required(),
      userPhone: yup.number().required(),
      userAddress: yup.string().required(),
   })
   .noUnknown(true)
   .strict();

async function patchMeInfo(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      // const userData = await bodyPatchSchema.validate(req.body);
      const user = await updateUserData(userId, req.body);
      res.status(200).send(user);
   } catch (error) {
      res.status(400).send({ error });
   }
}

export default method({
   get: authMiddleware(getMeInfo),
   patch: valideteMiddleware(bodyPatchSchema, authMiddleware(patchMeInfo), "body"),
});
