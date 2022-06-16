// global types
export {};

declare global {
   type OrderDataModel = {
      aditionalInfo?: Record<string, string | string[] | number>;
      productId: string;
      userId: string;
      status: "pending" | "success" | "failure";
      createdAt: string;
      productName: string;
      unit_price: number;
   };

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
}
