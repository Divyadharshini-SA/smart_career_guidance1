import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../AuthContext';

export default function Login() {
  const [form, setForm]   = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, { id:res.data.user_id, name:res.data.name, role:res.data.role });
      toast.success('Welcome back! 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex',
      background:'#0A0A0F', fontFamily:'Inter,sans-serif',
      position:'relative', overflow:'hidden'
    }}>
      {/* Background orbs */}
      <div style={{ position:'absolute', top:'-20%', left:'-10%', width:600, height:600, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,92,252,0.12) 0%,transparent 70%)', pointerEvents:'none' }}/>
      <div style={{ position:'absolute', bottom:'-20%', right:'-10%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(6,214,160,0.1) 0%,transparent 70%)', pointerEvents:'none' }}/>

      {/* Left panel */}
      <div style={{
        flex:1, display:'flex', flexDirection:'column',
        justifyContent:'center', padding:'60px 80px',
        display: window.innerWidth < 768 ? 'none' : 'flex'
      }}>
        <div style={{ marginBottom:48 }}>
          <div style={{
            width:52, height:52, borderRadius:14,
            background:'linear-gradient(135deg,#7C5CFC,#06D6A0)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:26, fontWeight:900, color:'#fff',
            boxShadow:'0 0 30px rgba(124,92,252,0.4)',
            marginBottom:24
          }}>S</div>
          <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:42, fontWeight:800, color:'#F0F0FF', lineHeight:1.2, marginBottom:16 }}>
            Your AI-Powered<br/>
            <span style={{ background:'linear-gradient(135deg,#7C5CFC,#06D6A0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              Career Guide
            </span>
          </h1>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:16, lineHeight:1.7 }}>
            Personalized assessments, smart career predictions,<br/>and AI-guided learning roadmaps.
          </p>
        </div>

        {/* Feature pills */}
        {['📊 Topic-wise Assessments','🤖 AI Career Prediction','🗺️ Smart Roadmaps','💼 Placement Prep'].map(f => (
          <div key={f} style={{
            display:'inline-flex', alignItems:'center', gap:10,
            padding:'10px 18px', borderRadius:12,
            background:'rgba(255,255,255,0.04)',
            border:'1px solid rgba(255,255,255,0.08)',
            marginBottom:10, color:'rgba(255,255,255,0.7)',
            fontSize:14, fontWeight:600, width:'fit-content'
          }}>{f}</div>
        ))}
      </div>

      {/* Right: Login card */}
      <div style={{
        width: '100%', maxWidth:480,
        display:'flex', alignItems:'center', justifyContent:'center',
        padding:32, flexShrink:0
      }}>
        <div style={{
          width:'100%',
          background:'rgba(255,255,255,0.04)',
          border:'1px solid rgba(255,255,255,0.1)',
          borderRadius:28, padding:40,
          backdropFilter:'blur(20px)',
          boxShadow:'0 32px 80px rgba(0,0,0,0.5)'
        }}>
          <div style={{ marginBottom:32 }}>
            <h2 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:26, fontWeight:800, color:'#F0F0FF', marginBottom:8 }}>
              Sign In
            </h2>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14 }}>Welcome back to Smart Career Guidance</p>
          </div>

          <form onSubmit={submit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>
                Email Address
              </label>
              <input name="email" type="email" value={form.email} onChange={handle}
                placeholder="you@email.com" required />
            </div>
            <div>
              <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.6)', marginBottom:8 }}>
                Password
              </label>
              <input name="password" type="password" value={form.password} onChange={handle}
                placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary"
              style={{ width:'100%', justifyContent:'center', fontSize:15, padding:'13px', marginTop:8 }}
              disabled={loading}>
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div style={{ marginTop:24, padding:'16px', borderRadius:12, background:'rgba(124,92,252,0.08)', border:'1px solid rgba(124,92,252,0.15)', textAlign:'center' }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'#7C5CFC', fontWeight:700, textDecoration:'none' }}>
                Create one free →
              </Link>
            </p>
          </div>
        </div>
      </div>
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
