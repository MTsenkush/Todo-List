import { useEffect, useState } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {

    // Async function to fetch todos from the server if token is avaliable
    if (!token) return;
    async function fetchTodos() {
      setIsLoading(true);
      setError('');
      try {
        const response = await fetch('/api/tasks?limit=100', {
          method: 'GET',
          headers: {
            'X-CSRF-TOKEN': token
          },
          credentials: 'include'
        });

        if (response.status === 401) {
          throw new Error('Error: Unauthorized');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }

      const data = await response.json();
        setTodoList(data.tasks || []);
      } catch (err) {
        setError(err.message || 'Error fetching todos');
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
  }, [token]);

  // Add a new todo
  async function addTodo(todoTitle) {
    setIsLoading(true);
    setError('');
    const tempTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };
    // Optimistic update UI
    setTodoList(prev => [tempTodo, ...prev]);
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ title: todoTitle, isCompleted: false }),
      });

      if (!response.ok) {
        throw new Error('Failed to add task');
      }

      const realTodo = await response.json();
      setTodoList(prev =>
        prev.map(todo => (todo.id === tempTodo.id ? realTodo : todo))
      );
    } catch (err) {
      setTodoList(prev => prev.filter(todo => todo.id !== tempTodo.id));
      setError(err.message || 'Failed to add todo');
    } finally {
      setIsLoading(false);
    }
  }

  // Update an existing todo
  async function updateTodo(editedTodo) {
    setIsLoading(true);
    setError('');
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
    if (!originalTodo) return;

    // Optimistic update UI
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === editedTodo.id ? { ...todo, ...editedTodo } : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${editedTodo.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: editedTodo.title,
          isCompleted: editedTodo.isCompleted,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

    } catch (err) {
      setError(err.message || 'Failed to update todo');
      //Rollback
      setTodoList(prev =>
        prev.map(todo => (todo.id === editedTodo.id ? originalTodo : todo))
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Completed Todo mark
  async function completeTodo(id) {
    setIsLoading(true);
    setError('');
    const originalTodo = todoList.find(todo => todo.id === id);
    if (!originalTodo) return;

    // Optimistic update UI
    setTodoList(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, isCompleted: true } : todo
      )
    );

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({ isCompleted: true }),
        });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }

    } catch (err) {
      setError(err.message || 'Failed to complete todo');
        setTodoList(prev =>
        prev.map(todo => (todo.id === id ? originalTodo : todo))
      );
    } finally {
      setIsLoading(false);
    }
  }

  // Render the component
  return (
    <div>
      
      {/* Error section */}
      {error && (
        <div style={{ color: 'red', marginBottom: 8 }}>
          {error}
          <button
            style={{ marginLeft: 8 }}
            onClick={() => setError('')}
            type="button"
          >
            Clear Error
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div style={{ marginBottom: 8 }}>Loading...</div>
      )}

      {/* Form and todo list */}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
      />
    </div>
  );
}

export default TodosPage;