import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="text-center max-w-3xl mx-auto px-6 py-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-3">Oops! Page Not Found!</h2>
      <p className="text-gray-700 mb-8">
        The destination you are trying to reach does not exist.
      </p>

      <div className="flex justify-center items-center gap-4">
        <Link to="/" className="bg-gray-800 text-white rounded px-4 py-2 hover:bg-gray-700">
          Back to Home Page
        </Link>
        <Link to="/todos" className="text-gray-700 hover:underline">Todos</Link>
        <Link to="/about" className="text-gray-700 hover:underline">About</Link>
      </div>
    </div>
  );
}

export default NotFoundPage