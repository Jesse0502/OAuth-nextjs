import connect from "../../lib/database";
import User from "../../models/User";
import jwt from "jsonwebtoken";
export default async function handler(req, res) {
  try {
    await connect("OAuth");
    if (req.method === "GET") {
      const userInfo = jwt.decode(req.cookies.token);
      if (!userInfo) return res.status(401).json({ message: "Invalid token" });
      const user = await User.findOne({ _id: userInfo._id });
      if (!user) return res.status(401).json({ message: "Invalid token" });
      res.status(200).json(user.todos);
    } else if (req.method === "POST") {
      const userInfo = jwt.decode(req.cookies.token);
      if (!userInfo) return res.status(401).json({ message: "Invalid token" });
      const user = await User.findOne({ _id: userInfo._id });
      await User.findOneAndUpdate(
        { _id: userInfo._id },
        { $push: { todos: { ...JSON.parse(req.body) } } }
      );
      res.status(200).json({ message: "Todo added Successfully" });
    } else if (req.method === "DELETE") {
      const userInfo = jwt.decode(req.cookies.token);
      if (!userInfo) return res.status(401).json({ message: "Invalid token" });
      const user = await User.findOne({ _id: userInfo._id });
      const newTodos = user.todos.filter((todo) => +todo.id !== +req.query.id);
      await User.findOneAndUpdate(
        { _id: userInfo._id },
        { $set: { todos: newTodos } }
      );
      res.status(200).json({ message: "Todo deleted Successfully" });
    } else {
      res.status(401).json({ message: "Method not allowed" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
}
