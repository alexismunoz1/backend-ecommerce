import type { NextApiRequest, NextApiResponse } from "next";
import { valideteMiddleware } from "lib/schemaMiddleware";
import { sendCode } from "controllers/authController";
import method from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup
   .object()
   .shape({
      email: yup.string().email().lowercase().trim().required(),
   })
   .noUnknown(true, "Email is the only field allowed")
   .strict();

export async function authPost(req: NextApiRequest, res: NextApiResponse) {
   try {
      const result = await sendCode(req.body.email);
      res.status(200).send(result);
   } catch (error) {
      res.status(400).send({ error });
   }
}

export default method({
   post: valideteMiddleware(bodySchema, authPost, "body"),
});
