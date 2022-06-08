import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decode } from "lib/jsonwebtoken";

export function authMiddleware(callback: Function) {
   return function (req: NextApiRequest, res: NextApiResponse) {
      const token = parseToken(req);
      !token && res.status(401).send({ message: "No token" });

      const decodeToken = decode(token as string);
      if (decodeToken) {
         callback(req, res, decodeToken);
      } else {
         res.status(401).send({ message: "Invalid token" });
      }
   };
}
