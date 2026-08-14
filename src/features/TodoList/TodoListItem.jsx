import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel';

//todo item <li> as a new component
function TodoListItem({ todo, onCompleteTodo }) {

    const [isEditing, setIsEditing] = useState(false);
    const [workingTitle, setWorkingTitle] = useState(todo.title);

    function handleCancel() {
        setWorkingTitle(todo.title);
        setIsEditing(false);
    }

    return (
    <li>
        <form>
        {isEditing ? (
            <>
                <TextInputWithLabel 
                    value={workingTitle}
                    onChange={e => setWorkingTitle(e.target.value)}
                    elementId={`editTitle${todo.id}`}
                    labelText="Todo"
                />
                <button type="button" onClick={handleCancel}>Cancel</button>
            </>
        ) : (
          <>
        <label>
            <input
                type="checkbox"
                id={`checkbox${todo.id}`}
                checked={todo.isCompleted}
                onChange={() => onCompleteTodo(todo.id)}
            />
        </label>

        <span onClick={() => setIsEditing(true)}>
              {todo.title}
            </span>
          </>
        )}
      </form>
    </li>
    );
}

export default TodoListItem;