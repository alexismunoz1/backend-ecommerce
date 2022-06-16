import { sendCodeByEmail } from "lib/sendgrid";
import addMinutes from "date-fns/addMinutes";
import { generate } from "lib/jsonwebtoken";
import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";

export async function findOrCreateAuth(email: string): Promise<Auth> {
   const auth = await Auth.findByEmail(email);

   if (!auth) {
      const newUser = await User.createNewUser({ email });

      const newAuth = await Auth.createNewAuth({
         email,
         userId: newUser.id,
         code: "",
         expires: new Date(),
      });

      return newAuth;
   } else {
      return auth;
   }
}

export async function sendCode(email: string): Promise<boolean> {
   const auth = await findOrCreateAuth(email);

   const code = gen.create(process.env.SECRET_SEED).intBetween(100000, 999999);
   auth.data.code = code;

   const now = new Date();
   const expires = addMinutes(now, 5);
   auth.data.expires = expires;

   await sendCodeByEmail(email, code);
   await auth.push();
   return true;
}

export async function checkCode(email: string, code: number): Promise<string> {
   const auth = await Auth.findByEmailAndCode(email, code);
   if (!auth) throw "Email and code do not match";

   const expired = auth.isCodeExpired();
   if (expired) throw "Expired code";

   return generate({ userId: auth.data.userId });
}
