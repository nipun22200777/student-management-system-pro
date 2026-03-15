import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🎓</span>
        <h2>StudentMS</h2>
        {user && (
          <span className={`role-badge ${user.role === 'admin' ? 'admin' : 'student'}`}>
            {user.role === 'admin' ? '🛡️ Admin' : '👤 Student'}
          </span>
        )}
      </div>

      <div className="nav-links">
        {user ? (
          <>
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/add">+ Add Student</NavLink>
            <NavLink to="/view">Students</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <button onClick={handleLogout} className="theme-toggle" style={{ marginLeft: '10px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register">Register</NavLink>
          </>
        )}
        <button 
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle"
          aria-label="Toggle Dark Mode"
          style={{ marginLeft: '10px' }}
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;