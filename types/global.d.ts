export {};

declare global {
   type Preference = {
      external_reference: string;
      items: {
         title: string;
         quantity: number;
         picture_url: string;
         currency_id: string;
         unit_price: number;
      }[];
      notification_url: string;
      back_urls: {
         success: string;
         pending: string;
         failure: string;
      };
   };
}
