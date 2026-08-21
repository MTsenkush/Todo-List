import './App.css'
import { useState } from 'react';
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';


//main app component
function App() {

  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');

  return (
    <>
      
      {/* part 4 says to pass 3 props to header but does not instruct what to do with them */}
      <Header token={token} onSetToken={setToken} onSetEmail={setEmail} />
      {token
        ? <TodosPage token={token} />
        : <Logon onSetEmail={setEmail} onSetToken={setToken} />
      }
    </>
  );
}

export default App;
