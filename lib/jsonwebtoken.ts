import jwt from "jsonwebtoken";
const { JWT_SECRET } = process.env;

export function generate(obj: object): string {
   return jwt.sign(obj, JWT_SECRET);
}

export function decode(token: string) {
   try {
      return jwt.verify(token, JWT_SECRET);
   } catch (err) {
      console.log("Error decoding token: ", err);
      return null;
   }
}
