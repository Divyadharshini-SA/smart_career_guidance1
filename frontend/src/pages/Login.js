import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, { id: res.data.user_id, name: res.data.name, role: res.data.role });
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0F', fontFamily: 'Inter,sans-serif',
      position: 'relative', overflow: 'hidden', padding: 20
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,92,252,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,214,160,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      {/* Login card */}
      <div style={{
        width: '100%', maxWidth: 440,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24, padding: 40,
        backdropFilter: 'blur(20px)',
        boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        position: 'relative', zIndex: 1
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16, margin: '0 auto 24px',
            background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: '#fff',
            boxShadow: '0 0 30px rgba(124,92,252,0.4)'
          }}>S</div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 800, color: '#F0F0FF', marginBottom: 8 }}>
            Welcome Back
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Sign in to Smart Career Guidance</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              Email Address
            </label>
            <input name="email" type="email" value={form.email} onChange={handle}
              placeholder="you@email.com" required
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontSize: 14
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7C5CFC';
                e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
              Password
            </label>
            <input name="password" type="password" value={form.password} onChange={handle}
              placeholder="••••••••" required
              style={{
                width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontSize: 14
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#7C5CFC';
                e.target.style.boxShadow = '0 0 0 3px rgba(124,92,252,0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button type="submit"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, padding: '14px', marginTop: 8, borderRadius: 12,
              background: 'linear-gradient(135deg, #7C5CFC, #5A3FE0)', color: '#fff',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(124,92,252,0.4)', opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,92,252,0.5)')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,92,252,0.4)')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg className="spinner" viewBox="0 0 50 50" style={{ width: 18, height: 18, animation: 'rotate 2s linear infinite' }}>
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#fff" style={{ animation: 'dash 1.5s ease-in-out infinite', strokeLinecap: 'round' }}></circle>
                </svg>
                Signing in...
              </span>
            ) : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '16px', borderRadius: 12, background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.15)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#7C5CFC', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#7C5CFC'}>
              Create one free →
            </Link>
          </p>
        </div>
      </div>
      {/* 
      <style>
        {`
          @keyframes rotate { 100% { transform: rotate(360deg); } }
          @keyframes dash {
            0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
            100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
          }
        `}
      </style> */}
    </div>
  );
}


// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import API from '../api';
// import { useAuth } from '../AuthContext';

// export default function Login() {
//   const [form, setForm] = useState({ email: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const navigate  = useNavigate();

//   const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const submit = async e => {
//   e.preventDefault();
//   setLoading(true);
//   try {
//     const res = await API.post('/auth/login', form);
//     login(res.data.token, {
//       id  : res.data.user_id,
//       name: res.data.name,
//       role: res.data.role      // ← ADD THIS
//     });
//     toast.success('Welcome back! 🎉');
//     navigate('/');
//   } catch (err) {
//     toast.error(err.response?.data?.error || 'Login failed');
//   } finally { setLoading(false); }
// };

//   return (
//     <div style={{
//       minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
//       background: 'linear-gradient(135deg,#6C63FF 0%,#43E97B 100%)'
//     }}>
//       <div style={{ background: '#fff', borderRadius: 24, padding: 40, width: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
//         <div style={{ textAlign: 'center', marginBottom: 32 }}>
//           <div style={{ fontSize: 48, marginBottom: 8 }}>🚀</div>
//           <h1 style={{ fontSize: 26, fontWeight: 900, color: '#6C63FF' }}>Smart Career Guidance</h1>
//           <p style={{ color: '#7A7A9D', marginTop: 6 }}>Login to your account</p>
//         </div>
//         <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           <div>
//             <label style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, display: 'block' }}>📧 Email</label>
//             <input name="email" type="email" value={form.email} onChange={handle} placeholder="you@email.com" required />
//           </div>
//           <div>
//             <label style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, display: 'block' }}>🔒 Password</label>
//             <input name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••" required />
//           </div>
//           <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
//             {loading ? '⏳ Logging in...' : '🚀 Login'}
//           </button>
//         </form>
//         <p style={{ textAlign: 'center', marginTop: 20, color: '#7A7A9D', fontSize: 14 }}>
//           Don't have an account? <Link to="/register" style={{ color: '#6C63FF', fontWeight: 700 }}>Register here</Link>
//         </p>
//       </div>
//     </div>
//   );
// }
