import mercadopago from "mercadopago";
const { MP_TOKEN } = process.env;

mercadopago.configure({ access_token: MP_TOKEN as string });

export async function getMerchantOrder(id: string) {
   const res = await mercadopago.merchant_orders.get(id);
   return res.body;
}

export async function createPreference(data = {}): Promise<string> {
   const res = await mercadopago.preferences.create(data);
   return res.body.init_point;
}
