import { Order } from "models/order";
import { User } from "models/user";
import { createPreference, getMerchantOrder } from "lib/mercadopago";
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

   const { external_reference } = await Order.createNewOrder({
      aditionalInfo, //datos adicionales de la compra
      productId, // que compara
      userId, // quien compra
      status: "pending", // estado de la compra
      createdAt: new Date().toLocaleString(), // cuando se creo la compra
      unit_price, // precio de la compra
   });

   await saveOrderInUser(userId, external_reference); // se guarda la order en el usuario

   const preference: Preference = {
      external_reference,
      items: [
         {
            title: Name,
            quantity: 1,
            picture_url: Images[0].url,
            currency_id: "ARS",
            unit_price,
         },
      ],
      notification_url: "https://backend-ecommerce-tau.vercel.app/ipn/mercadopago",
      back_urls: {
         success: "url-success",
         pending: "url-pending",
         failure: "url-failure",
      },
   };

   const { init_point } = await createPreference(preference);
   return init_point;
}

export async function getOrderById(id: string) {
   return await Order.getOrder(id);
}

export async function updateOrderStatus(id: string) {
   const order = await getMerchantOrder(id);
   console.log({ order });
}
