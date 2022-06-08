import jwt from "jsonwebtoken";

export function generate(obj: object): string {
   return jwt.sign(obj, process.env.JWT_SECRET);
}

export function decode(token: string): string | null {
   try {
      return jwt.verify(token, process.env.JWT_SECRET);
   } catch (err) {
      console.log("Error decoding token: ", err);
      return null;
   }
}
