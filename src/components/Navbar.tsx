import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-logo">🎓</span>
        <h2>StudentMS</h2>
      </div>

      <div className="nav-links">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/add">+ Add Student</NavLink>
        <NavLink to="/view">Students</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <button 
          onClick={() => setIsDark(!isDark)}
          className="theme-toggle"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;