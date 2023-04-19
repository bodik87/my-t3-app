import { toast } from "react-hot-toast";
import { RouterOutputs, api } from "../utils/api";

type Todo = RouterOutputs["todo"]["all"][number];
type TodoProps = { todo: Todo }; // по сути этот тип приходит нам с бекенда и может обновляться автоматически благодаря trpc

export default function Todo({ todo }: TodoProps) {
  const { id, text, done } = todo;

  const trpc = api.useContext();

  // Basic mutation
  // const { mutate: doneMutation } = api.todo.toogle.useMutation({
  //   onSuccess: (err, { done }) => {
  //     if (done) {
  //       toast.success("Todo completed! 👌");
  //     }
  //   },
  //   onSettled: async () => {
  //     await trpc.todo.all.invalidate();
  //   },
  // });

  // Mutation с отлавливанием ошибок
  const { mutate: doneMutation } = api.todo.toogle.useMutation({
    onMutate: async ({ id, done }) => {
      // предотвращаем рефетч
      await trpc.todo.all.cancel();
      //
      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.map((todo) => {
          if (todo.id === id) ({ ...todo, done });
          return todo;
        });
      });

      return { previousTodos };
    },

    onError: (err, newTodo, context) => {
      toast.error(
        `An error occured when setting todo ${done ? "done" : "undone"}}`
      );
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },

    onSuccess: (err, { done }) => {
      if (done) {
        toast.success("Todo completed! 👌");
      }
    },
    onSettled: async () => {
      await trpc.todo.all.invalidate();
    },
  });

  // Basic mutation
  // const { mutate: deleteMutation } = api.todo.delete.useMutation({
  //   onSuccess: () => {
  //     toast.success("Todo deleted! ❌");
  //   },
  //   onSettled: async () => {
  //     await trpc.todo.all.invalidate();
  //   },
  // });

  // Mutation с отлавливанием ошибок
  const { mutate: deleteMutation } = api.todo.delete.useMutation({
    onMutate: async (deleteID) => {
      // предотвращаем рефетч
      await trpc.todo.all.cancel();
      //
      const previousTodos = trpc.todo.all.getData();

      trpc.todo.all.setData(undefined, (prev) => {
        if (!prev) return previousTodos;
        return prev.filter((todo) => todo.id !== deleteID);
      });

      return { previousTodos };
    },

    onError: (err, newTodo, context) => {
      toast.error("An error occured when deteting todo");
      trpc.todo.all.setData(undefined, () => context?.previousTodos);
    },

    onSuccess: () => {
      toast.success("Todo deleted! ❌");
    },
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
        <label
          htmlFor={todo.id}
          className={`cursor-pointer ${done ? "line-through" : " "}`}
        >
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
