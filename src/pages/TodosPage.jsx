import { useEffect, useReducer, useCallback } from 'react';
import { useSearchParams } from 'react-router';
import TodoForm from '../features/Todos/TodoForm.jsx';
import TodoList from '../features/Todos/TodoList/TodoList.jsx';
import SortBy from "../shared/SortBy.jsx";
import useDebounce from "../utils/useDebounce.js";
import FilterInput from "../shared/FilterInput.jsx";
import StatusFilter from '../shared/StatusFilter';
import { TODO_ACTIONS, initialTodoState,  todoReducer } from '../reducers/todoReducer.js';
import { useAuth } from "../contexts/AuthContext.jsx";

function TodosPage() {

  const { token } = useAuth();  
  const [state, dispatch] = useReducer(todoReducer, initialTodoState);
  const [searchParams] = useSearchParams();
  const statusFilter = searchParams.get('status') || 'all';

  const {
    todoList,
    error,
    filterError,
    isTodoListLoading,
    sortBy,
    sortDirection,
    filterTerm,
    dataVersion,
  } = state;

  const debouncedFilterTerm = useDebounce(filterTerm, 300);
  
  const handleFilterChange = (newTerm) => {
    // setFilterTerm(newTerm);
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    });
  };

  const invalidateCache = useCallback(() => {
    //  setDataVersion(prev => prev + 1);
    dispatch({ type: TODO_ACTIONS.INCREMENT_DATA_VERSION });
  }, []);

  useEffect(() => {

    // Async function to fetch todos from the server if token is avaliable
    if (!token) return;

    async function fetchTodos() {
      dispatch({ type: TODO_ACTIONS.FETCH_START });
      
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
        dispatch({
        type: TODO_ACTIONS.FETCH_SUCCESS,
          payload: {
            todos: data.tasks || [],
          },
        });
      } catch (error) {
        const isFilterError =
          debouncedFilterTerm ||
          sortBy !== 'createdAt' ||
          sortDirection !== 'desc';

        dispatch({
          type: TODO_ACTIONS.FETCH_ERROR,
          payload: {
            message: isFilterError
              ? `Error filtering/sorting todos: ${error.message}`
              : `Error fetching todos: ${error.message}`,
            isFilterError,
          },
        });
      }
    }

    fetchTodos();
  }, [token, sortBy, sortDirection, debouncedFilterTerm, dataVersion]);

  // Add a new todo
  async function addTodo(todoTitle) {
    const tempTodo = {
      id: Date.now(),
      title: todoTitle,
      isCompleted: false,
    };

    dispatch({
      type: TODO_ACTIONS.ADD_TODO_START,
      payload: { tempTodo },
    });

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

      dispatch({
        type: TODO_ACTIONS.ADD_TODO_SUCCESS,
        payload: {
          tempTodoId: tempTodo.id,
          realTodo,
        },
      });

      invalidateCache();
    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.ADD_TODO_ERROR,
        payload: {
          tempTodoId: tempTodo.id,
          message: err.message || 'Failed to add todo',
        },
      });
    } 
  }

  // Update an existing todo
  async function updateTodo(editedTodo) {
    const originalTodo = todoList.find(todo => todo.id === editedTodo.id);
    if (!originalTodo) return;

    dispatch({
      type: TODO_ACTIONS.UPDATE_TODO_START,
      payload: { editedTodo },
    });

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
       
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_SUCCESS,
      });

      invalidateCache();

    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.UPDATE_TODO_ERROR,
        payload: {
          originalTodo,
          message: err.message || 'Failed to update todo',
        },
      });
    } 
  }

  // Completed Todo mark
  async function completeTodo(id) {
    const originalTodo = todoList.find(todo => todo.id === id);
    if (!originalTodo) return;

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include',
        body: JSON.stringify({
          title: originalTodo.title,
          isCompleted: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }

      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_SUCCESS,
      });

      invalidateCache();

    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.COMPLETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: err.message || 'Failed to complete todo',
        },
      });
    }
  }

  // Render the component
  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      
      {/* Error section */}
      {error && (
        <div className="text-red-500 mb-4">
          <p>{error}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            type="button"
            className="border border-red-300 rounded px-3 py-1 hover:bg-red-100"
          >
            Clear Error
          </button>
        </div>
      )}

      {/* Filter error section */}
      {filterError && (
        <div className="text-orange-500 mb-4">
          <p>{filterError}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
            type="button"
            className="border border-orange-300 rounded px-3 py-1 hover:bg-orange-100"
          >
            Clear Filter Error
          </button>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
            type="button"
            className="border border-orange-300 rounded px-3 py-1 hover:bg-orange-100"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {isTodoListLoading && (
        <div className="text-gray-500 mb-4">Loading...</div>
      )}

       {/* Sort options */}
      <SortBy
        sortBy={sortBy}
        sortDirection={sortDirection}
        onSortByChange={(newSortBy) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy: newSortBy,
              sortDirection,
            },
          })}
        onSortDirectionChange={(newSortDirection) =>
          dispatch({
            type: TODO_ACTIONS.SET_SORT,
            payload: {
              sortBy,
              sortDirection: newSortDirection
            },
          })
        }  
      />

      <StatusFilter />

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
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;