import algoliasearch from "algoliasearch";

const client = algoliasearch(
   process.env.ALGOLIA_API_KEY as string,
   process.env.ALGOLIA_APPLICATION_ID as string
);
export const productsIndex = client.initIndex("products");
