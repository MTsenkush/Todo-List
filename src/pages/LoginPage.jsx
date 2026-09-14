import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { z } from 'zod';
import { useAuth } from '../contexts/AuthContext';

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter valid email'),

  password: z
    .string()
    .min(1, 'Password is required')
});

function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [authError, setAuthError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const [isLoggingOn, setIsLoggingOn] = useState(false);

  const from = location.state?.from?.pathname || '/todos';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  async function handleSubmit(event) {
    event.preventDefault();
    setAuthError('');
    setValidationErrors({});

    const validationResult = loginSchema.safeParse({email, password});
    
    if (!validationResult.success) {
      const errors = validationResult.error.flatten().fieldErrors;
      setValidationErrors({
        email: errors.email?.[0],
        password: errors.password?.[0]
      });
      return;
    }

    setIsLoggingOn(true);

    try {
      const result = await login(validationResult.data.email, validationResult.data.password);

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
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 my-4 max-w-md mx-auto">
      <h2 className="text-lg font-bold mb-6">Login</h2>
      {authError && <p className="text-red-500">{authError}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email">Email</label>

          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={isLoggingOn}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          {validationErrors.email && <p className="text-red-500">{validationErrors.email}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoggingOn}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />

          {validationErrors.password && <p className="text-red-500">{validationErrors.password}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoggingOn}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline hover:cursor-pointer"
        >
          {isLoggingOn ? "Logging in..." : "Log On"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;