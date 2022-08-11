import passport from "passport";
import { setCookie } from "cookies-next";

export default async function handler(req, res, next) {
  try {
    passport.authenticate("google", (err, user, info) => {
      console.log(info);
      if (err || !user)
        return res.redirect("http://localhost:3000/?a=auth_fail");
      let d1 = new Date();
      let d2 = new Date(d1);
      d2.setHours(d1.getHours() + 6);

      setCookie("token", info.token, {
        req,
        res,
        expires: d2,
      });
      res.redirect("http://localhost:3000/todo?a=auth_pass");
    })(req, res, next);
  } catch (err) {
    console.log(err.message);
    res.status(500).redirect("http://localhost:3000?a=auth_fail");
  }
}
