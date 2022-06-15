import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFormReq } from "utils/pagination";

interface SearchParams {
   query: string;
   limit: string;
   offset: string;
}

type Product = {
   Name: string;
   Images: { url: string }[];
   "Unit cost": number;
   objectID: string;
};

export async function searchProductByName(searchData: SearchParams) {
   const { query, limit, offset } = searchData;

   const { nbHits: totalProducts } = await productsIndex.search(query, {
      attributesToHighlight: [],
   });

   const { finalLimit, finalOffset } = getOffsetAndLimitFormReq(
      totalProducts,
      limit,
      offset
   );

   const { hits: products } = await productsIndex.search(query, {
      offset: finalOffset,
      length: finalLimit,
      hitsPerPage: finalLimit,
      attributesToHighlight: [],
   });

   return { total: products.length, products };
}

export async function getProductById(id: string): Promise<Product> {
   const product: Product = await productsIndex.getObject(id);
   return product;
}
