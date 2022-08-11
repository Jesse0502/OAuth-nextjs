import Image from "next/image";
import React from "react";
import jwt from "jsonwebtoken";
import Link from "next/link";
import connect from "../lib/database";
import { getCookie } from "cookies-next";
import User from "../models/User";

export default function Todo(props) {
  const [user, setUser] = React.useState(props.user);
  const [todos, setTodos] = React.useState(props.todos);
  const [name, setName] = React.useState("");

  function logout() {
    document.cookie = "token=null";
    window.location.href = "/";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await fetch("http://localhost:3000/api/todos", {
      method: "POST",
      body: JSON.stringify({
        name,
        id: new Date().getUTCMilliseconds() + Math.round(Math.random()),
      }),
    });
  }

  async function deleteTodo(id) {
    await fetch(`http://localhost:3000/api/todos?id=${id}`, {
      method: "DELETE",
    });
    const res = await fetch(`http://localhost:3000/api/todos`).then((res) =>
      res.json()
    );
    setTodos(res);
  }

  if (!user) return <></>;

  return (
    <div>
      <div onClick={logout}>Logout</div>
      <h2>Welcome, {user.name}</h2>
      <form onSubmit={handleSubmit}>
        <label>Todo</label>
        <input
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      {todos.length ? (
        todos.map((todo, idx) => (
          <div key={todo.id}>
            <br />
            <div>
              <span>{todo.name}</span> <span>{todo.id}</span>{" "}
              <span onClick={() => deleteTodo(todo.id)}>del</span>
            </div>
          </div>
        ))
      ) : (
        <>No Todos to show</>
      )}
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  await connect("OAuth");
  const cookieExist = getCookie("token", { req, res });
  const userInfo = jwt.decode(cookieExist);
  if (!userInfo) return { redirect: { destination: "/" } };
  const user = await User.findOne({ _id: userInfo._id });
  if (!user) return { redirect: { destination: "/" } };
  return { props: { todos: user.todos, user: userInfo } };
}
