import { Link } from "react-router";

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2>Oops! Page Not Found!</h2>
      <p className="not-found-text">
        The destination you are trying to reach does not exist.
      </p>

      <div className="recovery-links">
        <Link to="/" className="btn-link">
          Back to Home Page
        </Link>
        <Link to="/todos">Todos</Link>
        <Link to="/about">About</Link>
      </div>
    </div>
  );
}

export default NotFoundPage