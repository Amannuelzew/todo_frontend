import React, { useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
interface Todo {
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
}
function Todo({ todo }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id={todo.id} />
      <label
        htmlFor={todo.id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {todo.todo_name}
      </label>
    </div>
  );
}

export default Todo;
