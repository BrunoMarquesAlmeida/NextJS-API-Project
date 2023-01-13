import { MongoClient } from "mongodb";

import {
  connectDatabase,
  inserDocument,
  getAllDocuments,
} from "../../../helpers/db-util";

export default async function handler(req, res) {
  const { eventId } = req.query;
  let client;

  try {
    client = await connectDatabase();
  } catch (error) {
    res.status(500).json({ message: "Connecting to the database failed" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input" });
      client.close();
      return;
    }

    const newComment = {
      email,
      text,
      name,
      eventId,
    };

    try {
      const result = await inserDocument(client, "comments", newComment);
      newComment._id = result.insertedId;
      res.status(200).json({ message: "Added Comment" });
    } catch (error) {
      res.status(500).json({ message: "Inserting comment failed" });
    }
  }

  if (req.method === "GET") {
    try {
      const documents = await getAllDocuments(client, "comments", { _id: -1 });
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: "Getting comments failed" });
    }
  }

  client.close();
}
