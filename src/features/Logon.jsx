import { useState } from 'react';
import { useAuth } from "../contexts/AuthContext";

function Logon() {
  const { login } = useAuth();
  // controlled form inputs for login: email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Error message if autentification is failed
  const [authError, setAuthError] = useState('');

  // loading state
  const [isLoggingOn, setIsLoggingOn] = useState(false);

  //from submission handle
  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoggingOn(true);
    setAuthError('');

    try {
      const result = await login(email, password);

        if (!result.success) {
          setAuthError(result.error);
        }
    } finally {
      setIsLoggingOn(false);
    }
  }

  return (
    <div>
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

export default Logon;