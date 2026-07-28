import './App.css'
import TodoList from './TodoList.jsx';
import TodoForm from './TodoForm.jsx';
import { useState } from 'react';

//array of our todos
const todos = [
    {id: 1, title: 'review resources'},
    {id: 2, title: 'take notes'},
    {id: 3, title: 'code out app'},
];

//main app component
function App() {

  //current state, update function, initaial state
  const [todoList, setTodoList] = useState(todos)

  return (
    <div>
      <h1>Todo List</h1>
      <TodoForm />
      <TodoList todoList={todoList}/>
    </div>
  )
}

export default App
