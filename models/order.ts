import { firestore } from "lib/firestore";
import { DateLocale } from "yup/lib/locale";

type OrderData = {
   aditionalInfo?: Record<string, string | string[] | number>;
   productId: string;
   userId: string;
   status: "pending" | "success" | "failure";
   createdAt: string;
   unit_price: number;
};

const collection = firestore.collection("orders");
export class Order {
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
      this.ref.update(this.data);
   }

   static async createNewOrder(newOrderData: OrderData): Promise<string> {
      const newOrderSnap = await collection.add(newOrderData);
      const newOrder = new Order(newOrderSnap.id);
      newOrder.data = newOrderData;
      return newOrder.id;
   }

   static async getOrder(id: string) {
      const order = await collection.doc(id).get();
      return order.data();
   }
}
