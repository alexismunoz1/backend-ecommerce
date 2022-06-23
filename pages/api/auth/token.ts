import type { NextApiRequest, NextApiResponse } from "next";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { checkCode } from "controllers/authController";
import method from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup
   .object()
   .shape({
      email: yup.string().required().email().lowercase().trim(),
      code: yup.number().required(),
   })
   .noUnknown(true, "Email and Code are the only fields allowed")
   .strict();

export async function postToken(req: NextApiRequest, res: NextApiResponse) {
   try {
      const token = await checkCode(req.body.email, req.body.code);
      res.status(200).send({ token });
   } catch (error) {
      res.status(400).send({ error });
   }
}

export default method({
   post: valideteMiddleware(bodySchema, postToken, "body"),
});
