import TextInputWithLabel from '../../../shared/TextInputWithLabel.jsx';
import { isValidTodoTitle } from '../../../utils/todoValidation.js';
import { useEditableTitle } from '../../../hooks/useEditableTitle.js';

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
    <li className="border border-gray-200 rounded px-4 py-3">
        <form onSubmit={handleUpdate} className="flex items-center gap-3">
        {isEditing ? (
            <div className="flex gap-3 items-center flex-col sm:flex-row">
                <TextInputWithLabel 
                    value={workingTitle}
                    onChange={e => updateTitle(e.target.value)}
                    elementId={`editTitle${todo.id}`}
                    labelText="Todo"
                />
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={cancelEdit}
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleUpdate}
                        disabled={!isValidTodoTitle(workingTitle)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Update
                    </button>
                </div>

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