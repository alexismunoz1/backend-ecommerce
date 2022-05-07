import type { NextApiRequest, NextApiResponse } from "next";
import { generate } from "lib/jwt";
import { Auth } from "models/auth";

export default async function (req: NextApiRequest, res: NextApiResponse) {
   const auth = await Auth.findByEmailAndCode(req.body.email, req.body.code);
   if (!auth) {
      res.status(401).send({
         message: "email y code incorrectos",
      });
   }

   const expires = auth.isCodeExpired();
   if (expires) {
      res.status(401).send({
         message: "code expired",
      });
   }
   const token = generate({ userId: auth.data.userId });
   res.status(200).send({ token });
}
