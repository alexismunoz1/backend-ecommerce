import { firestore } from "lib/firestore";

const collection = firestore.collection("user");

type userData = {
   [x: string]: string | string[] | number | undefined;
   email?: string;
   userAddress?: string;
   userName?: string;
   userPhone?: number;
};

export class User {
   ref: FirebaseFirestore.DocumentReference;
   data: FirebaseFirestore.DocumentReference | any;
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

   static async createNewUser(data: userData): Promise<User> {
      const newUserSnap = await collection.add(data);
      const newUser = new User(newUserSnap.id);
      newUser.data = data;
      return newUser;
   }

   async saveNewOrder(orderId: string): Promise<void> {
      await this.pull();
      this.data.userOrders = {
         ...this.data.userOrders,
         [orderId]: {
            status: "pending",
            createdAt: new Date().toLocaleString(),
         },
      };
      await this.push();
   }
}
