import { NextApiRequest, NextApiResponse } from "next";
import {
  connectDataBase,
  getAllDocuments,
  insertDocument,
} from "@/helpers/db-util";

type SubmittedComment = {
  email: string;
  name: string;
  text: string;
  eventId: string | string[] | undefined;
  date: Date;
  _id?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const eventId = req.query.eventId;

  let client;

  try {
    client = await connectDataBase();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed!" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email ||
      !email.includes("@") ||
      email.length === 0 ||
      !name ||
      !text ||
      name.trim() === "" ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input" });
      client.close();
      return;
    }

    const submittedComment: SubmittedComment = {
      email,
      name,
      text,
      eventId,
      date: new Date(),
    };

    try {
      const result = await insertDocument(client, "comments", submittedComment);
      submittedComment._id = result.insertedId.toHexString();
      res
        .status(201)
        .json({ message: "Comment Submitted.", comment: submittedComment });
    } catch (error) {
      res.status(500).json({ message: "Inserting data failed!" });
    }
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(
        client,
        "comments",
        { _id: -1 },
        { eventId }
      );
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: "Getting comments failed!" });
    }
  }

  client.close();
}
