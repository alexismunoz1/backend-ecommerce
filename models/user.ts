import { firestore } from "lib/firestore";

const collection = firestore.collection("user");
export class User {
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
      // await this.ref.set({
      //    ...this.data,
      //    nwedata
      // }, {
      //    merge: true
      // });
   }

   static async createNewUser(data) {
      const newUserSnap = await collection.add(data);
      const newUser = new User(newUserSnap.id);
      newUser.data = data;
      return newUser;
   }
}
