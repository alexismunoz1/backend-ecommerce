import { NextApiRequest, NextApiResponse } from "next";
import { airtableBase } from "lib/airtable";
import { productsIndex } from "lib/algolia";

export default function (req: NextApiRequest, res: NextApiResponse) {
   try {
      airtableBase("Furniture")
         .select({})
         .eachPage(
            async function (records, fetchNextPage) {
               const results = records.map((record) => {
                  return {
                     objectID: record.id,
                     ...record.fields,
                  };
               });

               await productsIndex.saveObjects(results);
               fetchNextPage();
            },

            function done(err) {
               if (err) {
                  console.error(err);
                  return;
               }
               res.status(200).send("Done");
            }
         );
   } catch (err) {
      res.status(500).send({ message: err });
   }
}
