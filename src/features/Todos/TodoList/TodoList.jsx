//displays our <li> items as <ul>
import TodoListItem from './TodoListItem.jsx';

function TodoList({ todoList, onUpdateTodo, onCompleteTodo }) {
    const filteredTodoList = todoList.filter(todo => !todo.isCompleted);
    
    return (
        filteredTodoList.length === 0 ? (
            <p>Add todo above to get started</p>
        ) : (
        <ul>
            {filteredTodoList.map(todo => 
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