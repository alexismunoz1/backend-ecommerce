import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "utils/middlewares";
import { getUserById, updateUserData } from "controllers/userController";
import method from "micro-method-router";
import * as yup from "yup";

const bodyPatchSchema = yup.object().shape({
   userName: yup.string().required(),
   userPhone: yup.number().required(),
   userAddress: yup.string().required(),
});

// permite obtener un usuario con su data mediante su id
async function getHandler(
   req: NextApiRequest,
   res: NextApiResponse,
   token: { userId: string }
) {
   try {
      const userData = await getUserById(token.userId);
      res.status(200).send(userData);
   } catch (err) {
      res.status(500).send({ err });
   }
}

// permite agregar los datos faltantes (name, phone, address) al usuario
async function patchHandler(
   req: NextApiRequest,
   res: NextApiResponse,
   token: { userId: string }
) {
   try {
      await bodyPatchSchema.validate(req.body);
      const userData = req.body;
      const user = await updateUserData(token.userId, userData);
      res.status(200).send(user);
   } catch (err) {
      res.status(400).send({ err });
   }
}

const handler = method({
   get: getHandler,
   patch: patchHandler,
});

export default authMiddleware(handler);
