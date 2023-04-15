import { number, z } from "zod";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";

// trpc создает типы для нас
type RouterOutputs = inferRouterOutputs<AppRouter>;
type allTodosOutput = RouterOutputs["todo"]["all"];

export type Todo = allTodosOutput[number]; // здесь мы говорим, что берем один экземпляр

export const todoInput = z
  .string({
    required_error: "Describe ypuy todo",
  })
  .min(1)
  .max(50);
