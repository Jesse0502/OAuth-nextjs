import passport from "passport";
import { Strategy } from "passport-github2";
import connect from "../../../../lib/database";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

passport.use(
  "github",

  new Strategy(
    {
      clientID: process.env.githubId,
      clientSecret: process.env.githubSecret,
      callbackURL: "http://localhost:3000/api/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, id, name } = profile._json;
        let user = await User.findOne({ discordId: id });
        if (!user) user = await User.findOne({ email });
        console.log(user);
        if (!user) {
          const newUser = new User({
            discordId: id,
            email,
            name,
          });
          await newUser.save();
          const token = jwt.sign(
            {
              _id: newUser._id,
              email,
              name: newUser.name,
            },
            process.env.JWT_SECRET
          );
          done(null, newUser, { message: "Auth Successful", token });
        } else {
          const token = jwt.sign(
            {
              _id: user._id,
              email: user.email,
              name: user.name,
            },
            process.env.JWT_SECRET
          );
          done(null, user, { message: "Auth Successful", token });
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

export default async function handler(req, res, next) {
  try {
    await connect("OAuth");
    passport.authenticate("github", {
      session: false,
      scope: ["user:email"],
    })(req, res, next);
  } catch (err) {
    console.log(err.message);
    res.status(400).redirect("/");
  }
}
