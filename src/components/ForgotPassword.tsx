import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Toast, { type ToastMessage } from './Toast';

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showToast = (message: string, type: ToastMessage['type'] = 'success') => {
    setToast({ message, type });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('OTP sent to your email!', 'success');
        if (data.previewUrl) {
           console.log("Ethereal Email Preview URL:", data.previewUrl);
           showToast(`Test OTP sent. Check browser console for link.`, 'success');
        }
        setStep(2);
      } else {
        showToast(data.message || 'Failed to send OTP', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('OTP verified!', 'success');
        setStep(3);
      } else {
        showToast(data.message || 'Invalid OTP', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password reset successful!', 'success');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        showToast(data.message || 'Failed to reset password', 'error');
      }
    } catch {
      showToast('Network error', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '40px auto' }}>
      <h2>Forgot Password</h2>
      
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="student-form">
          <p style={{ marginBottom: '15px', color: '#666' }}>Enter your email address to receive an OTP.</p>
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
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="student-form">
          <p style={{ marginBottom: '15px', color: '#666' }}>Enter the 6-digit OTP sent to {email}.</p>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleResetPassword} className="student-form">
          <p style={{ marginBottom: '15px', color: '#666' }}>Enter your new password.</p>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="form-control"
            />
          </div>
          <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', marginTop: '10px' }}>
            {isLoading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}

      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        Remembered your password? <Link to="/login">Login here</Link>
      </p>
      <Toast message={toast} onClear={() => setToast(null)} />
    </div>
  );
}

export default ForgotPassword;
