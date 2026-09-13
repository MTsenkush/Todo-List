import { useRef, useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';

//form to add new todo
function TodoForm({ onAddTodo }) {

  const inputRef = useRef();
  const [workingTodoTitle, setWorkingTodoTitle] = useState('');

  const handleAddTodo = (event) => {
    event.preventDefault();

    const trimmedTitle = workingTodoTitle.trim();

    if (trimmedTitle) {
      onAddTodo(trimmedTitle);
       setWorkingTodoTitle('');
      inputRef.current.focus();
    }
  };

  return (
    <form
      onSubmit={handleAddTodo}
      className="flex items-center gap-2 mb-6"
    >

    <TextInputWithLabel
      ref={inputRef}
      onChange={(event) => setWorkingTodoTitle(event.target.value)}
      elementId="todoTitle"
      labelText="Todo"
      value={workingTodoTitle}
    />

    <button
      disabled={!isValidTodoTitle(workingTodoTitle)}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
    >
      Add Todo
    </button>

    </form>
  );
}

export default TodoForm;