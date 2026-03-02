import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const INTERESTS_LIST = [
  'coding', 'data science', 'web development', 'machine learning', 'cybersecurity',
  'cloud computing', 'mobile development', 'devops', 'ui/ux design', 'embedded systems',
  'blockchain', 'game development', 'product management', 'data engineering', 'research',
];

// Big Five questions from the IEEE paper survey (Fig. 9)
const BIG_FIVE_QUESTIONS = [
  { key: 'openness', label: 'Openness', emoji: '🌟', q: 'How open are you to new experiences and creative ideas?', low: 'Prefer routine', high: 'Very curious' },
  { key: 'conscientiousness', label: 'Conscientiousness', emoji: '📋', q: 'How organized and dependable are you with your work?', low: 'Flexible/Casual', high: 'Very organized' },
  { key: 'extraversion', label: 'Extraversion', emoji: '🤝', q: 'Are you a social butterfly? Do you enjoy working with people?', low: 'Prefer solo work', high: 'Very social' },
  { key: 'agreeableness', label: 'Agreeableness', emoji: '💚', q: 'How agreeable and cooperative are you in team settings?', low: 'Direct/Competitive', high: 'Very cooperative' },
  { key: 'neuroticism', label: 'Emotional Stability', emoji: '🧘', q: 'How often do you experience negative emotions or stress?', low: 'Very calm', high: 'Often stressed' },
];

export default function Profile() {
  const [profile, setProfile] = useState({ interests: [], skills: {}, career_goal: '' });
  const [bigFive, setBigFive] = useState({ openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 });
  const [skillInput, setSkillInput] = useState({ name: '', level: 5 });
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'personality'

  useEffect(() => {
    API.get('/profile/').then(r => {
      setProfile({
        interests: r.data.interests || [],
        skills: r.data.skills || {},
        career_goal: r.data.career_goal || '',
      });
      setBigFive({
        openness: r.data.personality_openness || 0,
        conscientiousness: r.data.personality_conscientiousness || 0,
        extraversion: r.data.personality_extraversion || 0,
        agreeableness: r.data.personality_agreeableness || 0,
        neuroticism: r.data.personality_neuroticism || 0,
      });
    }).catch(() => { });
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      await API.put('/profile/', {
        interests: profile.interests,
        skills: profile.skills,
        career_goal: profile.career_goal,
        personality_openness: bigFive.openness,
        personality_conscientiousness: bigFive.conscientiousness,
        personality_extraversion: bigFive.extraversion,
        personality_agreeableness: bigFive.agreeableness,
        personality_neuroticism: bigFive.neuroticism,
      });
      toast.success('Profile saved! ✅');
    } catch { toast.error('Save failed'); }
    finally { setLoading(false); }
  };

  const toggleInterest = i => {
    setProfile(p => ({
      ...p,
      interests: p.interests.includes(i) ? p.interests.filter(x => x !== i) : [...p.interests, i]
    }));
  };

  const addSkill = () => {
    if (!skillInput.name.trim()) return;
    setProfile(p => ({ ...p, skills: { ...p.skills, [skillInput.name.toLowerCase().trim()]: skillInput.level } }));
    setSkillInput({ name: '', level: 5 });
  };

  const removeSkill = name => {
    setProfile(p => { const s = { ...p.skills }; delete s[name]; return { ...p, skills: s }; });
  };

  const bigFiveComplete = Object.values(bigFive).every(v => v > 0);

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', maxWidth: 800 }}>
      <h1 className="page-title">My Profile</h1>
      <p className="page-sub">Complete your profile to get accurate career predictions</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
        {[['profile', '👤 Skills & Interests'], ['personality', '🧠 Personality (IEEE)']].map(([tab, label]) => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '10px 20px', borderRadius: 12, border: '1px solid',
            borderColor: activeTab === tab ? '#7C5CFC' : 'rgba(255,255,255,0.1)',
            background: activeTab === tab ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)',
            color: activeTab === tab ? '#A29BFE' : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
          }}>
            {label}
            {tab === 'personality' && !bigFiveComplete && (
              <span style={{ marginLeft: 6, fontSize: 10, background: '#FF6B6B', color: '#fff', padding: '2px 6px', borderRadius: 8 }}>NEW</span>
            )}
          </button>
        ))}
      </div>

      {/* ── Profile Tab ── */}
      {activeTab === 'profile' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Career Goal */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F0F0FF', marginBottom: 14 }}>🎯 Career Goal</h3>
            <input
              value={profile.career_goal}
              onChange={e => setProfile(p => ({ ...p, career_goal: e.target.value }))}
              placeholder="e.g. Become a Data Scientist at a product company"
              style={{ width: '100%', borderRadius: 12 }}
            />
          </div>

          {/* Interests */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F0F0FF', marginBottom: 14 }}>
              ❤️ Interests <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>({profile.interests.length} selected)</span>
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {INTERESTS_LIST.map(i => {
                const active = profile.interests.includes(i);
                return (
                  <button key={i} onClick={() => toggleInterest(i)} style={{
                    padding: '7px 14px', borderRadius: 20, border: '1px solid',
                    borderColor: active ? '#7C5CFC' : 'rgba(255,255,255,0.1)',
                    background: active ? 'rgba(124,92,252,0.25)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#A29BFE' : 'rgba(255,255,255,0.5)',
                    fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                  }}>
                    {active ? '✓ ' : ''}{i}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Skills */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: '#F0F0FF', marginBottom: 14 }}>
              💡 Skills & Proficiency <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>({Object.keys(profile.skills).length} added)</span>
            </h3>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <input
                value={skillInput.name}
                onChange={e => setSkillInput(s => ({ ...s, name: e.target.value }))}
                onKeyDown={e => e.key === 'Enter' && addSkill()}
                placeholder="e.g. python, react, machine learning"
                style={{ flex: 1, borderRadius: 10 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>Level {skillInput.level}</span>
                <input type="range" min={1} max={10} value={skillInput.level}
                  onChange={e => setSkillInput(s => ({ ...s, level: +e.target.value }))}
                  style={{ width: 80 }} />
              </div>
              <button className="btn btn-primary" onClick={addSkill} style={{ padding: '10px 18px', flexShrink: 0 }}>Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {Object.entries(profile.skills).map(([name, lvl]) => (
                <div key={name} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
                  borderRadius: 20, background: 'rgba(124,92,252,0.12)',
                  border: '1px solid rgba(124,92,252,0.25)',
                }}>
                  <span style={{ color: '#A29BFE', fontWeight: 700, fontSize: 13 }}>{name}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', background: 'rgba(124,92,252,0.2)', padding: '1px 6px', borderRadius: 8 }}>{lvl}/10</span>
                  <button onClick={() => removeSkill(name)} style={{ background: 'none', border: 'none', color: 'rgba(255,107,107,0.6)', cursor: 'pointer', fontSize: 14, padding: 0 }}>×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Personality Tab (Big Five — IEEE paper) ── */}
      {activeTab === 'personality' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            padding: 16, borderRadius: 16,
            background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0 }}>
              📄 <strong style={{ color: '#A29BFE' }}>From the IEEE paper</strong> — The career prediction model uses these 5 personality factors as model inputs. Rate each from 1–10.
            </p>
          </div>

          {BIG_FIVE_QUESTIONS.map(({ key, label, emoji, q, low, high }) => (
            <div key={key} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: '#F0F0FF', marginBottom: 4 }}>{emoji} {label}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>{q}</div>
                </div>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0, marginLeft: 16,
                  background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk,sans-serif', fontWeight: 900, fontSize: 22, color: '#fff'
                }}>{bigFive[key] || '?'}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', minWidth: 80 }}>1 — {low}</span>
                <input type="range" min={1} max={10} value={bigFive[key] || 1}
                  onChange={e => setBigFive(b => ({ ...b, [key]: +e.target.value }))}
                  style={{ flex: 1, accentColor: '#7C5CFC' }} />
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', minWidth: 80, textAlign: 'right' }}>{high} — 10</span>
              </div>
              {/* Visual scale dots */}
              <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <div key={n} onClick={() => setBigFive(b => ({ ...b, [key]: n }))} style={{
                    flex: 1, height: 6, borderRadius: 3, cursor: 'pointer',
                    background: n <= (bigFive[key] || 0) ? '#7C5CFC' : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.2s'
                  }} />
                ))}
              </div>
            </div>
          ))}

          {bigFiveComplete && (
            <div style={{
              padding: 20, borderRadius: 16,
              background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>🎉</div>
              <p style={{ color: '#06D6A0', fontWeight: 700, fontSize: 15, margin: 0 }}>
                Personality assessment complete! This improves your career prediction accuracy.
              </p>
            </div>
          )}
        </div>
      )}

      <button className="btn btn-primary" onClick={save} disabled={loading}
        style={{ marginTop: 24, fontSize: 15, padding: '13px 32px' }}>
        {loading ? '⏳ Saving...' : '💾 Save Profile'}
      </button>
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// const INTERESTS = ['Web Development','Data Science','Machine Learning','Cybersecurity','Cloud Computing','Mobile Development','Game Development','IoT/Embedded','DevOps','Blockchain'];
// const SKILLS    = ['Python','Java','C++','JavaScript','React','Node.js','Machine Learning','SQL','Docker','AWS'];

// export default function Profile() {
//   const [profile, setProfile] = useState({ interests:[], skills:{}, personality:'', career_goal:'' });
//   const [loading, setLoading] = useState(false);

//   // ── Completion calculator ────────────────────────────────────
//   const completion = React.useMemo(() => {
//     const checks = {
//       'Interests selected'  : (profile.interests || []).length >= 2,
//       'Skills rated'        : Object.keys(profile.skills || {}).length >= 3,
//       'Career goal set'     : (profile.career_goal || '').trim().length > 5,
//       'Personality set'     : (profile.personality || '').trim().length > 0,
//       '5+ interests'        : (profile.interests || []).length >= 5,
//       '5+ skills rated'     : Object.keys(profile.skills || {}).length >= 5,
//     };
//     const done = Object.values(checks).filter(Boolean).length;
//     const pct  = Math.round((done / Object.keys(checks).length) * 100);
//     return { checks, done, total: Object.keys(checks).length, pct };
//   }, [profile]);

//   useEffect(() => {
//     API.get('/profile/').then(r => setProfile({
//       interests:   r.data.interests   || [],
//       skills:      r.data.skills      || {},
//       personality: r.data.personality || '',
//       career_goal: r.data.career_goal || ''
//     })).catch(() => {});
//   }, []);

//   const toggleInterest = i => setProfile(p => ({
//     ...p, interests: p.interests.includes(i) ? p.interests.filter(x=>x!==i) : [...p.interests, i]
//   }));

//   const setSkill = (s, v) => setProfile(p => ({ ...p, skills:{ ...p.skills, [s]:parseInt(v) } }));

//   const save = async () => {
//     setLoading(true);
//     try { await API.put('/profile/', profile); toast.success('Profile saved ✅'); }
//     catch { toast.error('Failed to save'); }
//     finally { setLoading(false); }
//   };

//   const SKILL_COLORS = ['#7C5CFC','#FF6B6B','#06D6A0','#FFD93D','#4ECDC4','#A29BFE','#FD79A8','#74B9FF','#55EFC4','#FDCB6E'];

//   return (
//     <div style={{ maxWidth:820, fontFamily:'Inter,sans-serif' }}>
//       <h1 className="page-title">Profile Setup</h1>
//       <p className="page-sub">Tell us about yourself for accurate AI career predictions</p>

//       {/* ── Completion Banner ── */}
//       <div style={{
//         borderRadius:20, padding:'20px 24px', marginBottom:24,
//         background: completion.pct === 100
//           ? 'linear-gradient(135deg,rgba(6,214,160,0.15),rgba(124,92,252,0.1))'
//           : 'linear-gradient(135deg,rgba(124,92,252,0.1),rgba(255,107,107,0.08))',
//         border:`1px solid ${completion.pct === 100 ? 'rgba(6,214,160,0.25)' : 'rgba(124,92,252,0.2)'}`,
//         display:'flex', alignItems:'center', gap:20, flexWrap:'wrap'
//       }}>
//         {/* Circle */}
//         <div style={{ position:'relative', width:80, height:80, flexShrink:0 }}>
//           <svg width="80" height="80" style={{ transform:'rotate(-90deg)' }}>
//             <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
//             <circle cx="40" cy="40" r="32" fill="none"
//               stroke={completion.pct === 100 ? '#06D6A0' : '#7C5CFC'} strokeWidth="7"
//               strokeLinecap="round"
//               strokeDasharray={`${2*Math.PI*32}`}
//               strokeDashoffset={`${2*Math.PI*32*(1-completion.pct/100)}`}
//               style={{ transition:'stroke-dashoffset 1s', filter:`drop-shadow(0 0 6px ${completion.pct===100?'#06D6A0':'#7C5CFC'})` }}/>
//           </svg>
//           <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
//             <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:16, fontWeight:900, color: completion.pct===100?'#06D6A0':'#7C5CFC' }}>
//               {completion.pct}%
//             </div>
//           </div>
//         </div>

//         <div style={{ flex:1 }}>
//           <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:16, color:'#F0F0FF', marginBottom:4 }}>
//             Profile Completion — {completion.done}/{completion.total} steps done
//           </div>
//           <p style={{ fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>
//             {completion.pct === 100 ? '🎉 Profile complete! AI predictions will be most accurate.' : 'Complete your profile for better career predictions'}
//           </p>
//           <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//             {Object.entries(completion.checks).map(([label, done]) => (
//               <div key={label} style={{
//                 padding:'4px 12px', borderRadius:20, fontSize:12, fontWeight:700,
//                 background: done ? 'rgba(6,214,160,0.12)' : 'rgba(255,255,255,0.04)',
//                 border:`1px solid ${done ? 'rgba(6,214,160,0.25)' : 'rgba(255,255,255,0.08)'}`,
//                 color: done ? '#06D6A0' : 'rgba(255,255,255,0.3)'
//               }}>{done ? '✓' : '○'} {label}</div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* ── Interests ── */}
//       <div className="card" style={{ marginBottom:20 }}>
//         <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//           ❤️ Your Interests
//         </div>
//         <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
//           {INTERESTS.map(i => {
//             const on = profile.interests.includes(i);
//             return (
//               <button key={i} onClick={() => toggleInterest(i)} style={{
//                 padding:'9px 18px', borderRadius:20,
//                 border:`1px solid ${on ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
//                 background: on ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)',
//                 color: on ? '#A29BFE' : 'rgba(255,255,255,0.4)',
//                 fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif',
//                 transition:'all 0.2s'
//               }}>{on ? '✓ ' : ''}{i}</button>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Skills ── */}
//       <div className="card" style={{ marginBottom:20 }}>
//         <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//           💡 Skill Ratings (0 – 10)
//         </div>
//         <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
//           {SKILLS.map((s, i) => {
//             const val = profile.skills[s] || 0;
//             const col = SKILL_COLORS[i];
//             return (
//               <div key={s}>
//                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
//                   <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>{s}</span>
//                   <span style={{ fontSize:14, fontWeight:900, color:col }}>{val}/10</span>
//                 </div>
//                 <div style={{ display:'flex', gap:6 }}>
//                   {[...Array(10)].map((_,n) => (
//                     <div key={n} onClick={() => setSkill(s, n+1)} style={{
//                       flex:1, height:8, borderRadius:6,
//                       background: n < val ? col : 'rgba(255,255,255,0.06)',
//                       cursor:'pointer', transition:'all 0.15s',
//                       boxShadow: n < val ? `0 0 6px ${col}55` : 'none'
//                     }}/>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* ── Career goal & personality ── */}
//       <div className="card" style={{ marginBottom:24 }}>
//         <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//           🎯 Career Details
//         </div>
//         <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//           <div>
//             <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Career Goal</label>
//             <input value={profile.career_goal}
//               onChange={e => setProfile({...profile, career_goal:e.target.value})}
//               placeholder="e.g. Become a Data Scientist at a top MNC" />
//           </div>
//           <div>
//             <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Personality Type</label>
//             <select value={profile.personality}
//               onChange={e => setProfile({...profile, personality:e.target.value})}>
//               <option value="">Select your personality type</option>
//               {['Analytical','Creative','Leader','Team Player','Detail-oriented','Innovative','Communicator'].map(p => (
//                 <option key={p}>{p}</option>
//               ))}
//             </select>
//           </div>
//         </div>
//       </div>

//       <button className="btn btn-primary" onClick={save} disabled={loading}
//         style={{ fontSize:15, padding:'13px 32px' }}>
//         {loading ? '⏳ Saving...' : '💾 Save Profile'}
//       </button>
//     </div>
//   );
// }

// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-toastify';
// // import API from '../api';

// // const INTERESTS = ['Web Development','Data Science','Machine Learning','Cybersecurity','Cloud Computing','Mobile Development','Game Development','IoT/Embedded','DevOps','Blockchain'];
// // const SKILLS    = ['Python','Java','C++','JavaScript','React','Node.js','Machine Learning','SQL','Docker','AWS'];

// // export default function Profile() {
// //   const [profile, setProfile] = useState({ interests:[], skills:{}, personality:'', career_goal:'' });
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     API.get('/profile/').then(r => setProfile({
// //       interests:   r.data.interests   || [],
// //       skills:      r.data.skills      || {},
// //       personality: r.data.personality || '',
// //       career_goal: r.data.career_goal || ''
// //     })).catch(() => {});
// //   }, []);

// //   const toggleInterest = i => setProfile(p => ({
// //     ...p, interests: p.interests.includes(i) ? p.interests.filter(x=>x!==i) : [...p.interests, i]
// //   }));

// //   const setSkill = (s, v) => setProfile(p => ({ ...p, skills:{ ...p.skills, [s]:parseInt(v) } }));

// //   const save = async () => {
// //     setLoading(true);
// //     try { await API.put('/profile/', profile); toast.success('Profile saved ✅'); }
// //     catch { toast.error('Failed to save'); }
// //     finally { setLoading(false); }
// //   };

// //   const SKILL_COLORS = ['#7C5CFC','#FF6B6B','#06D6A0','#FFD93D','#4ECDC4','#A29BFE','#FD79A8','#74B9FF','#55EFC4','#FDCB6E'];

// //   return (
// //     <div style={{ maxWidth:820, fontFamily:'Inter,sans-serif' }}>
// //       <h1 className="page-title">Profile Setup</h1>
// //       <p className="page-sub">Tell us about yourself for accurate AI career predictions</p>

// //       {/* ── Interests ── */}
// //       <div className="card" style={{ marginBottom:20 }}>
// //         <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
// //           ❤️ Your Interests
// //         </div>
// //         <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
// //           {INTERESTS.map(i => {
// //             const on = profile.interests.includes(i);
// //             return (
// //               <button key={i} onClick={() => toggleInterest(i)} style={{
// //                 padding:'9px 18px', borderRadius:20,
// //                 border:`1px solid ${on ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
// //                 background: on ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)',
// //                 color: on ? '#A29BFE' : 'rgba(255,255,255,0.4)',
// //                 fontWeight:700, fontSize:13, cursor:'pointer', fontFamily:'Inter,sans-serif',
// //                 transition:'all 0.2s'
// //               }}>{on ? '✓ ' : ''}{i}</button>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* ── Skills ── */}
// //       <div className="card" style={{ marginBottom:20 }}>
// //         <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
// //           💡 Skill Ratings (0 – 10)
// //         </div>
// //         <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
// //           {SKILLS.map((s, i) => {
// //             const val = profile.skills[s] || 0;
// //             const col = SKILL_COLORS[i];
// //             return (
// //               <div key={s}>
// //                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
// //                   <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>{s}</span>
// //                   <span style={{ fontSize:14, fontWeight:900, color:col }}>{val}/10</span>
// //                 </div>
// //                 <div style={{ display:'flex', gap:6 }}>
// //                   {[...Array(10)].map((_,n) => (
// //                     <div key={n} onClick={() => setSkill(s, n+1)} style={{
// //                       flex:1, height:8, borderRadius:6,
// //                       background: n < val ? col : 'rgba(255,255,255,0.06)',
// //                       cursor:'pointer', transition:'all 0.15s',
// //                       boxShadow: n < val ? `0 0 6px ${col}55` : 'none'
// //                     }}/>
// //                   ))}
// //                 </div>
// //               </div>
// //             );
// //           })}
// //         </div>
// //       </div>

// //       {/* ── Career goal & personality ── */}
// //       <div className="card" style={{ marginBottom:24 }}>
// //         <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
// //           🎯 Career Details
// //         </div>
// //         <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
// //           <div>
// //             <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Career Goal</label>
// //             <input value={profile.career_goal}
// //               onChange={e => setProfile({...profile, career_goal:e.target.value})}
// //               placeholder="e.g. Become a Data Scientist at a top MNC" />
// //           </div>
// //           <div>
// //             <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>Personality Type</label>
// //             <select value={profile.personality}
// //               onChange={e => setProfile({...profile, personality:e.target.value})}>
// //               <option value="">Select your personality type</option>
// //               {['Analytical','Creative','Leader','Team Player','Detail-oriented','Innovative','Communicator'].map(p => (
// //                 <option key={p}>{p}</option>
// //               ))}
// //             </select>
// //           </div>
// //         </div>
// //       </div>

// //       <button className="btn btn-primary" onClick={save} disabled={loading}
// //         style={{ fontSize:15, padding:'13px 32px' }}>
// //         {loading ? '⏳ Saving...' : '💾 Save Profile'}
// //       </button>
// //     </div>
// //   );
// // }

// // // import React, { useState, useEffect } from 'react';
// // // import { toast } from 'react-toastify';
// // // import API from '../api';

// // // const INTERESTS = ['Web Development','Data Science','Machine Learning','Cybersecurity','Cloud Computing','Mobile Development','Game Development','IoT/Embedded','DevOps','Blockchain'];
// // // const SKILL_LIST = ['Python','Java','C++','JavaScript','React','Node.js','Machine Learning','SQL','Docker','AWS'];

// // // export default function Profile() {
// // //   const [profile, setProfile] = useState({ interests:[], skills:{}, personality:'', career_goal:'' });
// // //   const [loading, setLoading] = useState(false);

// // //   useEffect(() => {
// // //     API.get('/profile/').then(r => setProfile({
// // //       interests:    r.data.interests    || [],
// // //       skills:       r.data.skills       || {},
// // //       personality:  r.data.personality  || '',
// // //       career_goal:  r.data.career_goal  || ''
// // //     })).catch(() => {});
// // //   }, []);

// // //   const toggleInterest = (i) => {
// // //     setProfile(p => ({
// // //       ...p,
// // //       interests: p.interests.includes(i) ? p.interests.filter(x=>x!==i) : [...p.interests, i]
// // //     }));
// // //   };

// // //   const setSkillRating = (skill, rating) => {
// // //     setProfile(p => ({ ...p, skills: { ...p.skills, [skill]: parseInt(rating) } }));
// // //   };

// // //   const save = async () => {
// // //     setLoading(true);
// // //     try {
// // //       await API.put('/profile/', profile);
// // //       toast.success('Profile saved! ✅');
// // //     } catch { toast.error('Failed to save'); }
// // //     finally { setLoading(false); }
// // //   };

// // //   return (
// // //     <div style={{ maxWidth:800 }}>
// // //       <h1 className="page-title">👤 My Profile</h1>
// // //       <p className="page-sub">Set your interests and rate your skills for accurate career predictions</p>

// // //       {/* Interests */}
// // //       <div className="card" style={{ marginBottom:24 }}>
// // //         <h2 style={{ fontWeight:800, marginBottom:16 }}>❤️ My Interests</h2>
// // //         <div style={{ display:'flex', flexWrap:'wrap', gap:10 }}>
// // //           {INTERESTS.map(i => (
// // //             <button key={i} onClick={() => toggleInterest(i)} style={{
// // //               padding:'10px 18px', borderRadius:20, border:'2px solid',
// // //               borderColor: profile.interests.includes(i) ? '#6C63FF' : '#E0E7FF',
// // //               background: profile.interests.includes(i) ? '#6C63FF' : '#fff',
// // //               color: profile.interests.includes(i) ? '#fff' : '#7A7A9D',
// // //               fontWeight:700, fontSize:14, cursor:'pointer', fontFamily:'Nunito,sans-serif'
// // //             }}>{i}</button>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Skill Ratings */}
// // //       <div className="card" style={{ marginBottom:24 }}>
// // //         <h2 style={{ fontWeight:800, marginBottom:16 }}>💡 Rate Your Skills (1-10)</h2>
// // //         <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
// // //           {SKILL_LIST.map(skill => (
// // //             <div key={skill} style={{ display:'flex', alignItems:'center', gap:16 }}>
// // //               <span style={{ width:130, fontWeight:700, fontSize:14 }}>{skill}</span>
// // //               <input type="range" min="0" max="10" value={profile.skills[skill] || 0}
// // //                 onChange={e => setSkillRating(skill, e.target.value)}
// // //                 style={{ flex:1, accentColor:'#6C63FF' }} />
// // //               <span style={{ width:36, textAlign:'center', fontWeight:900, color:'#6C63FF', fontSize:16 }}>
// // //                 {profile.skills[skill] || 0}
// // //               </span>
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>

// // //       {/* Career Goal & Personality */}
// // //       <div className="card" style={{ marginBottom:24 }}>
// // //         <h2 style={{ fontWeight:800, marginBottom:16 }}>🎯 Career Goal & Personality</h2>
// // //         <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
// // //           <div>
// // //             <label style={{ fontWeight:700, fontSize:14, marginBottom:6, display:'block' }}>Career Goal</label>
// // //             <input value={profile.career_goal} onChange={e => setProfile({...profile, career_goal: e.target.value})}
// // //               placeholder="e.g. Become a Data Scientist at a top MNC" />
// // //           </div>
// // //           <div>
// // //             <label style={{ fontWeight:700, fontSize:14, marginBottom:6, display:'block' }}>Personality Type</label>
// // //             <select value={profile.personality} onChange={e => setProfile({...profile, personality: e.target.value})}>
// // //               <option value="">Select personality type</option>
// // //               {['Analytical','Creative','Leader','Team Player','Detail-oriented','Innovative','Communicator'].map(p => (
// // //                 <option key={p}>{p}</option>
// // //               ))}
// // //             </select>
// // //           </div>
// // //         </div>
// // //       </div>

// // //       <button className="btn btn-primary" onClick={save} disabled={loading} style={{ fontSize:16, padding:'14px 32px' }}>
// // //         {loading ? '⏳ Saving...' : '💾 Save Profile'}
// // //       </button>
// // //     </div>
// // //   );
// // // }
