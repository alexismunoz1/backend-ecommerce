import type { NextApiRequest, NextApiResponse } from "next";
import { getUserById, updateUserData } from "controllers/userController";
import { authMiddleware } from "utils/middlewares";
import method from "micro-method-router";
import * as yup from "yup";

async function get(res: NextApiResponse, userId: string) {
   try {
      const userData = await getUserById(userId);
      res.status(200).send(userData);
   } catch (err) {
      res.status(500).send({ err });
   }
}

const bodyPatchSchema = yup.object().shape({
   userName: yup.string().required(),
   userPhone: yup.number().required(),
   userAddress: yup.string().required(),
});

async function patch(req: NextApiRequest, res: NextApiResponse, userId: string) {
   try {
      const userData = await bodyPatchSchema.validate(req.body);
      const user = await updateUserData(userId, userData);
      res.status(200).send(user);
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({
   get: authMiddleware(get),
   patch: authMiddleware(patch),
});
