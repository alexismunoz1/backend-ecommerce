import algoliasearch from "algoliasearch";
const { ALGOLIA_APPLICATION_ID, ALGOLIA_API_KEY } = process.env;

const client = algoliasearch(ALGOLIA_APPLICATION_ID as string, ALGOLIA_API_KEY as string);
export const productsIndex = client.initIndex("products");
