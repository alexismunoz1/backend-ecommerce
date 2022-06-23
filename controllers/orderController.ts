import { createPreference, getMerchantOrder } from "lib/mercadopago";
import { getProductById } from "controllers/productsController";
import { saveOrderInUser } from "controllers/userController";
import { sendDataPayment } from "lib/sendgrid";
import { Order } from "models/order";
import { User } from "models/user";

type newOrderData = {
   productId: string;
   userId: string;
   aditionalInfo?: Record<string, string | string[] | number>;
};

type Preference = {
   external_reference: string;
   items: {
      title: string;
      quantity: number;
      currency_id: string;
      unit_price: number;
   }[];
   notification_url: string;
   back_urls: {
      success: string;
   };
};

export async function createOrder(
   orderData: newOrderData
): Promise<{ external_reference: string; init_point: string }> {
   const { productId, userId, aditionalInfo } = orderData;

   const { ["Unit cost"]: unit_price, Name } = await getProductById(productId);

   // se crea la order en la base de datos
   const { external_reference } = await Order.createNewOrder({
      userId, // quien compra
      productId, // que compara
      productName: Name, // nombre de la compra
      unit_price, // precio de la compra
      aditionalInfo, //datos adicionales de la compra
      status: "pending", // estado de la compra
      createdAt: new Date().toLocaleString(), // cuando se creo la compra
   });

   await saveOrderInUser(userId, external_reference);
   // se guarda el id de la order en el usuario

   // data para la preferencia en mercadopago
   const preference: Preference = {
      external_reference, // id de la order en la base de datos
      items: [
         {
            title: Name,
            quantity: 1,
            currency_id: "ARS",
            unit_price,
         },
      ],
      notification_url: "https://backend-ecommerce-tau.vercel.app/api/ipn/mercadopago",
      // url de notificacion a la que va a notificar mercadopago cuando se realize la compra
      back_urls: {
         success: "url-success",
      },
   };

   const { init_point } = await createPreference(preference);
   // se crea la preferencia en mercadopago y devuelve una url para redirigir realizar la compra
   return {
      external_reference,
      init_point,
   };
}

export async function getOrderById(id: string) {
   return await Order.getOrder(id);
}

export async function updateOrderStatus(id: string) {
   // se actualiza el estado de la order en la base de datos
   const { order_status, external_reference } = await getMerchantOrder(id);

   if (order_status == "paid") {
      const currentOrder = new Order(external_reference);
      await currentOrder.updateOrderStatus(order_status);
      // se actualiza el estado de la order en la db

      const currentUser = new User(currentOrder.data.userId);
      await currentUser.pull();
      await currentUser.updateUserOrderStatus(external_reference, order_status);
      // se actualiza el estado de la order del usuario en la db

      await sendDataPayment(currentUser.data.email, currentUser.data.userName);
      // se envia el email de confirmacion de la compra al usuario

      return true;
   } else {
      return false;
   }
}
