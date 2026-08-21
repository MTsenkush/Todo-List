import { useState } from 'react';

function Logon({ onSetEmail, onSetToken }) {
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
      const response = await fetch('/api/users/logon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 200 && data.name && data.csrfToken) {
        onSetEmail(data.name);
        onSetToken(data.csrfToken);
      } else {
        setAuthError(`Authentication failed: ${data?.message }`);
      }
    } catch (error) {
      setAuthError(`Error: ${error.name} | ${error.message}`);
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