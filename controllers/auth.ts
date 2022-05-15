import { Auth } from "models/auth";
import { User } from "models/user";
import gen from "random-seed";
import addMinutes from "date-fns/addMinutes";
import { generate } from "lib/jwt";
import { sendEmail } from "lib/sendgrid";

var random = gen.create(process.env.SECRET_SEED);

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

export async function sendCode(email: string) {
   const auth = await findOrCreateAuth(email);

   const code = random.intBetween(100000, 999999);
   auth.data.code = code;

   const now = new Date();
   const expires = addMinutes(now, 5);
   auth.data.expires = expires;

   console.log(`Sending code ${code} to ${email}`);
   await sendEmail(email, code);
   await auth.push();
   return true;
}

export async function checkCode(email: string, code: number) {
   const auth = await Auth.findByEmail(email);
   if (!auth) {
      throw "email y código incorrectos";
   }

   const expired = auth.isCodeExpired();
   if (expired) {
      throw "código expirado";
   }

   const token = generate({ userId: auth.data.userId });
   return token;
}
