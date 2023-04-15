import React from "react";
import { api } from "../utils/api";
import Todo from "./Todo";

export default function Todos() {
  const { data: todos, isLoading, isError } = api.todo.all.useQuery();

  if (isLoading) return <div>Loading todos ⏳</div>;
  if (isError) return <div>Error fetching ❌</div>;
  return (
    <>
      {todos.length
        ? todos.map((todo) => <Todo key={todo.id} todo={todo} />)
        : "Create your first todo"}
    </>
  );
}
