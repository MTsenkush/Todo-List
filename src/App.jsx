import './App.css'
import TodoList from './features/TodoList/TodoList.jsx';
import TodoForm from './features/TodoForm.jsx';
import { useState } from 'react';

//main app component
function App() {

  //current state, update function, initaial state
  const [todoList, setTodoList] = useState([])

  function addTodo(todoTitle) {
      const newTodo = {
        id: Date.now(),
        title: todoTitle,
        isCompleted: false
      };

      setTodoList((prev) => [newTodo, ...prev]);
  }

  function completeTodo(id) {
    setTodoList(prevList =>
      prevList.map(todo =>
        todo.id === id
          ? { ...todo, isCompleted: true }
          : todo
      )
    );
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList} onCompleteTodo={completeTodo} />
    </div>
  )
}

export default App
