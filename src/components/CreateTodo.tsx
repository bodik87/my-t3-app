import React, { useState } from "react";
import { api } from "../utils/api";
import { todoInput } from "../types";
import toast from "react-hot-toast";

export default function CreateTodo() {
  const [newTodo, setNewTodo] = useState("");

  const trpc = api.useContext();

  const { mutate } = api.todo.create.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <div>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();

          const result = todoInput.safeParse(newTodo);
          if (!result.success) {
            toast.error(result.error.format()._errors.join("\n"));
            return;
          }

          // Create todo mutation
          mutate(newTodo);
          setNewTodo("");
        }}
      >
        <input
          type="text"
          name="new-todo"
          id="new-todo"
          placeholder="New Todo..."
          className="rounded-lg border-gray-300 bg-gray-50 px-3 text-sm text-gray-900"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button className="w-full rounded-lg bg-green-500 px-5 py-1.5 text-center text-sm font-medium text-white transition-all hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 dark:bg-green-500 dark:hover:bg-green-600 dark:focus:ring-green-800 sm:w-auto">
          Create
        </button>
      </form>
    </div>
  );
}
