import { firestore } from "lib/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");
export class Auth {
   ref: FirebaseFirestore.DocumentReference;
   data: FirebaseFirestore.DocumentData;
   id: string;

   constructor(id) {
      this.id = id;
      this.ref = collection.doc(id);
   }

   async pull() {
      const snap = await this.ref.get();
      this.data = snap.data();
   }

   async push() {
      await this.ref.update(this.data);
   }

   isCodeExpired() {
      const now = new Date();
      const expires = this.data.expires.toDate();
      console.log({ now });
      console.log({ expires });

      return isAfter(now, expires);
   }

   static cleanEmail(email: string) {
      return email.trim().toLowerCase();
   }

   static async findByEmail(email: string) {
      const cleanEmail = Auth.cleanEmail(email);
      const result = await collection.where("email", "==", cleanEmail).get();

      if (result.docs.length) {
         const auth = new Auth(result.docs[0].id);
         auth.data = result.docs[0].data();
         return auth;
      } else {
         return null;
      }
   }

   static async createNewAuth(data) {
      const newUserSnap = await collection.add(data);
      const newUser = new Auth(newUserSnap.id);
      newUser.data = data;
      return newUser;
   }

   static async findByEmailAndCode(email: string, code: number) {
      const cleanEmail = Auth.cleanEmail(email);
      const result = await collection
         .where("email", "==", cleanEmail)
         .where("code", "==", code)
         .get();

      if (result.empty) {
         console.error("Email and code do not match");
         return null;
      } else {
         const doc = result.docs[0];
         const auth = new Auth(doc.id);

         auth.data = doc.data();
         return auth;
      }
   }
}
