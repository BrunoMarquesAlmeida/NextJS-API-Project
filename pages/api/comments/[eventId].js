export default function handler(req, res) {
  const { eventId } = req.query;

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
      return;
    }

    console.log(email, name, text);
    const newComment = {
      id: new Date().toISOString(),
      email,
      text,
      name,
    };

    res.status(200).json({ message: "Added Comment" });
  }

  if (req.method === "GET") {
    const dummyList = [
      { id: "c1", name: "Max", text: "A comment" },
      { id: "c2", name: "Max2", text: "A comment2" },
    ];

    res.status(200).json({ comments: dummyList });
  }
}
