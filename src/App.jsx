import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';

//main app component
function App() {

  //current state, update function, initaial state
  const [todoList, setTodoList] = useState([])

  function addTodo(todoTitle) {
      const newTodo = {
        id: Date.now(),
        title: todoTitle,
      };

      setTodoList((prev) => [newTodo, ...prev]);
  }

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm onAddTodo={addTodo}/>
      <TodoList todoList={todoList}/>
    </div>
  )
}

export default App
