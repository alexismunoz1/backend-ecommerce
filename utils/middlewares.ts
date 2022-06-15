import type { NextApiRequest, NextApiResponse } from "next";
import parseBearerToken from "parse-bearer-token";
import { decode } from "lib/jsonwebtoken";

type Token = {
   userId: string;
   iat: number;
};

export function authMiddleware(callback: Function): Function {
   return function (req: NextApiRequest, res: NextApiResponse) {
      try {
         const token = parseBearerToken(req);
         if (!token) throw { message: "No token" };

         const decodeToken: Token = decode(token as string);
         callback(req, res, decodeToken.userId);
      } catch (err) {
         res.status(401).send({ message: "Invalid token" });
      }
   };
}
