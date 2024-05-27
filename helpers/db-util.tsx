import { MongoClient, SortDirection, Document } from "mongodb";

export async function connectDataBase() {
  const client = await MongoClient.connect(
    process.env.DATABASEMONGO_URL as string
  );

  return client;
}

export async function insertDocument<T>(
  client: MongoClient,
  collection: string,
  document: { email: string } | { [key: string]: string }
) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

export async function getAllDocuments(
  client: MongoClient,
  collection: string,
  sort: { [key: string]: SortDirection },
  filter: Document = {}
) {
  const db = client.db();
  const documents = await db
    .collection(collection)
    .find(filter)
    .sort(sort)
    .toArray();
  return documents;
}
