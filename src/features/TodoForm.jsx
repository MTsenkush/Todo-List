import { useRef, useState } from 'react';

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

      <label htmlFor='todoTitle'>
        Todo
      </label>

      <input
        ref={inputRef}
        type='text'
        id='todoTitle'
        name='todoTitle'
        placeholder={'Todo Text'}
        required
        value={workingTodoTitle}
        onChange={e => setWorkingTodoTitle(e.target.value)}
      />
      <button type='submit' disabled={!workingTodoTitle.trim()}>
        Add Todo
      </button>

    </form>
  );
}

export default TodoForm;