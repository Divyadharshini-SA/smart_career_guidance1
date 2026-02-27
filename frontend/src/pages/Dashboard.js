import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import API from '../api';

const ACTIONS = [
  { to:'/assessment', icon:'📝', label:'Assessment',    sub:'Take topic tests',      grad:'linear-gradient(135deg,#7C5CFC,#5A3FE0)' },
  { to:'/resume',     icon:'📄', label:'Resume',        sub:'AI analysis',           grad:'linear-gradient(135deg,#FF6B6B,#EE0979)' },
  { to:'/career',     icon:'🎯', label:'Career AI',     sub:'Get predictions',       grad:'linear-gradient(135deg,#06D6A0,#0ABDE3)' },
  { to:'/roadmap',    icon:'🗺️', label:'Roadmap',       sub:'Step-by-step plan',    grad:'linear-gradient(135deg,#FFD93D,#F9A825)' },
  { to:'/placement',  icon:'💼', label:'Placement',     sub:'Prep resources',        grad:'linear-gradient(135deg,#4ECDC4,#1A9EAE)' },
  { to:'/chatbot',    icon:'🤖', label:'AI Mentor',     sub:'Career guidance',       grad:'linear-gradient(135deg,#A29BFE,#6C5CE7)' },
];

const TIPS = [
  '💡 Practice 5 aptitude questions daily to build speed',
  '🎯 Focus on your weakest topic first for faster improvement',
  '📄 Update your resume after every new project or skill',
  '🗺️ Complete at least 2 roadmap steps every week',
  '💼 Study one company profile from Placement hub daily',
];

function GlowCard({ children, style, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:'rgba(255,255,255,0.03)',
      border:'1px solid rgba(255,255,255,0.07)',
      borderRadius:20, padding:22,
      transition:'all 0.25s',
      cursor: onClick ? 'pointer' : 'default',
      ...style
    }}
    onMouseEnter={e => {
      e.currentTarget.style.borderColor = 'rgba(124,92,252,0.35)';
      e.currentTarget.style.boxShadow   = '0 0 24px rgba(124,92,252,0.12)';
      if(onClick) e.currentTarget.style.transform = 'translateY(-4px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
      e.currentTarget.style.boxShadow   = 'none';
      if(onClick) e.currentTarget.style.transform = 'none';
    }}>
      {children}
    </div>
  );
}

export default function Dashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [prog, setProg]       = useState(null);
  const [history, setHistory] = useState([]);
  const [resume, setResume]   = useState(null);
  const [tip, setTip]         = useState(0);

  useEffect(() => {
    Promise.allSettled([
      API.get('/progress/'),
      API.get('/assessment/history'),
      API.get('/resume/latest'),
    ]).then(([p,h,r]) => {
      if(p.status==='fulfilled') setProg(p.value.data);
      if(h.status==='fulfilled') setHistory(h.value.data);
      if(r.status==='fulfilled') setResume(r.value.data);
    });
    const t = setInterval(() => setTip(x => (x+1)%TIPS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const readiness = prog?.placement_readiness || 0;
  const totalTests = history.length;
  const avgScore   = totalTests ? (history.reduce((s,h)=>s+(h.percentage||0),0)/totalTests).toFixed(1) : 0;
  const bestScore  = totalTests ? Math.max(...history.map(h=>h.percentage||0)).toFixed(1) : 0;

  const levelColor = readiness>=70 ? '#06D6A0' : readiness>=50 ? '#FFD93D' : '#FF6B6B';
  const levelLabel = readiness>=70 ? 'Placement Ready 🎉' : readiness>=50 ? 'Getting There 💪' : 'Keep Going 📚';

  const SCORES = [
    { label:'Technical',  val:prog?.skill_score,         color:'#7C5CFC' },
    { label:'Aptitude',   val:prog?.aptitude_score,      color:'#FF6B6B' },
    { label:'Resume',     val:prog?.resume_score,        color:'#06D6A0' },
    { label:'Roadmap',    val:prog?.roadmap_completion,  color:'#FFD93D' },
  ];

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>

      {/* ── Hero ── */}
      <div style={{
        position:'relative', borderRadius:24, padding:'32px 36px',
        marginBottom:28, overflow:'hidden',
        background:'linear-gradient(135deg,rgba(124,92,252,0.2),rgba(6,214,160,0.1))',
        border:'1px solid rgba(124,92,252,0.2)'
      }}>
        {/* Background glow */}
        <div style={{ position:'absolute', top:-60, right:-60, width:300, height:300, borderRadius:'50%', background:'radial-gradient(circle,rgba(124,92,252,0.15) 0%,transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:20 }}>
          <div>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:14, fontWeight:600, marginBottom:6 }}>
              {new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
            </p>
            <h1 style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:32, fontWeight:800, color:'#F0F0FF', marginBottom:8, lineHeight:1.2 }}>
              Hey, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color:'rgba(255,255,255,0.5)', fontSize:15, marginBottom:20 }}>
              Track your placement readiness and grow daily
            </p>
            <div style={{
              display:'inline-flex', alignItems:'center', gap:8,
              padding:'8px 16px', borderRadius:20,
              background: `${levelColor}18`,
              border:`1px solid ${levelColor}44`,
              color:levelColor, fontWeight:700, fontSize:14
            }}>
              <div style={{ width:8, height:8, borderRadius:'50%', background:levelColor, boxShadow:`0 0 8px ${levelColor}` }}/>
              {levelLabel}
            </div>
          </div>

          {/* Big readiness circle */}
          <div style={{ position:'relative', width:110, height:110, flexShrink:0 }}>
            <svg width="110" height="110" style={{ transform:'rotate(-90deg)' }}>
              <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8"/>
              <circle cx="55" cy="55" r="46" fill="none"
                stroke="url(#prog)" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2*Math.PI*46}`}
                strokeDashoffset={`${2*Math.PI*46*(1-readiness/100)}`}
                style={{ transition:'stroke-dashoffset 1s' }}/>
              <defs>
                <linearGradient id="prog" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#7C5CFC"/>
                  <stop offset="100%" stopColor="#06D6A0"/>
                </linearGradient>
              </defs>
            </svg>
            <div style={{
              position:'absolute', top:'50%', left:'50%',
              transform:'translate(-50%,-50%)', textAlign:'center'
            }}>
              <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:22, fontWeight:900, color:'#F0F0FF', lineHeight:1 }}>
                {Math.round(readiness)}%
              </div>
              <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Ready</div>
            </div>
          </div>
        </div>

        {/* Daily tip ticker */}
        <div style={{
          marginTop:20, padding:'10px 16px', borderRadius:12,
          background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)',
          fontSize:13, color:'rgba(255,255,255,0.6)', fontWeight:500,
          transition:'opacity 0.3s'
        }}>
          {TIPS[tip]}
        </div>
      </div>

      {/* ── Stats row ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14, marginBottom:28 }}>
        {[
          { label:'Tests Taken',   value:totalTests,       icon:'📝', color:'#7C5CFC' },
          { label:'Avg Score',     value:`${avgScore}%`,   icon:'📊', color:'#06D6A0' },
          { label:'Best Score',    value:`${bestScore}%`,  icon:'🏆', color:'#FFD93D' },
          { label:'Resume Score',  value:`${(prog?.resume_score||0).toFixed(0)}%`, icon:'📄', color:'#FF6B6B' },
        ].map(s => (
          <GlowCard key={s.label}>
            <div style={{ display:'flex', alignItems:'center', gap:12 }}>
              <div style={{ width:42, height:42, borderRadius:12, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize:22, fontWeight:900, color:s.color, lineHeight:1 }}>{s.value}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600, marginTop:2 }}>{s.label}</div>
              </div>
            </div>
          </GlowCard>
        ))}
      </div>

      {/* ── Progress bars + Quick Actions ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:28, alignItems:'start' }}>

        {/* Progress bars */}
        <GlowCard>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
            Score Overview
          </div>
          {SCORES.map(s => (
            <div key={s.label} style={{ marginBottom:16 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>{s.label}</span>
                <span style={{ fontSize:13, fontWeight:800, color:s.color }}>{(s.val||0).toFixed(0)}%</span>
              </div>
              <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:6 }}>
                <div style={{ height:'100%', borderRadius:6, background:s.color, width:`${s.val||0}%`, boxShadow:`0 0 8px ${s.color}66`, transition:'width 1s' }}/>
              </div>
            </div>
          ))}
          {!prog && (
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13, textAlign:'center', padding:'20px 0' }}>
              Take a test to see your scores
            </p>
          )}
        </GlowCard>

        {/* Recent tests */}
        <GlowCard>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
            Recent Tests
          </div>
          {history.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:32, marginBottom:10 }}>📝</div>
              <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>No tests taken yet</p>
              <button className="btn btn-secondary" onClick={() => navigate('/assessment')} style={{ marginTop:14, fontSize:13 }}>
                Start Testing →
              </button>
            </div>
          ) : history.slice(0,4).map((h,i) => {
            const p = h.percentage||0;
            const c = p>=85?'#06D6A0':p>=70?'#7C5CFC':p>=50?'#FFD93D':'#FF6B6B';
            return (
              <div key={h.id} style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding:'10px 12px', borderRadius:10, marginBottom:8,
                background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.05)'
              }}>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.8)', textTransform:'capitalize' }}>{h.type} Test</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:2 }}>{new Date(h.taken_at).toLocaleDateString('en-IN',{day:'numeric',month:'short'})}</div>
                </div>
                <div style={{ fontWeight:900, fontSize:16, color:c }}>{p.toFixed(0)}%</div>
              </div>
            );
          })}
        </GlowCard>
      </div>

      {/* ── Quick Actions ── */}
      <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
        Quick Actions
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:14 }}>
        {ACTIONS.map(a => (
          <div key={a.to} onClick={() => navigate(a.to)} style={{
            borderRadius:18, padding:'22px 18px', cursor:'pointer',
            background:a.grad, position:'relative', overflow:'hidden',
            transition:'all 0.25s'
          }}
          onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-5px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(0,0,0,0.3)'; }}
          onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}
          >
            <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.1)' }}/>
            <div style={{ fontSize:30, marginBottom:10 }}>{a.icon}</div>
            <div style={{ fontWeight:800, fontSize:15, color:'#fff', marginBottom:4 }}>{a.label}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,0.65)', fontWeight:500 }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


// // UPGRADED DASHBOARD - Smart Career Guidance
// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../AuthContext';
// import API from '../api';

// const CARDS = [
//   { to:'/assessment', icon:'📝', label:'Take Assessment',  color:'#6C63FF', bg:'#F0EEFF' },
//   { to:'/resume',     icon:'📄', label:'Upload Resume',    color:'#FF6584', bg:'#FFF0F3' },
//   { to:'/career',     icon:'🎯', label:'Career Predict',   color:'#43E97B', bg:'#EFFFEF' },
//   { to:'/roadmap',    icon:'🗺️', label:'My Roadmap',       color:'#F9A825', bg:'#FFFBEA' },
//   { to:'/placement',  icon:'💼', label:'Placement Prep',   color:'#29B6F6', bg:'#EAF8FF' },
//   { to:'/chatbot',    icon:'🤖', label:'AI Mentor',        color:'#AB47BC', bg:'#F9EEFF' },
// ];

// export default function Dashboard() {
//   const { user }     = useAuth();
//   const navigate     = useNavigate();
//   const [prog, setProg] = useState(null);

//   useEffect(() => {
//     API.get('/progress/').then(r => setProg(r.data)).catch(() => {});
//   }, []);

//   const readiness = prog?.placement_readiness || 0;
//   const level = readiness >= 70 ? '🟢 Placement Ready' : readiness >= 50 ? '🟡 Intermediate' : '🔴 Beginner';

//   return (
//     <div>
//       {/* Header */}
//       <div style={{
//         background: 'linear-gradient(135deg,#6C63FF,#FF6584)',
//         borderRadius: 20, padding: '32px 36px', color: '#fff', marginBottom: 32,
//         display: 'flex', justifyContent: 'space-between', alignItems: 'center'
//       }}>
//         <div>
//           <h1 style={{ fontSize: 30, fontWeight: 900 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
//           <p style={{ opacity: 0.85, marginTop: 6, fontSize: 16 }}>Track your career readiness and grow every day!</p>
//           <span style={{
//             display:'inline-block', marginTop:12, background:'rgba(255,255,255,0.2)',
//             borderRadius:20, padding:'6px 16px', fontSize:14, fontWeight:700
//           }}>{level}</span>
//         </div>
//         <div style={{ fontSize: 80 }}>🚀</div>
//       </div>

//       {/* Progress Overview */}
//       {prog && (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:32 }}>
//           {[
//             { label:'Skill Score',       val:prog.skill_score,         color:'#6C63FF' },
//             { label:'Aptitude Score',    val:prog.aptitude_score,      color:'#FF6584' },
//             { label:'Resume Score',      val:prog.resume_score,        color:'#43E97B' },
//             { label:'Roadmap Done',      val:prog.roadmap_completion,  color:'#F9A825' },
//             { label:'Placement Ready',   val:prog.placement_readiness, color:'#29B6F6' },
//           ].map(p => (
//             <div key={p.label} className="card" style={{ textAlign:'center', padding:20 }}>
//               <div style={{ fontSize:28, fontWeight:900, color:p.color }}>{p.val?.toFixed(0) || 0}%</div>
//               <div style={{ fontSize:13, color:'#7A7A9D', marginTop:4, fontWeight:600 }}>{p.label}</div>
//               <div className="progress-bar-wrap" style={{ marginTop:10 }}>
//                 <div className="progress-bar-fill" style={{ width:`${p.val || 0}%`, background:p.color }} />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Quick Action Cards */}
//       <h2 style={{ fontWeight:900, fontSize:20, marginBottom:16 }}>Quick Actions</h2>
//       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
//         {CARDS.map(c => (
//           <div key={c.to} onClick={() => navigate(c.to)} className="card" style={{
//             cursor:'pointer', textAlign:'center', padding:28,
//             background:c.bg, border:`2px solid ${c.color}22`,
//             transition:'all 0.2s'
//           }}
//           onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
//           onMouseLeave={e => e.currentTarget.style.transform='none'}
//           >
//             <div style={{ fontSize:36, marginBottom:12 }}>{c.icon}</div>
//             <div style={{ fontWeight:800, fontSize:15, color:c.color }}>{c.label}</div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }


// // import React, { useEffect, useState } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../AuthContext';
// // import API from '../api';

// // const CARDS = [
// //   { to:'/assessment', icon:'📝', label:'Take Assessment',  color:'#6C63FF', bg:'#F0EEFF' },
// //   { to:'/resume',     icon:'📄', label:'Upload Resume',    color:'#FF6584', bg:'#FFF0F3' },
// //   { to:'/career',     icon:'🎯', label:'Career Predict',   color:'#43E97B', bg:'#EFFFEF' },
// //   { to:'/roadmap',    icon:'🗺️', label:'My Roadmap',       color:'#F9A825', bg:'#FFFBEA' },
// //   { to:'/placement',  icon:'💼', label:'Placement Prep',   color:'#29B6F6', bg:'#EAF8FF' },
// //   { to:'/chatbot',    icon:'🤖', label:'AI Mentor',        color:'#AB47BC', bg:'#F9EEFF' },
// // ];

// // export default function Dashboard() {
// //   const { user }     = useAuth();
// //   const navigate     = useNavigate();
// //   const [prog, setProg] = useState(null);

// //   useEffect(() => {
// //     API.get('/progress/').then(r => setProg(r.data)).catch(() => {});
// //   }, []);

// //   const readiness = prog?.placement_readiness || 0;
// //   const level = readiness >= 70 ? '🟢 Placement Ready' : readiness >= 50 ? '🟡 Intermediate' : '🔴 Beginner';

// //   return (
// //     <div>
// //       {/* Header */}
// //       <div style={{
// //         background: 'linear-gradient(135deg,#6C63FF,#FF6584)',
// //         borderRadius: 20, padding: '32px 36px', color: '#fff', marginBottom: 32,
// //         display: 'flex', justifyContent: 'space-between', alignItems: 'center'
// //       }}>
// //         <div>
// //           <h1 style={{ fontSize: 30, fontWeight: 900 }}>Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
// //           <p style={{ opacity: 0.85, marginTop: 6, fontSize: 16 }}>Track your career readiness and grow every day!</p>
// //           <span style={{
// //             display:'inline-block', marginTop:12, background:'rgba(255,255,255,0.2)',
// //             borderRadius:20, padding:'6px 16px', fontSize:14, fontWeight:700
// //           }}>{level}</span>
// //         </div>
// //         <div style={{ fontSize: 80 }}>🚀</div>
// //       </div>

// //       {/* Progress Overview */}
// //       {prog && (
// //         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:16, marginBottom:32 }}>
// //           {[
// //             { label:'Skill Score',       val:prog.skill_score,         color:'#6C63FF' },
// //             { label:'Aptitude Score',    val:prog.aptitude_score,      color:'#FF6584' },
// //             { label:'Resume Score',      val:prog.resume_score,        color:'#43E97B' },
// //             { label:'Roadmap Done',      val:prog.roadmap_completion,  color:'#F9A825' },
// //             { label:'Placement Ready',   val:prog.placement_readiness, color:'#29B6F6' },
// //           ].map(p => (
// //             <div key={p.label} className="card" style={{ textAlign:'center', padding:20 }}>
// //               <div style={{ fontSize:28, fontWeight:900, color:p.color }}>{p.val?.toFixed(0) || 0}%</div>
// //               <div style={{ fontSize:13, color:'#7A7A9D', marginTop:4, fontWeight:600 }}>{p.label}</div>
// //               <div className="progress-bar-wrap" style={{ marginTop:10 }}>
// //                 <div className="progress-bar-fill" style={{ width:`${p.val || 0}%`, background:p.color }} />
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {/* Quick Action Cards */}
// //       <h2 style={{ fontWeight:900, fontSize:20, marginBottom:16 }}>Quick Actions</h2>
// //       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:16 }}>
// //         {CARDS.map(c => (
// //           <div key={c.to} onClick={() => navigate(c.to)} className="card" style={{
// //             cursor:'pointer', textAlign:'center', padding:28,
// //             background:c.bg, border:`2px solid ${c.color}22`,
// //             transition:'all 0.2s'
// //           }}
// //           onMouseEnter={e => e.currentTarget.style.transform='translateY(-4px)'}
// //           onMouseLeave={e => e.currentTarget.style.transform='none'}
// //           >
// //             <div style={{ fontSize:36, marginBottom:12 }}>{c.icon}</div>
// //             <div style={{ fontWeight:800, fontSize:15, color:c.color }}>{c.label}</div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }
