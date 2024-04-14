//import TodoForm from "./TodoForm";
import { Input } from "@/components/ui/input";
import Todo from "./components/Todo";
import { useEffect, useState } from "react";
import { hoursToSeconds } from "date-fns";
interface Todo {
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
}

// const todos: Todo[] = [
//   {
//     title: "Complete project",
//     description: "Finish the coding part of the project",
//     dueDate: "2024-04-30",
//     tags: ["work", "programming"],
//   },
//   {
//     title: "Buy groceries",
//     description: "Get fruits, vegetables, and milk",
//     dueDate: "2024-04-15",
//     tags: ["personal", "shopping"],
//   },
//   {
//     title: "Exercise",
//     description: "Go for a jog in the park",
//     dueDate: "2024-04-16",
//     tags: ["personal", "health"],
//   },
// ];
function App() {
  const [todos, setTodos] = useState([]);
  const handle_all = (e) => {
    setTodos(todos);
  };
  const handle_new = (e) => {
    setTodos(
      todos.filter((todo) => todo.tag.some((tag) => tag.name.includes("New")))
    );
  };
  const fetch_data = (data) => {
    setTodos(data);
  };
  useEffect(() => {
    fetch("http://localhost:8000/api/todo/", {})
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetch_data(data);
      });
  }, []);
  return (
    <>
      <main className="grid rounded shadow-md mx-auto p-4 space-y-6 max-w-md">
        <Input type="text" placeholder="Todo" />

        {todos.map((todo, index) => (
          <Todo todo={todo} key={index} />
        ))}

        <div className="flex justify-between">
          <p>{todos.length} | Todos</p>
          <div className="space-x-4">
            <button onClick={handle_all}>All</button>
            <button onClick={handle_new}>New</button>
            <button>Active</button>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
