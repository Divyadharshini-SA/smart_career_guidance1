import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const NAV = [
  { to: '/dashboard', icon: '⬡', label: 'Dashboard' },
  { to: '/assessment', icon: '◈', label: 'Assessment' },
  { to: '/resume', icon: '◉', label: 'Resume' },
  { to: '/career', icon: '◎', label: 'Career' },
  { to: '/roadmap', icon: '◐', label: 'Roadmap' },
  { to: '/placement', icon: '◑', label: 'Placement' },
  { to: '/dashboard/assessment', icon: '◈', label: 'Assessment' },
  { to: '/dashboard/resume', icon: '◉', label: 'Resume' },
  { to: '/dashboard/career', icon: '◎', label: 'Career' },
  { to: '/dashboard/roadmap', icon: '◐', label: 'Roadmap' },
  { to: '/dashboard/placement', icon: '◑', label: 'Placement' },
  { to: '/dashboard/chatbot', icon: '◍', label: 'AI Mentor' },
  { to: '/dashboard/progress', icon: '◈', label: 'Progress' },
  { to: '/dashboard/profile', icon: '◯', label: 'Profile' },
];

const EMOJI_NAV = [
  { to: '/dashboard', emoji: '🏠', label: 'Dashboard' },
  { to: '/dashboard/assessment', emoji: '📝', label: 'Assessment' },
  { to: '/dashboard/resume', emoji: '📄', label: 'Resume' },
  { to: '/dashboard/career', emoji: '🎯', label: 'Career' },
  { to: '/dashboard/roadmap', emoji: '🗺️', label: 'Roadmap' },
  { to: '/dashboard/placement', emoji: '💼', label: 'Placement' },
  { to: '/dashboard/chatbot', emoji: '🤖', label: 'AI Mentor' },
  { to: '/dashboard/progress', emoji: '📊', label: 'Progress' },
  { to: '/dashboard/skillgap', emoji: '🎯', label: 'Skill Gap' },
  { to: '/dashboard/profile', emoji: '👤', label: 'Profile' },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [dark, setDark] = useState(true);

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F', fontFamily: 'Inter,sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: open ? 240 : 72,
        background: 'rgba(255,255,255,0.03)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        position: 'fixed', top: 0, left: 0,
        height: '100vh', zIndex: 100, overflowX: 'hidden'
      }}>

        {/* Logo */}
        <div style={{
          padding: open ? '28px 20px 20px' : '28px 0 20px',
          display: 'flex', alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          gap: 12, borderBottom: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10, flexShrink: 0,
            background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 900, color: '#fff',
            boxShadow: '0 0 20px rgba(124,92,252,0.4)'
          }}>S</div>
          {open && (
            <div>
              <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800, fontSize: 14, color: '#F0F0FF', lineHeight: 1.2 }}>
                Smart Career
              </div>
              <div style={{ fontSize: 11, color: 'rgba(124,92,252,0.8)', fontWeight: 600 }}>
                AI Guidance
              </div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {EMOJI_NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.to === '/dashboard'} style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: 12, padding: '11px 12px', borderRadius: 12,
              textDecoration: 'none',
              fontWeight: isActive ? 700 : 500,
              fontSize: 14,
              color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
              background: isActive
                ? 'linear-gradient(135deg,rgba(124,92,252,0.25),rgba(6,214,160,0.1))'
                : 'transparent',
              borderLeft: isActive ? '2px solid #7C5CFC' : '2px solid transparent',
              transition: 'all 0.2s',
              whiteSpace: 'nowrap', overflow: 'hidden',
              justifyContent: open ? 'flex-start' : 'center',
            })}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{n.emoji}</span>
              {open && <span>{n.label}</span>}
            </NavLink>
          ))}

          {/* Admin */}
          {user?.role === 'admin' && (
            <NavLink to="/dashboard/admin" style={({ isActive }) => ({
              display: 'flex', alignItems: 'center',
              gap: 12, padding: '11px 12px', borderRadius: 12,
              textDecoration: 'none', fontWeight: 700, fontSize: 14,
              color: isActive ? '#FFD93D' : 'rgba(255,217,61,0.5)',
              background: isActive ? 'rgba(255,217,61,0.1)' : 'transparent',
              border: '1px solid rgba(255,217,61,0.2)',
              marginTop: 8, transition: 'all 0.2s',
              whiteSpace: 'nowrap', overflow: 'hidden',
              justifyContent: open ? 'flex-start' : 'center',
            })}>
              <span style={{ fontSize: 18 }}>⚙️</span>
              {open && 'Admin Panel'}
            </NavLink>
          )}
        </nav>

        {/* Bottom: user + toggle + logout */}
        <div style={{ padding: '12px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>

          {/* Collapse toggle */}
          <button onClick={() => setOpen(!open)} style={{
            width: '100%', padding: '9px', borderRadius: 10, border: 'none',
            background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)',
            cursor: 'pointer', fontSize: 14, fontWeight: 700, marginBottom: 8,
            display: 'flex', alignItems: 'center',
            justifyContent: open ? 'flex-end' : 'center', gap: 6,
            transition: 'all 0.2s', fontFamily: 'Inter,sans-serif'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
          >{open ? '← Collapse' : '→'}</button>

          {/* User info */}
          {open && (
            <div style={{
              padding: '10px 12px', borderRadius: 10,
              background: 'rgba(124,92,252,0.08)',
              border: '1px solid rgba(124,92,252,0.15)',
              marginBottom: 8
            }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#F0F0FF' }}>
                {user?.name?.split(' ')[0]}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(124,92,252,0.8)', fontWeight: 600 }}>
                {user?.role === 'admin' ? '⭐ Admin' : '🎓 Student'}
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={handleLogout} style={{
            width: '100%', padding: '9px', borderRadius: 10, border: 'none',
            background: 'rgba(255,107,107,0.08)',
            color: 'rgba(255,107,107,0.7)',
            cursor: 'pointer', fontSize: 13, fontWeight: 700,
            display: 'flex', alignItems: 'center',
            justifyContent: open ? 'flex-start' : 'center', gap: 8,
            transition: 'all 0.2s', fontFamily: 'Inter,sans-serif'
          }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.18)'; e.currentTarget.style.color = '#FF6B6B'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,107,107,0.08)'; e.currentTarget.style.color = 'rgba(255,107,107,0.7)'; }}
          ><span>🚪</span>{open && 'Sign Out'}</button>
        </div>
      </aside>

      {/* ── Top Header ── */}
      <div style={{
        position: 'fixed', top: 0,
        left: open ? 240 : 72, right: 0, height: 64, zIndex: 99,
        background: 'rgba(10,10,15,0.85)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        display: 'flex', alignItems: 'center',
        padding: '0 32px', justifyContent: 'space-between',
        transition: 'left 0.3s cubic-bezier(0.4,0,0.2,1)'
      }}>
        {/* Left: breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#7C5CFC', boxShadow: '0 0 8px #7C5CFC' }} />
          <span style={{ fontWeight: 600, fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>Smart Career Guidance</span>
        </div>

        {/* Right: user + avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            padding: '6px 14px', borderRadius: 20,
            background: 'rgba(124,92,252,0.1)',
            border: '1px solid rgba(124,92,252,0.2)',
            fontSize: 12, fontWeight: 700, color: '#7C5CFC'
          }}>
            AI Powered 🤖
          </div>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 900, fontSize: 15, color: '#fff',
            boxShadow: '0 0 12px rgba(124,92,252,0.4)'
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'S'}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <main style={{
        marginLeft: open ? 240 : 72,
        flex: 1, padding: '96px 36px 40px',
        minHeight: '100vh',
        transition: 'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
        maxWidth: `calc(100vw - ${open ? 240 : 72}px)`
      }}>
        <Outlet />
      </main>
    </div>
  );
}


// import React, { useState } from 'react';
// import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';

// const NAV = [
//   { to:'/',           icon:'⬡',  label:'Dashboard'  },
//   { to:'/assessment', icon:'◈',  label:'Assessment'  },
//   { to:'/resume',     icon:'◉',  label:'Resume'      },
//   { to:'/career',     icon:'◎',  label:'Career'      },
//   { to:'/roadmap',    icon:'◐',  label:'Roadmap'     },
//   { to:'/placement',  icon:'◑',  label:'Placement'   },
//   { to:'/chatbot',    icon:'◍',  label:'AI Mentor'   },
//   { to:'/progress',   icon:'◈',  label:'Progress'    },
//   { to:'/profile',    icon:'◯',  label:'Profile'     },
// ];

// const EMOJI_NAV = [
//   { to:'/',           emoji:'🏠', label:'Dashboard'  },
//   { to:'/assessment', emoji:'📝', label:'Assessment'  },
//   { to:'/resume',     emoji:'📄', label:'Resume'      },
//   { to:'/career',     emoji:'🎯', label:'Career'      },
//   { to:'/roadmap',    emoji:'🗺️', label:'Roadmap'     },
//   { to:'/placement',  emoji:'💼', label:'Placement'   },
//   { to:'/chatbot',    emoji:'🤖', label:'AI Mentor'   },
//   { to:'/progress',   emoji:'📊', label:'Progress'    },
//   { to:'/profile',    emoji:'👤', label:'Profile'     },
// ];

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate         = useNavigate();
//   const [open, setOpen]  = useState(true);
//   const [dark, setDark]  = useState(true);

//   const handleLogout = () => { logout(); navigate('/login'); };

//   return (
//     <div style={{ display:'flex', minHeight:'100vh', background:'#0A0A0F', fontFamily:'Inter,sans-serif' }}>

//       {/* ── Sidebar ── */}
//       <aside style={{
//         width: open ? 240 : 72,
//         background: 'rgba(255,255,255,0.03)',
//         borderRight: '1px solid rgba(255,255,255,0.06)',
//         backdropFilter: 'blur(20px)',
//         transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1)',
//         display:'flex', flexDirection:'column',
//         position:'fixed', top:0, left:0,
//         height:'100vh', zIndex:100, overflowX:'hidden'
//       }}>

//         {/* Logo */}
//         <div style={{
//           padding: open ? '28px 20px 20px' : '28px 0 20px',
//           display:'flex', alignItems:'center',
//           justifyContent: open ? 'flex-start' : 'center',
//           gap:12, borderBottom:'1px solid rgba(255,255,255,0.06)'
//         }}>
//           <div style={{
//             width:38, height:38, borderRadius:10, flexShrink:0,
//             background:'linear-gradient(135deg,#7C5CFC,#06D6A0)',
//             display:'flex', alignItems:'center', justifyContent:'center',
//             fontSize:18, fontWeight:900, color:'#fff',
//             boxShadow:'0 0 20px rgba(124,92,252,0.4)'
//           }}>S</div>
//           {open && (
//             <div>
//               <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:14, color:'#F0F0FF', lineHeight:1.2 }}>
//                 Smart Career
//               </div>
//               <div style={{ fontSize:11, color:'rgba(124,92,252,0.8)', fontWeight:600 }}>
//                 AI Guidance
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Nav */}
//         <nav style={{ flex:1, padding:'16px 10px', display:'flex', flexDirection:'column', gap:3, overflowY:'auto' }}>
//           {EMOJI_NAV.map(n => (
//             <NavLink key={n.to} to={n.to} end={n.to==='/'} style={({ isActive }) => ({
//               display:'flex', alignItems:'center',
//               gap:12, padding:'11px 12px', borderRadius:12,
//               textDecoration:'none',
//               fontWeight: isActive ? 700 : 500,
//               fontSize:14,
//               color: isActive ? '#fff' : 'rgba(255,255,255,0.5)',
//               background: isActive
//                 ? 'linear-gradient(135deg,rgba(124,92,252,0.25),rgba(6,214,160,0.1))'
//                 : 'transparent',
//               borderLeft: isActive ? '2px solid #7C5CFC' : '2px solid transparent',
//               transition:'all 0.2s',
//               whiteSpace:'nowrap', overflow:'hidden',
//               justifyContent: open ? 'flex-start' : 'center',
//             })}>
//               <span style={{ fontSize:18, flexShrink:0 }}>{n.emoji}</span>
//               {open && <span>{n.label}</span>}
//             </NavLink>
//           ))}

//           {/* Admin */}
//           {user?.role === 'admin' && (
//             <NavLink to="/admin" style={({ isActive }) => ({
//               display:'flex', alignItems:'center',
//               gap:12, padding:'11px 12px', borderRadius:12,
//               textDecoration:'none', fontWeight:700, fontSize:14,
//               color: isActive ? '#FFD93D' : 'rgba(255,217,61,0.5)',
//               background: isActive ? 'rgba(255,217,61,0.1)' : 'transparent',
//               border:'1px solid rgba(255,217,61,0.2)',
//               marginTop:8, transition:'all 0.2s',
//               whiteSpace:'nowrap', overflow:'hidden',
//               justifyContent: open ? 'flex-start' : 'center',
//             })}>
//               <span style={{ fontSize:18 }}>⚙️</span>
//               {open && 'Admin Panel'}
//             </NavLink>
//           )}
//         </nav>

//         {/* Bottom: user + toggle + logout */}
//         <div style={{ padding:'12px 10px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>

//           {/* Collapse toggle */}
//           <button onClick={() => setOpen(!open)} style={{
//             width:'100%', padding:'9px', borderRadius:10, border:'none',
//             background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.4)',
//             cursor:'pointer', fontSize:14, fontWeight:700, marginBottom:8,
//             display:'flex', alignItems:'center',
//             justifyContent: open ? 'flex-end' : 'center', gap:6,
//             transition:'all 0.2s', fontFamily:'Inter,sans-serif'
//           }}
//           onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.08)'}
//           onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
//           >{open ? '← Collapse' : '→'}</button>

//           {/* User info */}
//           {open && (
//             <div style={{
//               padding:'10px 12px', borderRadius:10,
//               background:'rgba(124,92,252,0.08)',
//               border:'1px solid rgba(124,92,252,0.15)',
//               marginBottom:8
//             }}>
//               <div style={{ fontWeight:700, fontSize:13, color:'#F0F0FF' }}>
//                 {user?.name?.split(' ')[0]}
//               </div>
//               <div style={{ fontSize:11, color:'rgba(124,92,252,0.8)', fontWeight:600 }}>
//                 {user?.role === 'admin' ? '⭐ Admin' : '🎓 Student'}
//               </div>
//             </div>
//           )}

//           {/* Logout */}
//           <button onClick={handleLogout} style={{
//             width:'100%', padding:'9px', borderRadius:10, border:'none',
//             background:'rgba(255,107,107,0.08)',
//             color:'rgba(255,107,107,0.7)',
//             cursor:'pointer', fontSize:13, fontWeight:700,
//             display:'flex', alignItems:'center',
//             justifyContent: open ? 'flex-start' : 'center', gap:8,
//             transition:'all 0.2s', fontFamily:'Inter,sans-serif'
//           }}
//           onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,107,107,0.18)'; e.currentTarget.style.color='#FF6B6B'; }}
//           onMouseLeave={e=>{ e.currentTarget.style.background='rgba(255,107,107,0.08)'; e.currentTarget.style.color='rgba(255,107,107,0.7)'; }}
//           ><span>🚪</span>{open && 'Sign Out'}</button>
//         </div>
//       </aside>

//       {/* ── Top Header ── */}
//       <div style={{
//         position:'fixed', top:0,
//         left: open ? 240 : 72, right:0, height:64, zIndex:99,
//         background:'rgba(10,10,15,0.85)',
//         borderBottom:'1px solid rgba(255,255,255,0.06)',
//         backdropFilter:'blur(20px)',
//         display:'flex', alignItems:'center',
//         padding:'0 32px', justifyContent:'space-between',
//         transition:'left 0.3s cubic-bezier(0.4,0,0.2,1)'
//       }}>
//         {/* Left: breadcrumb */}
//         <div style={{ display:'flex', alignItems:'center', gap:8 }}>
//           <div style={{ width:8, height:8, borderRadius:'50%', background:'#7C5CFC', boxShadow:'0 0 8px #7C5CFC' }}/>
//           <span style={{ fontWeight:600, fontSize:14, color:'rgba(255,255,255,0.4)' }}>Smart Career Guidance</span>
//         </div>

//         {/* Right: user + avatar */}
//         <div style={{ display:'flex', alignItems:'center', gap:14 }}>
//           <div style={{
//             padding:'6px 14px', borderRadius:20,
//             background:'rgba(124,92,252,0.1)',
//             border:'1px solid rgba(124,92,252,0.2)',
//             fontSize:12, fontWeight:700, color:'#7C5CFC'
//           }}>
//             AI Powered 🤖
//           </div>
//           <div style={{
//             width:36, height:36, borderRadius:10,
//             background:'linear-gradient(135deg,#7C5CFC,#06D6A0)',
//             display:'flex', alignItems:'center', justifyContent:'center',
//             fontWeight:900, fontSize:15, color:'#fff',
//             boxShadow:'0 0 12px rgba(124,92,252,0.4)'
//           }}>
//             {user?.name?.charAt(0).toUpperCase() || 'S'}
//           </div>
//         </div>
//       </div>

//       {/* ── Main ── */}
//       <main style={{
//         marginLeft: open ? 240 : 72,
//         flex:1, padding:'96px 36px 40px',
//         minHeight:'100vh',
//         transition:'margin-left 0.3s cubic-bezier(0.4,0,0.2,1)',
//         maxWidth: `calc(100vw - ${open?240:72}px)`
//       }}>
//         <Outlet />
//       </main>
//     </div>
//   );
// }

// // import React, { useState } from 'react';
// // import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// // import { useAuth } from '../AuthContext';

// // const NAV = [
// //   { to: '/',           icon: '🏠', label: 'Dashboard' },
// //   { to: '/assessment', icon: '📝', label: 'Assessment' },
// //   { to: '/resume',     icon: '📄', label: 'Resume' },
// //   { to: '/career',     icon: '🎯', label: 'Career' },
// //   { to: '/roadmap',    icon: '🗺️', label: 'Roadmap' },
// //   { to: '/placement',  icon: '💼', label: 'Placement' },
// //   { to: '/chatbot',    icon: '🤖', label: 'AI Mentor' },
// //   { to: '/progress',   icon: '📊', label: 'Progress' },
// //   { to: '/profile',    icon: '👤', label: 'Profile' },
// // ];

// // export default function Layout() {
// //   const { user, logout } = useAuth();
// //   const navigate         = useNavigate();
// //   const [open, setOpen]  = useState(true);

// //   const handleLogout = () => { logout(); navigate('/login'); };

// //   return (
// //     <div style={{ display: 'flex', minHeight: '100vh' }}>
// //       {/* Sidebar */}
// //       <aside style={{
// //         width: open ? 230 : 68,
// //         background: 'linear-gradient(180deg,#6C63FF 0%,#574fd6 100%)',
// //         transition: 'width 0.3s',
// //         display: 'flex', flexDirection: 'column',
// //         padding: '24px 0', position: 'fixed', top: 0, left: 0,
// //         height: '100vh', zIndex: 100, overflowX: 'hidden'
// //       }}>
// //         {/* Logo */}
// //         <div style={{ padding: '0 18px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
// //           <span style={{ fontSize: 28 }}>🚀</span>
// //           {open && <span style={{ color: '#fff', fontWeight: 900, fontSize: 16, lineHeight: 1.2 }}>Smart Career<br/>Guidance</span>}
// //         </div>

// //         {/* Toggle */}
// //         <button onClick={() => setOpen(!open)} style={{
// //           background: 'rgba(255,255,255,0.15)', border: 'none', cursor: 'pointer',
// //           color: '#fff', fontSize: 18, padding: '6px 10px', borderRadius: 8,
// //           margin: '0 12px 16px', alignSelf: open ? 'flex-end' : 'center'
// //         }}>{open ? '◀' : '▶'}</button>

// //         {/* Nav Links */}
// //         <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4, padding: '0 10px' }}>
// //           {NAV.map(n => (
// //             <NavLink key={n.to} to={n.to} end={n.to === '/'} style={({ isActive }) => ({
// //               display: 'flex', alignItems: 'center', gap: 12,
// //               padding: '11px 14px', borderRadius: 12,
// //               textDecoration: 'none', fontWeight: 700, fontSize: 14,
// //               color: isActive ? '#6C63FF' : 'rgba(255,255,255,0.85)',
// //               background: isActive ? '#fff' : 'transparent',
// //               transition: 'all 0.2s',
// //               whiteSpace: 'nowrap', overflow: 'hidden'
// //             })}>
// //               <span style={{ fontSize: 20, flexShrink: 0 }}>{n.icon}</span>
// //               {open && n.label}
// //             </NavLink>
// //           ))}

// //           {/* ── Admin link — only visible if role is admin ── */}
// //           {user?.role === 'admin' && (
// //             <NavLink to="/admin" style={({ isActive }) => ({
// //               display: 'flex', alignItems: 'center', gap: 12,
// //               padding: '11px 14px', borderRadius: 12,
// //               textDecoration: 'none', fontWeight: 700, fontSize: 14,
// //               color: isActive ? '#6C63FF' : 'rgba(255,255,255,0.85)',
// //               background: isActive ? '#fff' : 'rgba(255,255,255,0.15)',
// //               border: '1px solid rgba(255,255,255,0.3)',
// //               transition: 'all 0.2s',
// //               whiteSpace: 'nowrap', overflow: 'hidden',
// //               marginTop: 8
// //             })}>
// //               <span style={{ fontSize: 20, flexShrink: 0 }}>⚙️</span>
// //               {open && 'Admin Panel'}
// //             </NavLink>
// //           )}
// //         </nav>

// //         {/* User + Logout */}
// //         <div style={{ padding: '16px 14px 0', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
// //           {open && (
// //             <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 8 }}>
// //               👋 {user?.name || 'Student'}
// //               {user?.role === 'admin' && (
// //                 <span style={{
// //                   marginLeft: 6, background: '#FFD700', color: '#2D2D2D',
// //                   borderRadius: 6, padding: '1px 6px', fontSize: 11, fontWeight: 900
// //                 }}>ADMIN</span>
// //               )}
// //             </p>
// //           )}
// //           <button onClick={handleLogout} style={{
// //             width: '100%', padding: '10px', borderRadius: 10, border: 'none',
// //             background: 'rgba(255,255,255,0.15)', color: '#fff',
// //             cursor: 'pointer', fontWeight: 700, fontSize: 14,
// //             display: 'flex', alignItems: 'center',
// //             justifyContent: open ? 'flex-start' : 'center', gap: 8
// //           }}>
// //             <span>🚪</span>{open && 'Logout'}
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Main content */}
// //       <main style={{
// //         marginLeft: open ? 230 : 68, flex: 1,
// //         transition: 'margin-left 0.3s',
// //         padding: '32px 36px', minHeight: '100vh'
// //       }}>
// //         <Outlet />
// //       </main>
// //     </div>
// //   );
// // }


// // // import React, { useState, useEffect, createContext, useContext } from 'react';
// // // import { Outlet, NavLink, useNavigate } from 'react-router-dom';
// // // import { useAuth } from '../AuthContext';

// // // // ── Dark Mode Context ─────────────────────────────────────────
// // // export const ThemeContext = createContext();
// // // export const useTheme = () => useContext(ThemeContext);

// // // const NAV = [
// // //   { to: '/',           icon: '🏠', label: 'Dashboard'  },  
// // //   { to: '/assessment', icon: '📝', label: 'Assessment'  },
// // //   { to: '/resume',     icon: '📄', label: 'Resume'      },
// // //   { to: '/career',     icon: '🎯', label: 'Career'      },
// // //   { to: '/roadmap',    icon: '🗺️', label: 'Roadmap'     },
// // //   { to: '/placement',  icon: '💼', label: 'Placement'   },
// // //   { to: '/chatbot',    icon: '🤖', label: 'AI Mentor'   },
// // //   { to: '/progress',   icon: '📊', label: 'Progress'    },
// // //   { to: '/profile',    icon: '👤', label: 'Profile'     },
// // // ];

// // // export default function Layout() {
// // //   const { user, logout }  = useAuth();  
// // //   const navigate          = useNavigate();
// // //   const [open, setOpen]   = useState(true);

// // //   // ── Dark mode — read from localStorage on load ──────────────
// // //   const [dark, setDark] = useState(() => {
// // //     return localStorage.getItem('scg_theme') === 'dark';  
// // //   });

// // //   // Save to localStorage and toggle dark-mode class on body
// // //   useEffect(() => {
// // //     localStorage.setItem('scg_theme', dark ? 'dark' : 'light');  
// // //     document.body.style.background = dark ? '#0F0F1A' : '#F5F5FF';
// // //     document.body.style.color      = dark ? '#E8E8FF' : '#2D2D2D';
// // //     if (dark) { document.body.classList.add('dark-mode'); }
// // //     else       { document.body.classList.remove('dark-mode'); }
// // //   }, [dark]);

// // //   const toggleDark = () => setDark(d => !d);
// // //   const handleLogout = () => { logout(); navigate('/login'); };

// // //   // ── Theme colors ────────────────────────────────────────────
// // //   const T = {
// // //     sidebar:    dark ? 'linear-gradient(180deg,#1A1A2E 0%,#16213E 100%)'  
// // //                      : 'linear-gradient(180deg,#6C63FF 0%,#574fd6 100%)',
// // //     sidebarBorder: dark ? '1px solid rgba(255,255,255,0.08)' : 'none',
// // //     mainBg:     dark ? '#0F0F1A' : '#F5F5FF',
// // //     cardBg:     dark ? '#1A1A2E' : '#FFFFFF',
// // //     text:       dark ? '#E8E8FF' : '#2D2D2D',
// // //     subtext:    dark ? '#8888BB' : '#7A7A9D',
// // //     navActive:  dark ? '#6C63FF' : '#fff',
// // //     navActiveTxt: dark ? '#fff'  : '#6C63FF',
// // //     toggleBg:   dark ? 'rgba(108,99,255,0.3)' : 'rgba(255,255,255,0.15)',
// // //     headerBg:   dark ? '#13131F' : '#fff',
// // //     headerBorder: dark ? '1px solid #2A2A45' : '1px solid #EEE',
// // //   };

// // //   return (
// // //     <ThemeContext.Provider value={{ dark, toggleDark, T }}>  
// // //       <div style={{ display: 'flex', minHeight: '100vh', background: T.mainBg, transition: 'all 0.3s' }}>

// // //         {/* ── Sidebar ─────────────────────────────────────── */}
// // //         <aside style={{
// // //           width: open ? 230 : 68,  
// // //           background: T.sidebar,
// // //           boxShadow: dark ? '4px 0 20px rgba(0,0,0,0.5)' : '4px 0 20px rgba(108,99,255,0.15)',
// // //           transition: 'width 0.3s',
// // //           display: 'flex', flexDirection: 'column',
// // //           padding: '24px 0', position: 'fixed', top: 0, left: 0,
// // //           height: '100vh', zIndex: 100, overflowX: 'hidden',
// // //           border: T.sidebarBorder
// // //         }}>

// // //           {/* Logo */}
// // //           <div style={{ padding: '0 18px 28px', display: 'flex', alignItems: 'center', gap: 10 }}>
// // //             <span style={{ fontSize: 28, flexShrink: 0 }}>🚀</span>
// // //             {open && (
// // //               <span style={{ color: '#fff', fontWeight: 900, fontSize: 15, lineHeight: 1.3 }}>  
// // //                 Smart Career<br/>
// // //                 <span style={{ opacity: 0.75, fontSize: 12, fontWeight: 600 }}>Guidance</span>
// // //               </span>
// // //             )}
// // //           </div>

// // //           {/* Collapse toggle */}
// // //           <button onClick={() => setOpen(!open)} style={{
// // //             background: 'rgba(255,255,255,0.12)', border: 'none', cursor: 'pointer',  
// // //             color: '#fff', fontSize: 16, padding: '6px 10px', borderRadius: 8,
// // //             margin: '0 12px 16px', alignSelf: open ? 'flex-end' : 'center',
// // //             transition: 'background 0.2s'
// // //           }}
// // //           onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.22)'}
// // //           onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
// // //           >{open ? '◀' : '▶'}</button>

// // //           {/* Nav Links */}
// // //           <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3, padding: '0 10px' }}>
// // //             {NAV.map(n => (
// // //               <NavLink key={n.to} to={n.to} end={n.to === '/'} style={({ isActive }) => ({
// // //                 display: 'flex', alignItems: 'center', gap: 12,  
// // //                 padding: '11px 14px', borderRadius: 12,
// // //                 textDecoration: 'none', fontWeight: 700, fontSize: 14,
// // //                 color: isActive ? T.navActiveTxt : 'rgba(255,255,255,0.8)',
// // //                 background: isActive ? T.navActive : 'transparent',
// // //                 boxShadow: isActive ? (dark ? '0 2px 12px rgba(108,99,255,0.4)' : 'none') : 'none',
// // //                 transition: 'all 0.2s',
// // //                 whiteSpace: 'nowrap', overflow: 'hidden'
// // //               })}>
// // //                 <span style={{ fontSize: 19, flexShrink: 0 }}>{n.icon}</span>
// // //                 {open && n.label}
// // //               </NavLink>
// // //             ))}

// // //             {/* Admin link — only if admin role */}
// // //             {user?.role === 'admin' && (
// // //               <NavLink to="/admin" style={({ isActive }) => ({
// // //                 display: 'flex', alignItems: 'center', gap: 12,  
// // //                 padding: '11px 14px', borderRadius: 12,
// // //                 textDecoration: 'none', fontWeight: 700, fontSize: 14,
// // //                 color: isActive ? T.navActiveTxt : 'rgba(255,255,255,0.8)',
// // //                 background: isActive ? T.navActive : 'rgba(255,255,255,0.08)',
// // //                 border: '1px solid rgba(255,255,255,0.2)',
// // //                 transition: 'all 0.2s', marginTop: 8,
// // //                 whiteSpace: 'nowrap', overflow: 'hidden'
// // //               })}>
// // //                 <span style={{ fontSize: 19, flexShrink: 0 }}>⚙️</span>
// // //                 {open && 'Admin Panel'}
// // //               </NavLink>
// // //             )}
// // //           </nav>

// // //           {/* User info + Dark toggle + Logout */}
// // //           <div style={{ padding: '16px 12px 0', borderTop: '1px solid rgba(255,255,255,0.15)' }}>

// // //             {/* Dark mode toggle */}
// // //             <button onClick={toggleDark} style={{
// // //               width: '100%', padding: '9px 14px', borderRadius: 10,  
// // //               border: 'none', marginBottom: 8,
// // //               background: T.toggleBg,
// // //               color: '#fff', cursor: 'pointer',
// // //               fontWeight: 700, fontSize: 13,
// // //               display: 'flex', alignItems: 'center',
// // //               justifyContent: open ? 'flex-start' : 'center', gap: 8,
// // //               transition: 'all 0.2s'
// // //             }}
// // //             onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.22)'}
// // //             onMouseLeave={e => e.currentTarget.style.background=T.toggleBg}
// // //             >
// // //               <span style={{ fontSize: 18 }}>{dark ? '☀️' : '🌙'}</span>
// // //               {open && (dark ? 'Light Mode' : 'Dark Mode')}
// // //             </button>

// // //             {/* User name */}
// // //             {open && (
// // //               <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>  
// // //                 👋 {user?.name || 'Student'}
// // //                 {user?.role === 'admin' && (
// // //                   <span style={{
// // //                     marginLeft: 6, background: '#FFD700', color: '#2D2D2D',  
// // //                     borderRadius: 5, padding: '1px 6px', fontSize: 10, fontWeight: 900
// // //                   }}>ADMIN</span>
// // //                 )}
// // //               </p>
// // //             )}

// // //             {/* Logout */}
// // //             <button onClick={handleLogout} style={{
// // //               width: '100%', padding: '9px 14px', borderRadius: 10, border: 'none',  
// // //               background: 'rgba(255,255,255,0.12)', color: '#fff',
// // //               cursor: 'pointer', fontWeight: 700, fontSize: 13,
// // //               display: 'flex', alignItems: 'center',
// // //               justifyContent: open ? 'flex-start' : 'center', gap: 8,
// // //               transition: 'all 0.2s'
// // //             }}
// // //             onMouseEnter={e => e.currentTarget.style.background='rgba(255,100,100,0.3)'}
// // //             onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.12)'}
// // //             >
// // //               <span>🚪</span>{open && 'Logout'}
// // //             </button>
// // //           </div>
// // //         </aside>

// // //         {/* ── Top Header Bar ───────────────────────────────── */}
// // //         <div style={{
// // //           position: 'fixed', top: 0,  
// // //           left: open ? 230 : 68, right: 0,
// // //           height: 60, zIndex: 99,
// // //           background: T.headerBg,
// // //           borderBottom: T.headerBorder,
// // //           display: 'flex', alignItems: 'center',
// // //           padding: '0 32px',
// // //           justifyContent: 'space-between',
// // //           transition: 'left 0.3s, background 0.3s',
// // //           boxShadow: dark ? '0 2px 20px rgba(0,0,0,0.4)' : '0 2px 12px rgba(0,0,0,0.06)'
// // //         }}>
// // //           {/* Page greeting */}
// // //           <div style={{ fontWeight: 800, fontSize: 15, color: T.text }}>
// // //             Smart Career Guidance
// // //             <span style={{ marginLeft: 10, fontSize: 12, color: T.subtext, fontWeight: 600 }}>
// // //               {dark ? '🌙 Dark Mode' : '☀️ Light Mode'}
// // //             </span>
// // //           </div>

// // //           {/* Right side — toggle + user */}
// // //           <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
// // //             {/* Toggle pill */}
// // //             <div onClick={toggleDark} style={{
// // //               width: 52, height: 28, borderRadius: 20, cursor: 'pointer',  
// // //               background: dark ? '#6C63FF' : '#E0E0F0',
// // //               position: 'relative', transition: 'background 0.3s',
// // //               boxShadow: dark ? '0 0 12px rgba(108,99,255,0.5)' : 'none'
// // //             }}>
// // //               <div style={{
// // //                 position: 'absolute', top: 4,  
// // //                 left: dark ? 28 : 4,
// // //                 width: 20, height: 20, borderRadius: '50%',
// // //                 background: '#fff',
// // //                 transition: 'left 0.3s',
// // //                 display: 'flex', alignItems: 'center', justifyContent: 'center',
// // //                 fontSize: 11
// // //               }}>{dark ? '🌙' : '☀️'}</div>
// // //             </div>

// // //             <div style={{
// // //               width: 36, height: 36, borderRadius: '50%',  
// // //               background: dark ? '#6C63FF33' : '#F0EEFF',
// // //               display: 'flex', alignItems: 'center', justifyContent: 'center',
// // //               fontWeight: 900, fontSize: 14, color: '#6C63FF'
// // //             }}>
// // //               {user?.name?.charAt(0).toUpperCase() || 'S'}
// // //             </div>
// // //             <span style={{ fontWeight: 700, fontSize: 14, color: T.text }}>
// // //               {user?.name?.split(' ')[0]}
// // //             </span>
// // //           </div>
// // //         </div>

// // //         {/* ── Main Content ─────────────────────────────────── */}
// // //         <main style={{
// // //           marginLeft: open ? 230 : 68,  
// // //           flex: 1,
// // //           transition: 'margin-left 0.3s, background 0.3s',
// // //           padding: '92px 36px 36px',
// // //           minHeight: '100vh',
// // //           background: T.mainBg,
// // //           color: T.text
// // //         }}>
// // //           <Outlet />
// // //         </main>

// // //       </div>
// // //     </ThemeContext.Provider>
// // //   );
// // // }

