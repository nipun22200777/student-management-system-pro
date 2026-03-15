import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Toast, { type ToastMessage } from './Toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ message, type });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        login(data);
        showToast('Login successful!', 'success');
        setTimeout(() => navigate('/'), 1000);
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="student-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="form-control"
          />
        </div>
        <div className="form-group" style={{ position: 'relative' }}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="form-control"
          />
          <div style={{ textAlign: 'right', marginTop: '5px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.9rem', color: '#007bff', textDecoration: 'none' }}>Forgot Password?</Link>
          </div>
        </div>
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
          Login
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
      <Toast message={toast} onClear={() => setToast(null)} />
    </div>
  );
}

export default Login;
