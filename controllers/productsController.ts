import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFormReq } from "utils/pagination";

export async function searchProductByName(search: string, limit: string, offset: string) {
   const { nbHits: totalProducts } = await productsIndex.search(search, {
      attributesToHighlight: [],
   });

   const { finalLimit, finalOffset } = getOffsetAndLimitFormReq(
      totalProducts,
      limit,
      offset
   );

   const { hits } = await productsIndex.search(search, {
      offset: finalOffset,
      length: finalLimit,
      hitsPerPage: finalLimit,
      attributesToHighlight: [],
   });

   return { total: hits.length, hits };
}

export async function getProductById(id: string) {
   const ressult = await productsIndex.getObject(id);
   return ressult;
}
