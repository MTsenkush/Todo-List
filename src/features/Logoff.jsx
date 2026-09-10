import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

function Logoff() {
  const { logout } = useAuth();
  const [logoffError, setLogoffError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  
  async function handleLogoff() {
    setLogoffError('');
    setIsLoggingOff(true);

    try {
      const result = await logout();

      if (!result.success) {
        setLogoffError(result.error || 'Logout failed');
      }
    } finally {
      setIsLoggingOff(false);
    }
  }

  return (
    <>
      {logoffError && (
        <div style={{ color: 'red' }}> {logoffError} </div>
      )}

      <button type="button" onClick={handleLogoff} disabled={isLoggingOff}>
        {isLoggingOff ? 'Logging out...' : 'Log Off'}
      </button> 
    </>
  );
}

export default Logoff;