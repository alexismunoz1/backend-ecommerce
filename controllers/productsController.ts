import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFormReq } from "utils/pagination";

export async function searchProductByName(search: string, limit: string, offset: string) {
   const { nbHits: totalProducts } = await productsIndex.search("", {
      hitsPerPage: 0,
   });

   const { finalLimit, finalOffset } = getOffsetAndLimitFormReq(
      totalProducts,
      limit,
      offset
   );

   const { hits, nbHits } = await productsIndex.search(search, {
      offset: finalOffset,
      length: finalLimit,
      hitsPerPage: finalLimit,
      attributesToHighlight: [],
   });

   return { finalLimit, finalOffset, nbHits, hits };
}
