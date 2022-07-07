import { productsIndex } from "lib/algolia";

type ProductData = {
   Name: string;
   Images: { url: string }[];
   "Unit cost": number;
   objectID: string;
};

export class Product {
   static async getItemById(id: string): Promise<ProductData> {
      return await productsIndex.getObject(id);
   }

   static async getProductByName(query: string, limit: number, offset: number) {
      const { hits: products } = await productsIndex.search(query, {
         offset: offset,
         length: limit,
         hitsPerPage: limit,
         attributesToHighlight: [],
      });

      return { total: products.length, products };
   }
}
