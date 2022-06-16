import mercadopago from "mercadopago";
import { string } from "yup";
const { MP_TOKEN } = process.env;

mercadopago.configure({ access_token: MP_TOKEN as string });

// se crea la preferencia en mercadopago y solamente devuelve una url para redirigir realizar la compra
export async function createPreference(data: {}): Promise<{
   init_point: string;
}> {
   const res = await mercadopago.preferences.create(data);
   return {
      init_point: res.body.init_point,
   };
}

export async function getMerchantOrder(id: string): Promise<{
   order_status: string;
   external_reference: string;
}> {
   const order = await mercadopago.merchant_orders.get(id);
   return {
      order_status: order.body.order_status,
      external_reference: order.body.external_reference,
   };
}
