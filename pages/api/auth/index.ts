import type { NextApiRequest, NextApiResponse } from "next";
import method from "micro-method-router";
import { sendCode } from "controllers/authController";
import * as yup from "yup";

const bodySchema = yup.object().shape({
   email: yup.string().email().required(),
});

// permite enviar un codigo de verificacion a un email
// si en la db no existe un user con ese email, se crea uno
export async function post(req: NextApiRequest, res: NextApiResponse) {
   try {
      await bodySchema.validate(req.body);
      const { email } = req.body;
      const result = await sendCode(email);
      res.status(200).send(result);
   } catch (err) {
      res.status(400).send({ message: err });
   }
}

const handler = method({ post });

export default handler;
