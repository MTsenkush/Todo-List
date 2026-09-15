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
    dispatch({
      type: TODO_ACTIONS.SET_FILTER,
      payload: { filterTerm: newTerm },
    });
  };

  const invalidateCache = useCallback(() => {
    dispatch({ type: TODO_ACTIONS.INCREMENT_DATA_VERSION });
  }, []);

  useEffect(() => {

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

  async function completeTodo(id, isCompleted) {
    const originalTodo = todoList.find(todo => todo.id === id);
    if (!originalTodo) return;

    dispatch({
      type: TODO_ACTIONS.COMPLETE_TODO_START,
      payload: { id, isCompleted },
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
          isCompleted
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

  async function deleteTodo(id) {
    const originalTodo = todoList.find(todo => todo.id === id);
    if (!originalTodo) return;

    dispatch({
      type: TODO_ACTIONS.DELETE_TODO_START,
      payload: { id },
    });

    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': token,
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_SUCCESS,
      });

      invalidateCache();

    } catch (err) {
      dispatch({
        type: TODO_ACTIONS.DELETE_TODO_ERROR,
        payload: {
          originalTodo,
          message: err.message || 'Failed to delete todo',
        },
      });
    }
  }

  return (
    <div className="px-6 py-8">
      
      {/* Error section */}
      {error && (
        <div className="text-red-500 mb-4 font-bold">
          <p>{error}</p>
          <button
            onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_ERROR })}
            type="button"
            className="border border-red-300 rounded px-3 py-1 hover:bg-red-100 hover:cursor-pointer"
          >
            Clear Error
          </button>
        </div>
      )}

      {filterError && (
        <div className="text-red-500 mb-4 font-bold">
          <p className="pb-2">{filterError}</p>
          <div className="flex gap-2">
            <button
              onClick={() => dispatch({ type: TODO_ACTIONS.CLEAR_FILTER_ERROR })}
              type="button"
              className="border border-red-300 rounded px-3 py-1 hover:bg-red-100 hover:cursor-pointer"
            >
              Clear Filter Error
            </button>
            <button
              onClick={() => dispatch({ type: TODO_ACTIONS.RESET_FILTERS })}
              type="button"
              className="border border-red-300 rounded px-3 py-1 hover:bg-red-100 hover:cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}

      {isTodoListLoading && (
        <div className="text-gray-500 mb-4">Loading...</div>
      )}

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
    
      <FilterInput
        filterTerm={filterTerm}
        onFilterChange={handleFilterChange}
      />

      <TodoForm onAddTodo={addTodo} />
      <TodoList
        todoList={todoList}
        onUpdateTodo={updateTodo}
        onCompleteTodo={completeTodo}
        onDeleteTodo={deleteTodo}
        dataVersion={dataVersion}
        statusFilter={statusFilter}
      />
    </div>
  );
}

export default TodosPage;