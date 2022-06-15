import type { NextApiRequest, NextApiResponse } from "next";
import { checkCode } from "controllers/authController";
import method from "micro-method-router";
import * as yup from "yup";

const bodySchema = yup.object().shape({
   email: yup.string().email().required(),
   code: yup.number().required(),
});

// permite verificar si el codigo (enviado al email de user) es correcto
export async function post(req: NextApiRequest, res: NextApiResponse) {
   try {
      const { email, code } = await bodySchema.validate(req.body);
      const token = await checkCode(email, code);
      res.status(200).send({ token });
   } catch (err) {
      res.status(400).send({ err });
   }
}

export default method({ post });
