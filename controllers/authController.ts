import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { generate } from "lib/jsonwebtoken";
import { sendEmail } from "lib/sendgrid";

export async function findOrCreateAuth(email: string): Promise<Auth> {
   const cleanEmail = email.trim().toLowerCase();
   const auth = await Auth.findByEmail(cleanEmail);

   if (auth) {
      return auth;
   } else {
      const newUser = await User.createNewUser({
         email: cleanEmail,
      });

      const newAuth = await Auth.createNewAuth({
         email: cleanEmail,
         userId: newUser.id,
         code: "",
         expires: new Date(),
      });

      return newAuth;
   }
}

export async function sendCode(email: string): Promise<boolean> {
   const auth = await findOrCreateAuth(email);

   const code = gen.create(process.env.SECRET_SEED).intBetween(100000, 999999);
   auth.data.code = code;

   const now = new Date();
   const expires = addMinutes(now, 5);
   auth.data.expires = expires;

   console.log(`Sending code ${code} to ${email}`);
   await sendEmail(email, code);
   await auth.push();
   return true;
}

export async function checkCode(email: string, code: number): Promise<string> {
   const auth = await Auth.findByEmailAndCode(email, code);
   if (!auth) {
      throw "Email and code do not match";
   }

   const expired = auth.isCodeExpired();
   if (expired) {
      throw "Expired code";
   }

   const token = generate({ userId: auth.data.userId });
   return token;
}