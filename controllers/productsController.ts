import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFormReq } from "lib/pagination";
import { Product } from "models/product";

export async function searchProductByName(
   query: string,
   queryLimit: string,
   queryOffset: string
) {
   const limit = parseInt(queryLimit);
   const offset = parseInt(queryOffset);

   const { finalLimit } = getOffsetAndLimitFormReq(limit);

   return await Product.getProductByName(query, finalLimit, offset);
}

export async function getProductById(id: string) {
   return await Product.getItemById(id);
}
