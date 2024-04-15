//import TodoForm from "./TodoForm";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import { todo } from "node:test";
import { Button } from "./components/ui/button";
import { DeleteIcon, EditIcon, TrashIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
interface Todo {
  id: BigInteger;
  todo_name: string;
  description: string;
  dueDate: string;
  tags: string[];
}

/* const todos: Todo[] = [
  {
    id: 1,
    todo_name: "Complete project",
    description: "Finish the coding part of the project",
    dueDate: "2024-04-30",
    tags: ["work", "programming"],
  },
  {
    id: 2,
    todo_name: "Buy groceries",
    description: "Get fruits, vegetables, and milk",
    dueDate: "2024-04-15",
    tags: ["personal", "shopping"],
  },
  {
    id: 3,
    todo_name: "Exercise",
    description: "Go for a jog in the park",
    dueDate: "2024-04-16",
    tags: ["personal", "health"],
  },
]; */
function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
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
  const handle_delete = (id) => {
    fetch(`http://localhost:8000/api/todo/${id}`, {
      method: "DELETE",
    }).then((res) => {
      console.log(id, "dsadasdas");
      setTodos(todos.filter((todo) => todo.id != id));
    });
  };
  useEffect(() => {
    fetch("http://localhost:8000/api/todo/", {})
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        fetch_data(data);
      });
  }, []);
  const formSchema = z.object({
    todo_name: z.string().min(2, {
      message: "title must be at least 2 characters.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo_name: "",
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    fetch("http://localhost:8000/api/todo/", {
      method: "POST",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        todo_name: values.todo_name,
        tag: [{ id: 1, name: "New" }],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setTodos([...todos, data]);
        setTitle("");
      });
    form.reset();
  }
  return (
    <>
      <main className="grid rounded shadow-md mx-auto p-4 space-y-6 max-w-md">
        <p className="text-sm text-muted-foreground">
          Press{" "}
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>{" "}
          for search
        </p>
        <SearchBar todos={todos} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="todo_name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Todo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <Accordion type="single" collapsible className="w-full">
          {todos.map((todo, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>{todo.todo_name}</AccordionTrigger>
              <AccordionContent>
                <div className="grid">
                  {todo.description}
                  <div className="space-x-3 my-2">
                    <Button variant="outline" size="icon">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          className=" bg-red-600  hover:bg-red-500"
                          variant="outline"
                          size="icon"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete your Todo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => handle_delete(todo.id)}
                          >
                            <a href={`/edit/${id}`}>Cancel</a>
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handle_delete(todo.id)}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

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
