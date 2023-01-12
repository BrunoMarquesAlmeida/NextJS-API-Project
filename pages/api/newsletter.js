export default function handler(req, res) {
  if (req.method === "POST") {
    const { email } = res.body;

    if (!email) {
      res.status(422).json({ message: "Inavlid email address" });
      return;
    }

    res.status(201).json({ message: email });
  }
}
