import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

type authData = {
   email?: string;
   userId?: string;
   code?: string;
   expires?: Date;
};

const collection = firestore.collection("auth");
export class Auth {
   ref: FirebaseFirestore.DocumentReference;
   data: FirebaseFirestore.DocumentData | any;
   id: string;

   constructor(id: string) {
      this.id = id;
      this.ref = collection.doc(id);
   }

   async pull(): Promise<void> {
      const snap = await this.ref.get();
      this.data = snap.data();
   }

   async push(): Promise<void> {
      await this.ref.update(this.data);
   }

   isCodeExpired(): boolean {
      const now = new Date();
      const expires = this.data.expires.toDate();

      return isAfter(now, expires);
   }

   static async findByEmail(email: string): Promise<Auth | null> {
      const result = await collection.where("email", "==", email).get();

      if (result.docs.length) {
         const auth = new Auth(result.docs[0].id);
         auth.data = result.docs[0].data();
         return auth;
      } else {
         return null;
      }
   }

   static async createNewAuth(data: authData): Promise<Auth> {
      const newUserSnap = await collection.add(data);
      const newUser = new Auth(newUserSnap.id);
      newUser.data = data;
      return newUser;
   }

   static async findByEmailAndCode(email: string, code: number): Promise<Auth | null> {
      const result = await collection
         .where("email", "==", email)
         .where("code", "==", code)
         .get();

      if (result.empty) return null;

      const doc = result.docs[0];
      const auth = new Auth(doc.id);
      auth.data = doc.data();
      return auth;
   }
}
