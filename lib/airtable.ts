import Airtable from "airtable";
const { AIRTABLE_API_KEY, AIRTABLE_BASE_ID } = process.env;

export const airtableBase = new Airtable({ apiKey: AIRTABLE_API_KEY }).base(
   AIRTABLE_BASE_ID as string
);
