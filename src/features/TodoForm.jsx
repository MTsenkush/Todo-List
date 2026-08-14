import { useRef, useState } from 'react';
import TextInputWithLabel from '../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../utils/todoValidation.js';

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
    <form onSubmit={handleAddTodo}>

    <TextInputWithLabel
      ref={inputRef}
      onChange={(event) => setWorkingTodoTitle(event.target.value)}
      elementId="todoTitle"
      labelText="Todo"
      value={workingTodoTitle}
    />

      <button disabled={!isValidTodoTitle(workingTodoTitle)}>
        Add Todo
      </button>

    </form>
  );
}

export default TodoForm;