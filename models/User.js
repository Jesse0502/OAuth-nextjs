import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
  name: String,
  email: { type: String, default: null },
  discordId: { type: String, default: null },
  googleId: { type: String, default: null },
  githubId: { type: String, default: null },
  password: { type: String, default: null },
  todos: [],
});

let User;

try {
  User = mongoose.model("users");
} catch (err) {
  User = mongoose.model("users", UserSchema);
}

export default User;
