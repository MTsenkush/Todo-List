import { useRef, useState } from 'react';
import { z } from 'zod';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';

const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Todo title can not exceed 100 characters')
});

//form to add new todo
function TodoForm({ onAddTodo }) {

  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');
  
  const [validationError, setValidationError] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    const validationResult = todoSchema.safeParse({title: workingTodoTitle});
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setValidationError(errors.title?.[0]);
      return;
    }

    setValidationError('');

    onAddTodo(validationResult.data.title);
    setWorkingTodoTitle('');
    inputRef.current.focus();
  };

  return (
    <form
      onSubmit={handleAddTodo}
      className="flex gap-2 mb-6 flex-col"
    >
      <div className="flex items-center gap-2 mb-2">
        <TextInputWithLabel
          ref={inputRef}
          onChange={(event) => setWorkingTodoTitle(event.target.value)}
          elementId="todoTitle"
          labelText="Todo"
          value={workingTodoTitle}
        />

        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
        >
          Add Todo
        </button>
      </div>

      {validationError && <p className="text-red-500">{validationError}</p>}

    </form>
  );
}

export default TodoForm;