import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router';

function Logoff() {
  const { logout } = useAuth();
  const [logoffError, setLogoffError] = useState('');
  const [isLoggingOff, setIsLoggingOff] = useState(false);
  const navigate = useNavigate(); 
  
  async function handleLogoff() {
    setLogoffError('');
    setIsLoggingOff(true);

    try {
      const result = await logout();

      if (result.success) {
        navigate('/login'); 
      } else {
        setLogoffError(result.error || 'Logout failed');
        setIsLoggingOff(false);
      }
    } catch {
      setLogoffError('An unexpected error occurred during logout.');
      setIsLoggingOff(false);
    }
  }

  return (
    <>
      {logoffError && (
        <div style={{ color: 'red' }}> {logoffError} </div>
      )}

      <button
        type="button"
        onClick={handleLogoff}
        disabled={isLoggingOff}
        className="text-gray-600 hover:text-black hover:font-bold hover:cursor-pointer"
      >
        {isLoggingOff ? 'Logging out...' : 'Log Off'}
      </button> 
    </>
  );
}

export default Logoff;