import { firestore } from "lib/firestore";

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

   static async createNewOrder(newOrderData: OrderDataModel): Promise<{
      external_reference: string;
   }> {
      const newOrderSnap = await collection.add(newOrderData);
      const newOrder = new Order(newOrderSnap.id);
      newOrder.data = newOrderData;
      return { external_reference: newOrder.id };
   }

   static async getOrder(id: string) {
      const order = await collection.doc(id).get();
      return order.data();
   }

   async updateOrderStatus(status: "pending" | "paid" | "failure") {
      await this.pull();
      this.data.status = status;
      await this.push();
   }
}
