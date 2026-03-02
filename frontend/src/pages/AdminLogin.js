import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * AdminLogin.js — SECURITY FIX
 * 
 * The original version had a hardcoded password in client-side JS:
 *   const ADMIN_PASSWORD = 'scg_admin_2024'   ← visible to anyone in DevTools!
 * 
 * Fixed approach:
 *   Admin users log in via the SAME /login page as students.
 *   Their role='admin' is set in the database and returned in the JWT.
 *   The backend checks user.role === 'admin' on every admin endpoint.
 *   This page simply redirects to /login if not already authenticated.
 */
export default function AdminLogin() {
  const { isAuth, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuth && user?.role === 'admin') {
      navigate('/dashboard/admin');
    } else {
      // Redirect to the regular login page — admin uses same login form
      navigate('/login');
    }
  }, [isAuth, user, navigate]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0A0A0F', fontFamily: 'Inter,sans-serif'
    }}>
      <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
        Redirecting to login...
      </div>
    </div>
  );
}


// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// export default function AdminLogin() {
//   const [pwd, setPwd]     = useState('');
//   const [error, setError] = useState('');
//   const navigate          = useNavigate();
//   const ADMIN_PASSWORD    = 'scg_admin_2024';

//   const login = e => {
//     e.preventDefault();
//     if (pwd === ADMIN_PASSWORD) {
//       localStorage.setItem('admin_access', pwd);
//       navigate('/admin');
//     } else { setError('Wrong password!'); }
//   };

//   return (
//     <div style={{
//       minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
//       background:'#0A0A0F', fontFamily:'Inter,sans-serif', position:'relative', overflow:'hidden'
//     }}>
//       <div style={{ position:'absolute', top:'15%', left:'10%', width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,92,252,0.1) 0%,transparent 70%)', pointerEvents:'none' }}/>
//       <div style={{ position:'absolute', bottom:'15%', right:'10%', width:250, height:250, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,107,107,0.08) 0%,transparent 70%)', pointerEvents:'none' }}/>

//       <div style={{
//         width:400, background:'rgba(255,255,255,0.04)',
//         border:'1px solid rgba(255,255,255,0.1)',
//         borderRadius:28, padding:44,
//         backdropFilter:'blur(20px)',
//         boxShadow:'0 32px 80px rgba(0,0,0,0.5)'
//       }}>
//         <div style={{ textAlign:'center', marginBottom:32 }}>
//           <div style={{
//             width:60, height:60, borderRadius:16, margin:'0 auto 18px',
//             background:'linear-gradient(135deg,#FF6B6B,#7C5CFC)',
//             display:'flex', alignItems:'center', justifyContent:'center',
//             fontSize:28, boxShadow:'0 0 28px rgba(124,92,252,0.4)'
//           }}>🔐</div>
//           <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:24, fontWeight:800, color:'#F0F0FF', marginBottom:8 }}>Admin Access</h1>
//           <p style={{ color:'rgba(255,255,255,0.3)', fontSize:14 }}>Restricted to administrators only</p>
//         </div>

//         <form onSubmit={login} style={{ display:'flex', flexDirection:'column', gap:16 }}>
//           <div>
//             <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:8 }}>Admin Password</label>
//             <input type="password" value={pwd}
//               onChange={e => { setPwd(e.target.value); setError(''); }}
//               placeholder="Enter admin password" autoFocus />
//           </div>
//           {error && (
//             <div style={{ padding:'10px 14px', borderRadius:10, background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.25)', color:'#FF6B6B', fontSize:13, fontWeight:700, textAlign:'center' }}>
//               ❌ {error}
//             </div>
//           )}
//           <button type="submit" className="btn btn-primary" style={{ justifyContent:'center', fontSize:15, padding:'13px', marginTop:4 }}>
//             🚀 Access Admin Panel
//           </button>
//         </form>

//         <p style={{ textAlign:'center', marginTop:20, color:'rgba(255,255,255,0.2)', fontSize:12 }}>
//           Students do not have access to this page
//         </p>
//       </div>
//     </div>
//   );
// }


// // import React, { useState } from 'react';
// // import { useNavigate } from 'react-router-dom';

// // export default function AdminLogin() {
// //   const [pwd, setPwd]       = useState('');
// //   const [error, setError]   = useState('');
// //   const navigate             = useNavigate();

// //   const ADMIN_PASSWORD = 'scg_admin_2024'; // change this

// //   const login = e => {
// //     e.preventDefault();
// //     if (pwd === ADMIN_PASSWORD) {
// //       localStorage.setItem('admin_access', pwd);
// //       navigate('/admin');
// //     } else {
// //       setError('Wrong password!');
// //     }
// //   };

// //   return (
// //     <div style={{
// //       minHeight:'100vh', display:'flex', alignItems:'center',
// //       justifyContent:'center',
// //       background:'linear-gradient(135deg,#2D2D2D,#6C63FF)'
// //     }}>
// //       <div style={{ background:'#fff', borderRadius:24, padding:40, width:380,
// //         boxShadow:'0 20px 60px rgba(0,0,0,0.2)' }}>
// //         <div style={{ textAlign:'center', marginBottom:28 }}>
// //           <div style={{ fontSize:48, marginBottom:8 }}>🔐</div>
// //           <h1 style={{ fontWeight:900, fontSize:22, color:'#2D2D2D' }}>Admin Access</h1>
// //           <p style={{ color:'#7A7A9D', fontSize:14, marginTop:4 }}>
// //             Restricted to administrators only
// //           </p>
// //         </div>
// //         <form onSubmit={login} style={{ display:'flex', flexDirection:'column', gap:16 }}>
// //           <input
// //             type="password"
// //             value={pwd}
// //             onChange={e => { setPwd(e.target.value); setError(''); }}
// //             placeholder="Enter admin password"
// //           />
// //           {error && (
// //             <p style={{ color:'#FF6584', fontWeight:700, fontSize:14, textAlign:'center' }}>
// //               ❌ {error}
// //             </p>
// //           )}
// //           <button type="submit" className="btn btn-primary"
// //             style={{ justifyContent:'center', fontSize:16, padding:'13px' }}>
// //             🚀 Access Admin Panel
// //           </button>
// //         </form>
// //         <p style={{ textAlign:'center', marginTop:16, color:'#7A7A9D', fontSize:13 }}>
// //           Students do not have access to this page
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }