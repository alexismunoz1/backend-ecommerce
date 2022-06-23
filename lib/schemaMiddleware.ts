import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";
import { ObjectShape, OptionalObjectSchema } from "yup/lib/object";

export function valideteMiddleware(
   schema: OptionalObjectSchema<ObjectShape>,
   handler: NextApiHandler,
   reqParam: "body" | "query"
) {
   return async (req: NextApiRequest, res: NextApiResponse) => {
      try {
         await schema.validate(reqParam == "body" ? req.body : req.query);
      } catch (error) {
         return res.status(400).json({ error });
      }
      await handler(req, res);
   };
}
