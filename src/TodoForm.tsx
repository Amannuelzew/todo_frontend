import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { cn } from "./lib/utils";
import { format } from "date-fns";
import { Calendar } from "./components/ui/calendar";

//import MultipleSelector, { Option } from "@/components/ui/multiple-selector";

const OPTIONS: Option[] = [
  { label: "New", value: "New" },
  { label: "Personal", value: "Personal" },
  { label: "Project", value: "Project" },
];
const optionSchema = z.object({
  label: z.string(),
  value: z.string(),
  disable: z.boolean().optional(),
});
const formSchema = z.object({
  todo_name: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z
    .string()
    .min(4, {
      message: "Description must be at least 8 characters.",
    })
    .max(160, {
      message: "Description must not be longer than 160 characters.",
    }),
  due_date: z.date({
    required_error: "A due date is required.",
  }),
  //tags: z.array(optionSchema).min(1),
});

export default function ProfileForm() {
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      todo_name: location.state.data.todo_name,
      description: location.state.data.description || "",
      due_date:
        new Date(
          location.state.data.due_date.split("-")[1] +
            "-" +
            location.state.data.due_date.split("-")[0] +
            "-" +
            location.state.data.due_date.split("-")[2]
        ) || new Date().toISOString().split("T")[0],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    fetch(`http://localhost:8000/api/todo/${location.state.data.id}`, {
      method: "PUT",
      headers: { "content-Type": "application/json" },
      body: JSON.stringify({
        todo_name: values.todo_name,
        description: values.description,
        due_date: values.due_date.toISOString().split("T")[0],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        navigate("/");
      });
    form.reset();
  }
  return (
    <div className="grid rounded shadow-md mx-auto p-4 space-y-6 max-w-md">
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
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Tell us a little bit about yourself"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="due_date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd.MM.yy")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>Due date for your todo.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}
