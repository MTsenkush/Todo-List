import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authError, setAuthError] = useState('');

  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    try {
      const result = await login(email, password);

        if (!result.success) {
          setAuthError(result.error);
        }
    } catch {
      setAuthError('An unexpected error occurred.');
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      {authError && <p>{authError}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoggingOn}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoggingOn}
          />
        </div>

        <button type="submit" disabled={isLoggingOn}>
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;