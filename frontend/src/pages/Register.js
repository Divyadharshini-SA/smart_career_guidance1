import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name:'', email:'', password:'', college:'', branch:'', year:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/register', { ...form, year: parseInt(form.year) });
      login(res.data.token, { id: res.data.user_id, name: form.name });
      toast.success('Account created! Welcome 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg,#FF6584 0%,#6C63FF 100%)', padding: 20
    }}>
      <div style={{ background: '#fff', borderRadius: 24, padding: 40, width: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎓</div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#6C63FF' }}>Create Your Account</h1>
          <p style={{ color: '#7A7A9D', marginTop: 6 }}>Start your career journey today</p>
        </div>
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { name:'name',    label:'👤 Full Name',    type:'text',  placeholder:'Your full name' },
            { name:'email',   label:'📧 Email',        type:'email', placeholder:'you@email.com' },
            { name:'password',label:'🔒 Password',     type:'password', placeholder:'Min 6 characters' },
            { name:'college', label:'🏫 College Name', type:'text',  placeholder:'Your college' },
            { name:'branch',  label:'📚 Branch',       type:'text',  placeholder:'e.g. CSE, ECE, IT' },
          ].map(f => (
            <div key={f.name}>
              <label style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, display: 'block' }}>{f.label}</label>
              <input name={f.name} type={f.type} value={form[f.name]} onChange={handle} placeholder={f.placeholder} required />
            </div>
          ))}
          <div>
            <label style={{ fontWeight: 700, fontSize: 13, marginBottom: 5, display: 'block' }}>📅 Year of Study</label>
            <select name="year" value={form.year} onChange={handle} required>
              <option value="">Select Year</option>
              {[1,2,3,4].map(y => <option key={y} value={y}>Year {y}</option>)}
            </select>
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
            {loading ? '⏳ Creating...' : '🚀 Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 20, color: '#7A7A9D', fontSize: 14 }}>
          Already have an account? <Link to="/login" style={{ color: '#6C63FF', fontWeight: 700 }}>Login</Link>
        </p>
      </div>
    </div>
  );
}
