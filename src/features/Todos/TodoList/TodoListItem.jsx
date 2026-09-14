import { useState } from 'react';
import { z } from 'zod';
import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { useEditableTitle } from '../../../hooks/useEditableTitle.js';

const todoSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(100, 'Todo title can not exceed 100 characters')
});

function TodoListItem({ todo, onUpdateTodo, onCompleteTodo }) {

    const {
        isEditing,
        workingTitle,
        startEditing,
        cancelEdit,
        updateTitle,
        finishEdit
    } = useEditableTitle(todo.title);

    const [validationError, setValidationError] = useState('');

    function handleUpdate(event) {
        if (!isEditing) return;
        event.preventDefault();

        const validationResult = todoSchema.safeParse({title: workingTitle});
    
        if (!validationResult.success) {
            const errors = validationResult.error.flatten().fieldErrors;
            setValidationError(errors.title?.[0]);
            return;
        }

        setValidationError('');

        finishEdit();
        onUpdateTodo({ ...todo, title: validationResult.data.title });
    }

    function handleCancel() {
        setValidationError('');
        cancelEdit();
    }

    return (
    <li className="border border-gray-200 rounded px-4 py-3">
        <form onSubmit={handleUpdate} className="flex items-center gap-3">
        {isEditing ? (
            <div className="flex gap-2 flex-col">
                <div className="flex gap-3 flex-col sm:flex-row sm:items-center">
                    <TextInputWithLabel 
                        value={workingTitle}
                        onChange={e => updateTitle(e.target.value)}
                        elementId={`editTitle${todo.id}`}
                        labelText="Todo"
                    />
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdate}
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Update
                        </button>
                    </div>
                </div>
                
                {validationError && <p className="text-red-500">{validationError}</p>}
            </div>
        ) : (
          <>
            <label>
                <input
                    type="checkbox"
                    id={`checkbox${todo.id}`}
                    checked={todo.isCompleted}
                    onChange={() => !todo.isCompleted && onCompleteTodo(todo.id)}
                    className="w-4 h-4"
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