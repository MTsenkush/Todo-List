//displays our <li> items as <ul>
import TodoListItem from './TodoListItem.jsx';
import { useMemo } from 'react';

function TodoList({ todoList, onUpdateTodo, onCompleteTodo, dataVersion }) {
    const filteredTodoList = useMemo(() => {
        return {
            version: dataVersion, // Include version in the returned object to track changes
            todos: todoList.filter(todo => !todo.isCompleted)
        };
    }, [todoList, dataVersion]);
    
    return (
        filteredTodoList.todos.length === 0 ? (
            <p>Add todo above to get started</p>
        ) : (
        <ul>
            {filteredTodoList.todos.map(todo => 
                <TodoListItem
                key={todo.id}
                todo={todo}
                onUpdateTodo={onUpdateTodo}
                onCompleteTodo={onCompleteTodo}
                />
            )}
        </ul>
        )
    );
}

export default TodoList;