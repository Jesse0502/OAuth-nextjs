import Image from "next/image";
import React from "react";
import jwt from "jsonwebtoken";

export default function Home() {
  const [user, setUser] = React.useState(null);
  React.useEffect(() => {
    const token = document.cookie.split("token=")[1];
    const user = jwt.decode(token);
    if (user) window.location.href = "/todo";
  }, []);
  return (
    <div>
      <a href="api/auth/discord">Discord Login</a>
      <br />
      <br />
      <a href="api/auth/google">Google Login</a>
      <br />
      <br />
      <a href="api/auth/github">Github Login</a>
    </div>
  );
}
