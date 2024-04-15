interface Todo {
  title: string;
  description: string;
  dueDate: string;
  tags: string[];
}
function FilterTodo({ todo }) {
  return (
    <div className="flex items-center space-x-2">
      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
        {todo.todo_name}
      </label>
    </div>
  );
}

export default FilterTodo;
