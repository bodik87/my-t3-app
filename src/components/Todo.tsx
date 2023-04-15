import type { Todo } from "../types";
import { api } from "../utils/api";

type TodoProps = { todo: Todo }; // по сути этот тип приходит нам с бекенда и может обновляться автоматически благодаря trpc

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;

  const trpc = api.useContext();

  const { mutate: doneMutation } = api.todo.toogle.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id={todo.id}
          className="h-4 w-4 cursor-pointer rounded border-gray-300 bg-gray-50"
          checked={done}
          onChange={(e) => {
            doneMutation({ id, done: e.target.checked });
          }}
        />
        <label htmlFor={todo.id} className="cursor-pointer">
          {text}
        </label>
      </div>
      <button
        onClick={() => {
          deleteMutation(id);
        }}
        className="w-full rounded-lg bg-red-500 px-5 py-1.5 text-center text-sm font-medium text-white transition-all hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-800 sm:w-auto"
      >
        Delete
      </button>
    </div>
  );
}
