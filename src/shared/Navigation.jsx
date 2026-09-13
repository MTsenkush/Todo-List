import { NavLink } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function Navigation() {
  const { isAuthenticated } = useAuth();

  const navLinkStyle = ({ isActive }) => {
    return `hover:text-black hover:font-bold ${isActive ? 'text-black underline font-bold' : 'text-gray-600'}`;
  };

  return (
    <nav>
      <ul className="flex items-center space-x-6">
        <li>
          <NavLink to="/about" className={navLinkStyle}>
            About
          </NavLink>
        </li>
        
        <li><NavLink to="/" className={navLinkStyle}> Home </NavLink></li>
        
        {isAuthenticated ? (
          <>
            <li>
              <NavLink to="/todos" className={navLinkStyle}>
                Todos
              </NavLink>
            </li>

            <li>
              <NavLink to="/profile" className={navLinkStyle}>
                Profile
              </NavLink>
            </li>
          </>
        ) : (
          <li>
            <NavLink to="/login" className={navLinkStyle}>
              Login
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navigation;