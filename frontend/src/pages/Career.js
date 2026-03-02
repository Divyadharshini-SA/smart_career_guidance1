import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const MEDAL = { 1: '🥇', 2: '🥈', 3: '🥉' };
const GRAD = [
  'linear-gradient(135deg,#7C5CFC,#5A3FE0)',
  'linear-gradient(135deg,#06D6A0,#0ABDE3)',
  'linear-gradient(135deg,#FF6B6B,#EE0979)',
];
const TREND_INFO = {
  improving: { color: '#06D6A0', icon: '📈', label: 'Score Improving' },
  declining: { color: '#FF6B6B', icon: '📉', label: 'Score Declining' },
  stable: { color: '#FFD93D', icon: '➡️', label: 'Score Stable' },
};

export default function Career() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null); // expanded career card index

  useEffect(() => {
    API.get('/career/history').then(r => { if (r.data?.length) setResult(r.data[0]); }).catch(() => { });
  }, []);

  const predict = async () => {
    setLoading(true);
    try {
      const res = await API.get('/career/recommend');
      setResult(res.data);
      toast.success('Career prediction complete! 🎯');
    } catch { toast.error('Complete your profile & assessments first.'); }
    finally { setLoading(false); }
  };

  const trend = result?.assessment_trend || 'stable';
  const ti = TREND_INFO[trend];

  return (
    <div style={{ fontFamily: 'Inter,sans-serif', maxWidth: 860 }}>
      <h1 className="page-title">Career Prediction</h1>
      <p className="page-sub">LightGBM-inspired AI engine — based on IEEE ICAISS 2025 paper</p>

      {/* Controls row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28, flexWrap: 'wrap' }}>
        <button className="btn btn-primary" onClick={predict} disabled={loading}
          style={{ fontSize: 15, padding: '13px 28px' }}>
          {loading ? '⏳ Predicting...' : '🔮 Get AI Recommendations'}
        </button>
        {result && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px',
            borderRadius: 20, background: 'rgba(255,255,255,0.04)',
            border: `1px solid ${ti.color}44`
          }}>
            <span>{ti.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: ti.color }}>{ti.label}</span>
          </div>
        )}
        {result?.confidence_label && (
          <div style={{
            padding: '8px 16px', borderRadius: 20,
            background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)',
            fontSize: 13, fontWeight: 700, color: '#A29BFE'
          }}>
            {result.confidence_label}
          </div>
        )}
      </div>

      {/* Data quality warnings */}
      {result?.data_quality_warnings?.length > 0 && (
        <div style={{ marginBottom: 20, padding: 16, borderRadius: 14, background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.2)' }}>
          <div style={{ fontWeight: 800, fontSize: 13, color: '#FF6B6B', marginBottom: 8 }}>⚠️ Improve Your Prediction Accuracy</div>
          {result.data_quality_warnings.map((w, i) => (
            <div key={i} style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>• {w}</div>
          ))}
        </div>
      )}

      {!result && !loading && (
        <div style={{ maxWidth: 480, borderRadius: 24, padding: 48, textAlign: 'center', background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.15)' }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔮</div>
          <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800, fontSize: 20, color: '#F0F0FF', marginBottom: 12 }}>Ready for your prediction?</h3>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.7 }}>
            Complete your profile, take assessments, fill in the Big Five personality survey, and upload your resume for the most accurate results.
          </p>
        </div>
      )}

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Top Career Cards — 3-tier output: domain → salary/growth → evidence */}
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>
            🏆 Top Career Matches
          </div>

          {(result.top_careers || []).map((c, i) => {
            const isOpen = expanded === i;
            return (
              <div key={c.domain} style={{
                borderRadius: 20, border: '1px solid rgba(255,255,255,0.08)',
                background: `${GRAD[i].replace('linear-gradient(135deg,', '').replace(')', '').split(',')[0]}11`,
                overflow: 'hidden'
              }}>
                {/* Card header */}
                <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, flexShrink: 0,
                    background: GRAD[i], display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Space Grotesk,sans-serif', fontWeight: 900, fontSize: 22, color: '#fff',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
                  }}>{MEDAL[c.rank] || `#${i + 1}`}</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 800, fontSize: 18, color: '#F0F0FF', marginBottom: 6 }}>{c.domain}</div>
                    {/* Progress bar */}
                    <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 8 }}>
                      <div style={{ height: '100%', borderRadius: 8, background: GRAD[i], width: `${c.suitability_percentage}%`, transition: 'width 1s' }} />
                    </div>
                    {/* Metadata row */}
                    <div style={{ display: 'flex', gap: 14, marginTop: 8, flexWrap: 'wrap' }}>
                      {c.salary_band && (
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>💰 {c.salary_band}</span>
                      )}
                      {c.growth && (
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>📈 {c.growth} Growth</span>
                      )}
                      {c.skill_coverage_pct !== undefined && (
                        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>🎯 {c.skill_coverage_pct}% skill match</span>
                      )}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontWeight: 900, fontSize: 28, color: '#F0F0FF' }}>{c.suitability_percentage?.toFixed(1)}%</div>
                    <button onClick={() => setExpanded(isOpen ? null : i)} style={{
                      fontSize: 12, color: '#7C5CFC', background: 'none', border: 'none',
                      cursor: 'pointer', fontWeight: 700, marginTop: 4, fontFamily: 'Inter,sans-serif'
                    }}>{isOpen ? '▲ Less' : '▼ Details'}</button>
                  </div>
                </div>

                {/* Expanded evidence panel */}
                {isOpen && (
                  <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ paddingTop: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

                      {/* Evidence */}
                      {c.evidence?.length > 0 && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>Why this career?</div>
                          {c.evidence.map((e, ei) => (
                            <div key={ei} style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 6, paddingLeft: 12, borderLeft: '2px solid rgba(124,92,252,0.4)' }}>{e}</div>
                          ))}
                        </div>
                      )}

                      {/* LightGBM learner breakdown */}
                      {c.learner_contributions && (
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: 8 }}>
                            AI Score Breakdown
                            <span style={{ fontSize: 10, marginLeft: 6, color: 'rgba(255,255,255,0.2)', fontWeight: 500, textTransform: 'none' }}>(LightGBM weak learners)</span>
                          </div>
                          {Object.entries(c.learner_contributions).map(([k, v]) => (
                            <div key={k} style={{ marginBottom: 6 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>
                                <span>{k.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                <span>{v?.toFixed(1)}%</span>
                              </div>
                              <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                                <div style={{ height: '100%', borderRadius: 4, background: GRAD[i], width: `${Math.min(v * 3, 100)}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Missing critical skills */}
                      {c.missing_critical?.length > 0 && (
                        <div style={{ gridColumn: '1/-1' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,107,107,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>⚠️ Critical Skills to Learn</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {c.missing_critical.map(s => (
                              <span key={s} style={{
                                padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
                                color: '#FF6B6B'
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Matched skills */}
                      {c.matched_skills?.length > 0 && (
                        <div style={{ gridColumn: '1/-1' }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(6,214,160,0.7)', textTransform: 'uppercase', marginBottom: 8 }}>✅ Skills You Already Have</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {c.matched_skills.map(s => (
                              <span key={s} style={{
                                padding: '4px 10px', borderRadius: 12, fontSize: 12, fontWeight: 700,
                                background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.25)',
                                color: '#06D6A0'
                              }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Score grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { label: 'Skill Match', val: result.skill_match_score, icon: '💡', color: '#7C5CFC' },
              { label: 'Aptitude Score', val: result.aptitude_score, icon: '🧠', color: '#FF6B6B' },
              { label: 'Interest Match', val: result.interest_match_score, icon: '❤️', color: '#06D6A0' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 30, fontWeight: 900, color: s.color }}>
                  {(s.val || 0).toFixed(1)}%
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Confidence + Algorithm info */}
          <div style={{
            borderRadius: 20, padding: 28, textAlign: 'center',
            background: 'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(6,214,160,0.08))',
            border: '1px solid rgba(124,92,252,0.2)'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>AI Confidence Score</p>
            <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 52, fontWeight: 900, background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {result.confidence_score?.toFixed(1)}%
            </div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12, marginTop: 10 }}>
              {result.algorithm || 'LightGBM-Inspired Gradient Boosting Ensemble'} · {result.total_skills_provided || 0} skills analysed
            </p>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// const GRAD = [
//   'linear-gradient(135deg,#7C5CFC,#5A3FE0)',
//   'linear-gradient(135deg,#06D6A0,#0ABDE3)',
//   'linear-gradient(135deg,#FF6B6B,#EE0979)',
// ];

// export default function Career() {
//   const [result, setResult]   = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     API.get('/career/history').then(r => { if(r.data?.length) setResult(r.data[0]); }).catch(()=>{});
//   }, []);

//   const predict = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get('/career/recommend');
//       setResult(res.data);
//       toast.success('Career prediction complete! 🎯');
//     } catch { toast.error('Complete your profile & assessments first.'); }
//     finally { setLoading(false); }
//   };

//   return (
//     <div style={{ fontFamily:'Inter,sans-serif' }}>
//       <h1 className="page-title">Career Prediction</h1>
//       <p className="page-sub">AI-powered recommendations based on your skills, aptitude & interests</p>

//       <button className="btn btn-primary" onClick={predict} disabled={loading}
//         style={{ marginBottom:32, fontSize:15, padding:'13px 28px' }}>
//         {loading ? '⏳ Predicting...' : '🔮 Get AI Recommendations'}
//       </button>

//       {!result && !loading && (
//         <div style={{
//           maxWidth:480, borderRadius:24, padding:48, textAlign:'center',
//           background:'rgba(124,92,252,0.06)', border:'1px solid rgba(124,92,252,0.15)'
//         }}>
//           <div style={{ fontSize:64, marginBottom:20 }}>🔮</div>
//           <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:20, color:'#F0F0FF', marginBottom:12 }}>Ready for your prediction?</h3>
//           <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, lineHeight:1.7 }}>
//             Complete your profile, take assessments, and upload your resume for the most accurate results.
//           </p>
//         </div>
//       )}

//       {result && (
//         <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:800 }}>

//           {/* Top careers */}
//           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>
//             🏆 Top Career Matches
//           </div>
//           {(result.top_careers||[]).map((c,i) => (
//             <div key={c.domain} style={{
//               borderRadius:20, padding:'20px 24px',
//               background: GRAD[i] + '22',
//               border:`1px solid rgba(255,255,255,0.08)`,
//               display:'flex', alignItems:'center', gap:20
//             }}>
//               <div style={{
//                 width:52, height:52, borderRadius:14, flexShrink:0,
//                 background:GRAD[i], display:'flex', alignItems:'center',
//                 justifyContent:'center', fontFamily:'Space Grotesk,sans-serif',
//                 fontWeight:900, fontSize:20, color:'#fff',
//                 boxShadow:`0 8px 20px rgba(0,0,0,0.3)`
//               }}>#{i+1}</div>
//               <div style={{ flex:1 }}>
//                 <div style={{ fontWeight:800, fontSize:18, color:'#F0F0FF', marginBottom:10 }}>{c.domain}</div>
//                 <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:8 }}>
//                   <div style={{ height:'100%', borderRadius:8, background:GRAD[i], width:`${c.suitability_percentage}%`, transition:'width 1s' }}/>
//                 </div>
//               </div>
//               <div style={{ fontWeight:900, fontSize:26, color:'#F0F0FF', flexShrink:0 }}>
//                 {c.suitability_percentage?.toFixed(1)}%
//               </div>
//             </div>
//           ))}

//           {/* Score grid */}
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
//             {[
//               { label:'Skill Match',    val:result.skill_match_score,    icon:'💡', color:'#7C5CFC' },
//               { label:'Aptitude Score', val:result.aptitude_score,       icon:'🧠', color:'#FF6B6B' },
//               { label:'Interest Match', val:result.interest_match_score, icon:'❤️', color:'#06D6A0' },
//             ].map(s => (
//               <div key={s.label} className="card" style={{ textAlign:'center', padding:24 }}>
//                 <div style={{ fontSize:32, marginBottom:10 }}>{s.icon}</div>
//                 <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:30, fontWeight:900, color:s.color }}>
//                   {(s.val||0).toFixed(1)}%
//                 </div>
//                 <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:600, marginTop:4 }}>{s.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Confidence */}
//           <div style={{
//             borderRadius:20, padding:28, textAlign:'center',
//             background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(6,214,160,0.08))',
//             border:'1px solid rgba(124,92,252,0.2)'
//           }}>
//             <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:600, marginBottom:8 }}>AI Confidence Score</p>
//             <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:52, fontWeight:900, background:'linear-gradient(135deg,#7C5CFC,#06D6A0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
//               {result.confidence_score?.toFixed(1)}%
//             </div>
//             <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:10 }}>
//               Based on your skill match, aptitude, and interest alignment
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-toastify';
// // import API from '../api';

// // export default function Career() {
// //   const [result, setResult]   = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     API.get('/career/history').then(r => { if (r.data?.length) setResult(r.data[0]); }).catch(() => {});
// //   }, []);

// //   const predict = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await API.get('/career/recommend');
// //       setResult(res.data);
// //       toast.success('Career prediction complete! 🎯');
// //     } catch { toast.error('Prediction failed. Complete your profile & assessments first.'); }
// //     finally { setLoading(false); }
// //   };

// //   const COLORS = ['#6C63FF','#FF6584','#43E97B'];

// //   return (
// //     <div>
// //       <h1 className="page-title">🎯 Career Prediction</h1>
// //       <p className="page-sub">AI-powered career recommendations based on your skills, aptitude & interests</p>

// //       <button className="btn btn-primary" onClick={predict} disabled={loading} style={{ marginBottom:28, fontSize:16, padding:'13px 28px' }}>
// //         {loading ? '⏳ Predicting...' : '🔮 Get Career Recommendations'}
// //       </button>

// //       {result && (
// //         <div style={{ display:'flex', flexDirection:'column', gap:24, maxWidth:800 }}>
// //           {/* Top Careers */}
// //           <div>
// //             <h2 style={{ fontWeight:800, marginBottom:16 }}>🏆 Top Career Matches</h2>
// //             <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
// //               {(result.top_careers || []).map((c, i) => (
// //                 <div key={c.domain} className="card" style={{ display:'flex', alignItems:'center', gap:20, padding:'20px 24px' }}>
// //                   <div style={{
// //                     width:48, height:48, borderRadius:14, background:COLORS[i]+'22',
// //                     display:'flex', alignItems:'center', justifyContent:'center',
// //                     fontSize:24, fontWeight:900, color:COLORS[i]
// //                   }}>#{i+1}</div>
// //                   <div style={{ flex:1 }}>
// //                     <div style={{ fontWeight:800, fontSize:17 }}>{c.domain}</div>
// //                     <div className="progress-bar-wrap" style={{ marginTop:8 }}>
// //                       <div className="progress-bar-fill" style={{ width:`${c.suitability_percentage}%`, background:COLORS[i] }} />
// //                     </div>
// //                   </div>
// //                   <div style={{ fontWeight:900, fontSize:22, color:COLORS[i] }}>
// //                     {c.suitability_percentage?.toFixed(1)}%
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           {/* Score breakdown */}
// //           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
// //             {[
// //               { label:'Skill Match',    val:result.skill_match_score,     icon:'💡', color:'#6C63FF' },
// //               { label:'Aptitude Score', val:result.aptitude_score,        icon:'🧠', color:'#FF6584' },
// //               { label:'Interest Match', val:result.interest_match_score,  icon:'❤️', color:'#43E97B' },
// //             ].map(s => (
// //               <div key={s.label} className="card" style={{ textAlign:'center', padding:20 }}>
// //                 <div style={{ fontSize:30, marginBottom:6 }}>{s.icon}</div>
// //                 <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.val?.toFixed(1) || 0}%</div>
// //                 <div style={{ fontSize:13, color:'#7A7A9D', fontWeight:600 }}>{s.label}</div>
// //               </div>
// //             ))}
// //           </div>

// //           {/* Confidence */}
// //           <div className="card" style={{ background:'#F0EEFF', border:'2px solid #6C63FF33', textAlign:'center', padding:24 }}>
// //             <p style={{ color:'#7A7A9D', fontWeight:600, marginBottom:4 }}>AI Confidence Score</p>
// //             <div style={{ fontSize:42, fontWeight:900, color:'#6C63FF' }}>{result.confidence_score?.toFixed(1)}%</div>
// //             <p style={{ color:'#555', fontSize:14, marginTop:8 }}>
// //               Based on your combined skill match, aptitude performance, and interest alignment
// //             </p>
// //           </div>
// //         </div>
// //       )}

// //       {!result && !loading && (
// //         <div className="card" style={{ maxWidth:500, textAlign:'center', padding:40 }}>
// //           <div style={{ fontSize:60, marginBottom:16 }}>🔮</div>
// //           <h3 style={{ fontWeight:800, marginBottom:8 }}>Ready for your prediction?</h3>
// //           <p style={{ color:'#7A7A9D', fontSize:14 }}>
// //             Complete your profile, take assessments, and upload your resume for the most accurate results.
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
