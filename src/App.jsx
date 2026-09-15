import { Routes, Route } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import TodosPage from './pages/TodosPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
import RequireAuth from './components/RequireAuth';
import Header from './shared/Header.jsx';
import Footer from './shared/Footer.jsx';

function App() {

  return (
    <div className="flex flex-col bg-white shadow-md rounded max-w-4xl mx-auto min-h-screen">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/todos"
          element={
            <RequireAuth>
              <TodosPage />
            </RequireAuth>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <ProfilePage />
            </RequireAuth>
          }
        />
        
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer/>
    </div>
  );
}

export default App;
