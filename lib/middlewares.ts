import type { NextApiRequest, NextApiResponse } from "next";
import parseToken from "parse-bearer-token";
import { decode } from "lib/jwt";

export function authMiddleware(callback) {
   return function (req: NextApiRequest, res: NextApiResponse) {
      const token = parseToken(req);
      !token && res.status(401).send({ message: "No hay token" });

      const decodeToken = decode(token);
      if (decodeToken) {
         callback(req, res, decodeToken);
      } else {
         res.status(401).send({ message: "Token incorrecto" });
      }
   };
}
