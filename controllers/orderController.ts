import { Order } from "models/order";
import { createPreference } from "lib/mercadopago";
import { getProductById } from "controllers/productsController";
import { saveOrderInUser } from "controllers/userController";

type OrderData = {
   productId: string;
   userId: string;
   aditionalInfo?: Record<string, string | string[] | number>;
};

export async function createOrder(orderData: OrderData): Promise<string> {
   const { productId, userId, aditionalInfo } = orderData;

   const { ["Unit cost"]: unit_price, Name, Images } = await getProductById(productId);

   const orderId = await Order.createNewOrder({
      aditionalInfo, //datos adicionales de la compra
      productId, // que compara
      userId, // quien compra
      status: "pending", // estado de la compra
      createdAt: new Date(), // cuando se creo la compra
      unit_price, // precio de la compra
   });

   await saveOrderInUser(userId, orderId);

   const preference: Preference = {
      external_reference: orderId,
      items: [
         {
            title: Name,
            quantity: 1,
            picture_url: Images[0].url,
            currency_id: "ARS",
            unit_price,
         },
      ],
      notification_url: "url-webhook-ipn",
      back_urls: {
         success: "url-success",
         pending: "url-pending",
         failure: "url-failure",
      },
   };

   const { init_point } = await createPreference(preference);

   return init_point;
}
