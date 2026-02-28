import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', college: '', branch: '', year: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { ...form, year: parseInt(form.year) });
      login(res.data.token, { id: res.data.user_id, name: form.name });
      toast.success('Account created! Welcome 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0F', fontFamily: 'Inter,sans-serif',
      position: 'relative', overflow: 'hidden', padding: 20
    }}>
      {/* Background orbs */}
      <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(6,214,160,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle,rgba(124,92,252,0.1) 0%,transparent 70%)', pointerEvents: 'none' }} />

      <div style={{
        width: '100%', maxWidth: 540,
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
            background: 'linear-gradient(135deg,#06D6A0,#7C5CFC)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 900, color: '#fff',
            boxShadow: '0 0 30px rgba(6,214,160,0.4)'
          }}>🎓</div>
          <h2 style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 26, fontWeight: 800, color: '#F0F0FF', marginBottom: 8 }}>
            Create Your Account
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14 }}>Start your career journey today</p>
        </div>

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your name' },
              { name: 'email', label: 'Email Address', type: 'email', placeholder: 'you@email.com' },
              { name: 'password', label: 'Password', type: 'password', placeholder: 'Min 6 chars' },
              { name: 'college', label: 'College', type: 'text', placeholder: 'Institution' },
            ].map((f, i) => (
              <div key={f.name} style={{ gridColumn: i < 2 ? 'span 2' : 'span 1' }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{f.label}</label>
                <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} placeholder={f.placeholder} required
                  style={{
                    width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                    outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontSize: 14
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#06D6A0'; e.target.style.boxShadow = '0 0 0 3px rgba(6,214,160,0.15)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Branch</label>
              <input name="branch" type="text" value={form.branch} onChange={handle} placeholder="e.g. CSE" required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontSize: 14
                }}
                onFocus={(e) => { e.target.style.borderColor = '#06D6A0'; e.target.style.boxShadow = '0 0 0 3px rgba(6,214,160,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>Year of Study</label>
              <select name="year" value={form.year} onChange={handle} required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                  outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontSize: 14,
                  appearance: 'none', cursor: 'pointer'
                }}
                onFocus={(e) => { e.target.style.borderColor = '#06D6A0'; e.target.style.boxShadow = '0 0 0 3px rgba(6,214,160,0.15)'; }}
                onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
              >
                <option value="" style={{ background: '#13131F' }}>Select Year</option>
                {[1, 2, 3, 4].map(y => <option key={y} value={y} style={{ background: '#13131F' }}>Year {y}</option>)}
              </select>
            </div>
          </div>

          <button type="submit"
            style={{
              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 700, padding: '14px', marginTop: 16, borderRadius: 12,
              background: 'linear-gradient(135deg, #06D6A0, #04B486)', color: '#fff',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
              boxShadow: '0 4px 16px rgba(6,214,160,0.4)', opacity: loading ? 0.7 : 1
            }}
            disabled={loading}
            onMouseOver={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 24px rgba(6,214,160,0.5)')}
            onMouseOut={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(6,214,160,0.4)')}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <svg className="spinner" viewBox="0 0 50 50" style={{ width: 18, height: 18, animation: 'rotate 2s linear infinite' }}>
                  <circle className="path" cx="25" cy="25" r="20" fill="none" strokeWidth="5" stroke="#fff" style={{ animation: 'dash 1.5s ease-in-out infinite', strokeLinecap: 'round' }}></circle>
                </svg>
                Creating Account...
              </span>
            ) : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: 24, padding: '16px', borderRadius: 12, background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.15)', textAlign: 'center' }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#06D6A0', fontWeight: 700, textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={(e) => e.target.style.color = '#fff'} onMouseOut={(e) => e.target.style.color = '#06D6A0'}>
              Login here →
            </Link>
          </p>
        </div>
      </div>
      <style>
        {`
          @keyframes rotate { 100% { transform: rotate(360deg); } }
          @keyframes dash {
            0% { stroke-dasharray: 1, 150; stroke-dashoffset: 0; }
            50% { stroke-dasharray: 90, 150; stroke-dashoffset: -35; }
            100% { stroke-dasharray: 90, 150; stroke-dashoffset: -124; }
          }
        `}
      </style>
    </div>
  );
}
