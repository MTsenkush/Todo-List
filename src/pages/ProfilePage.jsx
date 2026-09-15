import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

function ProfilePage() {
  const { email, token } = useAuth();
  const [todoStats, setTodoStats] = useState({ total: 0, completed: 0, active: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTodoStats() {
      if (!token) return;

      try {
        setLoading(true);
        setError("");

        const options = {
          method: "GET",
          headers: { "X-CSRF-TOKEN": token },
          credentials: "include",
        };

        const response = await fetch("/api/tasks", options);

        if (response.status === 401) {
          throw new Error("Unauthorized");
        }

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }

        const data = await response.json();
        const todos = data.tasks || data;

        const total = todos.length;
        const completed = todos.filter((todo) => todo.isCompleted).length;
        const active = total - completed;

        setTodoStats({ total, completed, active });
      } catch (err) {
        setError(`Error loading statistics: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchTodoStats();
  }, [token]);

  const completionPercentage = todoStats.total > 0
      ? Math.round((todoStats.completed / todoStats.total) * 100)
      : 0;

  return (
    <div className="px-6 py-8">
      <h1 className="text-xl font-bold mb-6">User Profile</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Profile:</h2>
        <p className="text-gray-700 mb-1"><strong>Name: </strong>{email || "User"} </p>
        <p className="text-gray-700"><strong>Status:</strong> Authenticated Account </p>
      </div>

      <h2 className="text-lg font-semibold mb-3">Todo Statistics:</h2>

      {loading && <p className="text-gray-500">Loading statistics...</p>}
      {error && <p className="text-red-500 font-bold">{error}</p>}

      {!loading && !error && (
        <div className="flex gap-4 flex-wrap">
          <div className="border border-gray-200 rounded px-6 py-4">
            <h4 className="text-medium text-gray-600">Total</h4>
            <p className="text-2xl font-bold">
              {todoStats.total}
            </p>
          </div>
          <div className="border border-gray-200 rounded px-6 py-4">
            <h4 className="text-medium text-gray-600">Completed</h4>
            <p className="text-2xl text-green-600 font-bold">
              {todoStats.completed}
            </p>
          </div>
          <div className="border border-gray-200 rounded px-6 py-4">
            <h4 className="text-medium text-gray-600">Active</h4>
            <p className="text-2xl text-red-500 font-bold">
              {todoStats.active}
            </p>
          </div>
          <div className="border border-gray-200 rounded px-6 py-4">
            <h4 className="text-medium text-gray-600">Completion Rate</h4>
            <p className="text-2xl text-blue-600 font-bold">
              {completionPercentage}%
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage