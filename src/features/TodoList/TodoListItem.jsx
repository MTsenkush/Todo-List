import { useState } from 'react';
import TextInputWithLabel from '../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../utils/todoValidation.js';
import { useEditableTitle } from '../../hooks/useEditableTitle.js';

//todo item <li> as a new component
function TodoListItem({ todo, onUpdateTodo, onCompleteTodo }) {

    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);

    function handleUpdate(event) {
        if (!isEditing) return;
        event.preventDefault();
        const finalTitle = finishEdit();
        onUpdateTodo({ ...todo, title: finalTitle });
    }

    return (
    <li>
        <form onSubmit={handleUpdate}>
        {isEditing ? (
            <>
                <TextInputWithLabel 
                    value={workingTitle}
                    onChange={e => updateTitle(e.target.value)}
                    elementId={`editTitle${todo.id}`}
                    labelText="Todo"
                />
                <button type="button" onClick={cancelEdit}>Cancel</button>
                <button type="button" onClick={handleUpdate} disabled={!isValidTodoTitle(workingTitle)}>Update</button>

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

        <span onClick={startEditing}>{todo.title}</span>
          </>
        )}
      </form>
    </li>
    );
}

export default TodoListItem;