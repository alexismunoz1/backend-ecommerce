import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { sendCode } from "controllers/authController";
import * as yup from "yup";

const bodySchema = yup
   .object()
   .shape({ email: yup.string().email().lowercase().trim().required() });

export async function post(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { email } = await bodySchema.validate(req.body);
      const result = await sendCode(email);
      res.status(200).send(result);
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({ post });
