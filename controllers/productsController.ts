import { productsIndex } from "lib/algolia";
import { getOffsetAndLimitFormReq } from "lib/pagination";

type ProductData = {
   Name: string;
   Images: { url: string }[];
   "Unit cost": number;
   objectID: string;
};

export async function searchProductByName(query: string, limit: string, offset: string) {
   // primero se busca el item para saber el total de resultados
   const { nbHits: totalProducts } = await productsIndex.search(query, {
      attributesToHighlight: [],
   });

   // se obtiene el offset y limit de la pagina mediante el totalProducts
   const { finalLimit, finalOffset } = getOffsetAndLimitFormReq(
      totalProducts,
      limit,
      offset
   );

   // se busca el item en la base de datos con el offset y limit
   const { hits: products } = await productsIndex.search(query, {
      offset: finalOffset,
      length: finalLimit,
      hitsPerPage: finalLimit,
      attributesToHighlight: [],
   });

   return { total: products.length, products };
}

export async function getProductById(id: string): Promise<ProductData> {
   const product: ProductData = await productsIndex.getObject(id);
   return product;
}
