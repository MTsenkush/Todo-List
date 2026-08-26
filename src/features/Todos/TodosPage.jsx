import { useEffect, useState, useCallback } from 'react';
import TodoForm from './TodoForm.jsx';
import TodoList from './TodoList/TodoList.jsx';
import SortBy from "../../shared/SortBy.jsx";
import useDebounce from "../../utils/useDebounce";
import FilterInput from "../../shared/FilterInput.jsx";

function TodosPage({ token }) {
  const [todoList, setTodoList] = useState([]);
  const [error, setError] = useState('');
  const [filterError, setFilterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filterTerm, setFilterTerm] = useState('');
  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  const handleFilterChange = (newTerm) => {
    setFilterTerm(newTerm);
  };
  const [dataVersion, setDataVersion] = useState(0);
  const invalidateCache = useCallback(() => {
    setDataVersion(prev => prev + 1);
  }, []);

  useEffect(() => {

    // Async function to fetch todos from the server if token is avaliable
    if (!token) return;
    async function fetchTodos() {
      setIsLoading(true);
      setError('');
      try {
        const paramsObject = {
          sortBy,
          sortDirection,
          limit: 100
        };
        if (debouncedFilterTerm) {
          paramsObject.find = debouncedFilterTerm;
        }
        const params = new URLSearchParams(paramsObject);

        const response = await fetch(`/api/tasks?${params}`, {
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
        setFilterError('');
      } catch (error) {
        if (debouncedFilterTerm || sortBy !== 'createdAt' || sortDirection !== 'desc') {
          setFilterError(`Error filtering/sorting todos: ${error.message}`);
        } else {
          setError(`Error fetching todos: ${error.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm]);

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
      invalidateCache();
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
          createdAt: originalTodo.createdAt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
       invalidateCache();

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
        body: JSON.stringify({
          isCompleted: true,
          createdAt: originalTodo.createdAt
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }
      invalidateCache();

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

      {/* Filter error section */}
      {filterError && (
        <div style={{ color: 'orange', marginBottom: 8 }}>
          <p>{filterError}</p>
          <button
            style={{ marginRight: 8 }}
            onClick={() => setFilterError('')}
            type="button"
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => {
              setFilterTerm('');
              setSortBy('createAt');
              setSortDirection('desc');
              setFilterError('');
            }}
            type="button"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isLoading && (
        <div style={{ marginBottom: 8 }}>Loading...</div>
      )}

       {/* Sort options */}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={setSortBy}
        onSortDirectionChange={setSortDirection}
      />

      {/* Filter input */}
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      {/* Form and todo list */}
      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        dataVersion={dataVersion}
      />
    </div>
  );
}

export default TodosPage;