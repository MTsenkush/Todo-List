import './App.css'
import TodosPage from './features/Todos/TodosPage.jsx';
import Header from './shared/Header.jsx';
import Logon from './features/Logon.jsx';
import { useAuth } from "./contexts/AuthContext.jsx";


//main app component
function App() {

  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />
      { isAuthenticated ? <TodosPage /> : <Logon />}
    </>
  );
}

export default App;
