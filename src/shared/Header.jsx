import { useAuth } from "../contexts/AuthContext.jsx";
import Logoff from '../features/Logoff.jsx';
import Navigation from './Navigation.jsx';

function Header() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-sky-100 shadow">
      <h1 className="text-xl font-bold pb-6 sm:pb-0">Todo List</h1>
      <Navigation />
      {isAuthenticated && <Logoff />}
    </header>
  );
}

export default Header;