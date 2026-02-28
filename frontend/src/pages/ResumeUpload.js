import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

function SectionRow({ label, present }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'9px 14px', borderRadius:10, marginBottom:6,
      background: present ? 'rgba(6,214,160,0.06)' : 'rgba(255,107,107,0.06)',
      border: `1px solid ${present ? 'rgba(6,214,160,0.15)' : 'rgba(255,107,107,0.12)'}`
    }}>
      <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.7)' }}>{label}</span>
      <span style={{
        fontSize:12, fontWeight:800, padding:'3px 10px', borderRadius:20,
        background: present ? 'rgba(6,214,160,0.15)' : 'rgba(255,107,107,0.15)',
        color: present ? '#06D6A0' : '#FF6B6B'
      }}>{present ? '✓ Found' : '✗ Missing'}</span>
    </div>
  );
}

export default function ResumeUpload() {
  const [file,    setFile]    = useState(null);
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag,    setDrag]    = useState(false);
  const [tab,     setTab]     = useState('overview'); // overview | sections | strengths | ats

  useEffect(() => {
    API.get('/resume/latest').then(r => setResult(r.data)).catch(() => {});
  }, []);

  const upload = async e => {
    e.preventDefault();
    if (!file) { toast.warning('Please select a file'); return; }
    const fd = new FormData();
    fd.append('file', file);
    setLoading(true);
    try {
      const res = await API.post('/resume/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
      setTab('overview');
      toast.success('Resume analyzed! 🎉');
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  const fb      = result?.feedback;
  const score   = result?.resume_score || 0;
  const scoreColor = fb?.score_color || (score >= 70 ? '#06D6A0' : score >= 50 ? '#FFD93D' : '#FF6B6B');
  const scoreLabel = fb?.score_label  || (score >= 70 ? 'Good Resume 👍' : 'Needs Work ⚠️');

  const TABS = [
    { key:'overview',   label:'📊 Overview'   },
    { key:'sections',   label:'📋 Sections'   },
    { key:'strengths',  label:'💪 Strengths'  },
    { key:'improve',    label:'🔧 Improve'    },
    { key:'ats',        label:'🤖 ATS Tips'   },
  ];

  return (
    <div style={{ fontFamily:'Inter,sans-serif', maxWidth:960 }}>
      <h1 className="page-title">Resume Analyzer</h1>
      <p className="page-sub">Upload your resume for AI-powered scoring, skill extraction & smart feedback</p>

      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:20, alignItems:'start' }}>

        {/* ── Upload panel ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="card">
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
              📤 Upload Resume
            </div>
            <form onSubmit={upload} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('rf').click()}
                style={{
                  border: `2px dashed ${drag ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius:16, padding:'36px 20px', textAlign:'center',
                  background: drag ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.02)',
                  cursor:'pointer', transition:'all 0.2s'
                }}>
                <div style={{ fontSize:36, marginBottom:10 }}>{file ? '📄' : '📁'}</div>
                <p style={{ fontWeight:700, color: file ? '#7C5CFC' : 'rgba(255,255,255,0.35)', fontSize:13, marginBottom:4 }}>
                  {file ? file.name : 'Drop file here or click to browse'}
                </p>
                <p style={{ color:'rgba(255,255,255,0.2)', fontSize:11 }}>PDF or DOCX • Max 16MB</p>
                <input id="rf" type="file" accept=".pdf,.doc,.docx"
                  onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
              </button>
            </form>
          </div>

          {/* Score circle */}
          {result && (
            <div className="card" style={{ textAlign:'center' }}>
              <div style={{ position:'relative', width:120, height:120, margin:'0 auto 14px' }}>
                <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - score / 100)}`}
                    style={{ transition:'stroke-dashoffset 1s', filter:`drop-shadow(0 0 8px ${scoreColor})` }}/>
                </svg>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
                  <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:24, fontWeight:900, color:scoreColor }}>
                    {score.toFixed(0)}%
                  </div>
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:15, color:scoreColor, marginBottom:6 }}>{scoreLabel}</div>
              <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)' }}>
                {fb?.skill_count || result.extracted_skills?.length || 0} skills detected
              </div>
            </div>
          )}

          {/* Quick tips card */}
          <div className="card" style={{ background:'rgba(255,217,61,0.04)', border:'1px solid rgba(255,217,61,0.15)' }}>
            <div style={{ fontWeight:700, color:'#FFD93D', fontSize:13, marginBottom:10 }}>💡 Quick Tips</div>
            {['Include all technical skills','Add projects with tech stack','Use standard section headings','Keep it 1-2 pages'].map(t => (
              <div key={t} style={{ display:'flex', gap:8, fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:5 }}>
                <span style={{ color:'#FFD93D', flexShrink:0 }}>→</span>{t}
              </div>
            ))}
          </div>
        </div>

        {/* ── Results panel ── */}
        {result ? (
          <div>
            {/* Tab bar */}
            <div style={{ display:'flex', gap:6, marginBottom:16, flexWrap:'wrap' }}>
              {TABS.map(t => (
                <button key={t.key} onClick={() => setTab(t.key)} style={{
                  padding:'8px 16px', borderRadius:10, border:'none', cursor:'pointer',
                  fontFamily:'Inter,sans-serif', fontWeight:700, fontSize:13,
                  background: tab === t.key ? '#7C5CFC' : 'rgba(255,255,255,0.05)',
                  color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.4)',
                  transition:'all 0.2s'
                }}>{t.label}</button>
              ))}
            </div>

            {/* ── Overview tab ── */}
            {tab === 'overview' && (
              <div className="card">
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
                  Detected Skills ({result.extracted_skills?.length || 0})
                </div>
                {(result.extracted_skills || []).length === 0 ? (
                  <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>
                    No skills detected. Try uploading a richer resume with a proper Skills section.
                  </p>
                ) : (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:20 }}>
                    {(result.extracted_skills || []).map(s => (
                      <span key={s} style={{
                        padding:'5px 14px', borderRadius:20,
                        background:'rgba(124,92,252,0.12)',
                        border:'1px solid rgba(124,92,252,0.25)',
                        color:'#A29BFE', fontSize:13, fontWeight:700,
                        textTransform:'capitalize'
                      }}>{s}</span>
                    ))}
                  </div>
                )}

                {/* Score breakdown bars */}
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:14 }}>
                  Score Breakdown
                </div>
                {[
                  { label:'Skill Coverage (50%)', val: Math.min((result.extracted_skills?.length || 0) / 15, 1) * 50, max:50, color:'#7C5CFC' },
                  { label:'Resume Sections (30%)', val: Object.values(fb?.sections || {}).filter(Boolean).length / 8 * 30, max:30, color:'#06D6A0' },
                  { label:'Content Length (20%)',  val: score - Math.min((result.extracted_skills?.length || 0) / 15, 1) * 50 - Object.values(fb?.sections || {}).filter(Boolean).length / 8 * 30, max:20, color:'#FFD93D' },
                ].map(b => (
                  <div key={b.label} style={{ marginBottom:12 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.5)' }}>{b.label}</span>
                      <span style={{ fontSize:12, fontWeight:800, color:b.color }}>{Math.max(0, b.val).toFixed(1)} / {b.max}</span>
                    </div>
                    <div style={{ height:6, background:'rgba(255,255,255,0.06)', borderRadius:6 }}>
                      <div style={{ height:'100%', borderRadius:6, background:b.color, width:`${Math.max(0, Math.min(b.val / b.max * 100, 100))}%`, transition:'width 1s', boxShadow:`0 0 8px ${b.color}55` }}/>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── Sections tab ── */}
            {tab === 'sections' && fb?.sections && (
              <div className="card">
                <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>
                  Resume Sections Check
                </div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:18 }}>
                  {Object.values(fb.sections).filter(Boolean).length} of {Object.keys(fb.sections).length} sections found
                </p>
                {Object.entries(fb.sections).map(([label, present]) => (
                  <SectionRow key={label} label={label} present={present} />
                ))}
              </div>
            )}

            {/* ── Strengths tab ── */}
            {tab === 'strengths' && fb?.strengths && (
              <div className="card">
                <div style={{ fontSize:13, fontWeight:700, color:'#06D6A0', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
                  ✅ Your Strengths ({fb.strengths.length})
                </div>
                {fb.strengths.map((s, i) => (
                  <div key={i} style={{
                    display:'flex', gap:12, alignItems:'flex-start',
                    padding:'12px 14px', borderRadius:12, marginBottom:8,
                    background:'rgba(6,214,160,0.06)', border:'1px solid rgba(6,214,160,0.15)'
                  }}>
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:'rgba(6,214,160,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#06D6A0', fontSize:13 }}>✓</div>
                    <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>{s}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── Improve tab ── */}
            {tab === 'improve' && fb?.improvements && (
              <div className="card">
                <div style={{ fontSize:13, fontWeight:700, color:'#FF6B6B', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
                  🔧 What to Improve ({fb.improvements.length})
                </div>
                {fb.improvements.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'30px 0' }}>
                    <div style={{ fontSize:40, marginBottom:10 }}>🎉</div>
                    <p style={{ color:'#06D6A0', fontWeight:700 }}>No major improvements needed!</p>
                  </div>
                ) : fb.improvements.map((imp, i) => (
                  <div key={i} style={{
                    display:'flex', gap:12, alignItems:'flex-start',
                    padding:'12px 14px', borderRadius:12, marginBottom:8,
                    background:'rgba(255,107,107,0.06)', border:'1px solid rgba(255,107,107,0.15)'
                  }}>
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:'rgba(255,107,107,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#FF6B6B', fontSize:12 }}>{i+1}</div>
                    <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>{imp}</span>
                  </div>
                ))}
              </div>
            )}

            {/* ── ATS tab ── */}
            {tab === 'ats' && fb?.ats_tips && (
              <div className="card">
                <div style={{ fontSize:13, fontWeight:700, color:'#7C5CFC', textTransform:'uppercase', letterSpacing:1, marginBottom:6 }}>
                  🤖 ATS Optimization Tips
                </div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:18 }}>
                  ATS (Applicant Tracking System) scans your resume before a human sees it.
                </p>
                {fb.ats_tips.map((tip, i) => (
                  <div key={i} style={{
                    display:'flex', gap:12, alignItems:'flex-start',
                    padding:'12px 14px', borderRadius:12, marginBottom:8,
                    background:'rgba(124,92,252,0.06)', border:'1px solid rgba(124,92,252,0.15)'
                  }}>
                    <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background:'rgba(124,92,252,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'#7C5CFC', fontSize:13 }}>→</div>
                    <span style={{ fontSize:14, fontWeight:600, color:'rgba(255,255,255,0.75)', lineHeight:1.5 }}>{tip}</span>
                  </div>
                ))}

                {/* ATS score indicator */}
                <div style={{ marginTop:20, padding:'16px', borderRadius:14, background:'rgba(124,92,252,0.08)', border:'1px solid rgba(124,92,252,0.2)', textAlign:'center' }}>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Estimated ATS Score</div>
                  <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:32, fontWeight:900, color:'#7C5CFC' }}>{score.toFixed(0)}%</div>
                  <div style={{ fontSize:12, color:'rgba(255,255,255,0.3)', marginTop:4 }}>Based on section coverage & keyword density</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* No resume yet state */
          <div className="card" style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:60, marginBottom:20 }}>📄</div>
            <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:20, color:'rgba(255,255,255,0.6)', marginBottom:10 }}>
              No resume analyzed yet
            </h3>
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:14, lineHeight:1.7 }}>
              Upload your PDF or DOCX resume to get:<br/>
              AI skill extraction • Section checker • ATS tips • Improvement suggestions
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// export default function ResumeUpload() {
//   const [file, setFile]       = useState(null);
//   const [result, setResult]   = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [drag, setDrag]       = useState(false);

//   useEffect(() => { API.get('/resume/latest').then(r => setResult(r.data)).catch(()=>{}); }, []);

//   const upload = async e => {
//     e.preventDefault();
//     if (!file) { toast.warning('Please select a file'); return; }
//     const fd = new FormData();
//     fd.append('file', file);
//     setLoading(true);
//     try {
//       const res = await API.post('/resume/upload', fd, { headers:{'Content-Type':'multipart/form-data'} });
//       setResult(res.data);
//       toast.success('Resume analyzed! 🎉');
//     } catch { toast.error('Upload failed'); }
//     finally { setLoading(false); }
//   };

//   const score = result?.resume_score || 0;
//   const scoreColor = score>=70 ? '#06D6A0' : score>=50 ? '#FFD93D' : '#FF6B6B';
//   const scoreLabel = score>=70 ? 'Strong Resume ✅' : score>=50 ? 'Good Resume 👍' : 'Needs Work ⚠️';

//   return (
//     <div style={{ fontFamily:'Inter,sans-serif' }}>
//       <h1 className="page-title">Resume Analyzer</h1>
//       <p className="page-sub">Upload your resume for AI-powered skill extraction and ATS scoring</p>

//       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:20, maxWidth:900 }}>

//         {/* Upload */}
//         <div className="card">
//           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//             📤 Upload Resume
//           </div>
//           <form onSubmit={upload} style={{ display:'flex', flexDirection:'column', gap:16 }}>
//             <div
//               onDragOver={e=>{ e.preventDefault(); setDrag(true); }}
//               onDragLeave={()=>setDrag(false)}
//               onDrop={e=>{ e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}
//               onClick={() => document.getElementById('rf').click()}
//               style={{
//                 border:`2px dashed ${drag ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
//                 borderRadius:16, padding:'40px 20px', textAlign:'center',
//                 background: drag ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.02)',
//                 cursor:'pointer', transition:'all 0.2s'
//               }}>
//               <div style={{ fontSize:40, marginBottom:12 }}>
//                 {file ? '📄' : '📁'}
//               </div>
//               <p style={{ fontWeight:700, color: file ? '#7C5CFC' : 'rgba(255,255,255,0.4)', fontSize:14, marginBottom:6 }}>
//                 {file ? file.name : 'Drop file here or click to browse'}
//               </p>
//               <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>PDF or DOCX • Max 16MB</p>
//               <input id="rf" type="file" accept=".pdf,.doc,.docx"
//                 onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
//             </div>
//             <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
//               {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
//             </button>
//           </form>

//           {/* Tips */}
//           <div style={{ marginTop:20, padding:16, borderRadius:12, background:'rgba(255,217,61,0.06)', border:'1px solid rgba(255,217,61,0.15)' }}>
//             <p style={{ fontWeight:700, color:'#FFD93D', fontSize:13, marginBottom:10 }}>💡 Tips to score higher</p>
//             {['Include all technical skills clearly','Add projects with tech stack used','Add certifications and courses','Use job-role specific keywords'].map(t => (
//               <div key={t} style={{ display:'flex', gap:8, fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
//                 <span style={{ color:'#FFD93D' }}>→</span>{t}
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Results */}
//         {result && (
//           <div className="card">
//             <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//               📊 Analysis Results
//             </div>

//             {/* Score circle */}
//             <div style={{ textAlign:'center', marginBottom:24 }}>
//               <div style={{ position:'relative', width:120, height:120, margin:'0 auto 16px' }}>
//                 <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
//                   <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
//                   <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10"
//                     strokeLinecap="round"
//                     strokeDasharray={`${2*Math.PI*50}`}
//                     strokeDashoffset={`${2*Math.PI*50*(1-score/100)}`}
//                     style={{ transition:'stroke-dashoffset 1s', filter:`drop-shadow(0 0 8px ${scoreColor})` }}/>
//                 </svg>
//                 <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
//                   <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:24, fontWeight:900, color:scoreColor }}>{score.toFixed(0)}%</div>
//                 </div>
//               </div>
//               <div style={{ fontWeight:800, fontSize:15, color:scoreColor }}>{scoreLabel}</div>
//             </div>

//             {/* Skills */}
//             <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>
//               Detected Skills ({result.extracted_skills?.length || 0})
//             </div>
//             <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//               {(result.extracted_skills||[]).map(s => (
//                 <span key={s} style={{
//                   padding:'5px 12px', borderRadius:20,
//                   background:'rgba(124,92,252,0.12)',
//                   border:'1px solid rgba(124,92,252,0.25)',
//                   color:'#A29BFE', fontSize:12, fontWeight:700
//                 }}>{s}</span>
//               ))}
//               {(!result.extracted_skills || result.extracted_skills.length===0) && (
//                 <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>No skills detected. Try a richer resume.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-toastify';
// // import API from '../api';

// // export default function ResumeUpload() {
// //   const [file, setFile]     = useState(null);
// //   const [result, setResult] = useState(null);
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     API.get('/resume/latest').then(r => setResult(r.data)).catch(() => {});
// //   }, []);

// //   const upload = async e => {
// //     e.preventDefault();
// //     if (!file) { toast.warning('Please select a file'); return; }
// //     const fd = new FormData();
// //     fd.append('file', file);
// //     setLoading(true);
// //     try {
// //       const res = await API.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
// //       setResult(res.data);
// //       toast.success('Resume analyzed! 🎉');
// //     } catch { toast.error('Upload failed'); }
// //     finally { setLoading(false); }
// //   };

// //   const scoreColor = s => s >= 70 ? '#43E97B' : s >= 50 ? '#F9A825' : '#FF6584';

// //   return (
// //     <div>
// //       <h1 className="page-title">📄 Resume Analyzer</h1>
// //       <p className="page-sub">Upload your resume for AI-powered skill extraction and scoring</p>

// //       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:900 }}>
// //         {/* Upload card */}
// //         <div className="card">
// //           <h2 style={{ fontWeight:800, marginBottom:20 }}>📤 Upload Resume</h2>
// //           <form onSubmit={upload} style={{ display:'flex', flexDirection:'column', gap:16 }}>
// //             <div style={{
// //               border:'2px dashed #6C63FF', borderRadius:14, padding:32, textAlign:'center',
// //               background:'#F0EEFF', cursor:'pointer'
// //             }} onClick={() => document.getElementById('rf').click()}>
// //               <div style={{ fontSize:40, marginBottom:10 }}>📁</div>
// //               <p style={{ fontWeight:700, color:'#6C63FF' }}>
// //                 {file ? file.name : 'Click to choose PDF or DOCX'}
// //               </p>
// //               <p style={{ color:'#7A7A9D', fontSize:13, marginTop:4 }}>Max 16MB</p>
// //               <input id="rf" type="file" accept=".pdf,.doc,.docx"
// //                 onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
// //             </div>
// //             <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
// //               {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
// //             </button>
// //           </form>
// //         </div>

// //         {/* Results card */}
// //         {result && (
// //           <div className="card">
// //             <h2 style={{ fontWeight:800, marginBottom:20 }}>📊 Analysis Results</h2>
// //             <div style={{ textAlign:'center', marginBottom:24 }}>
// //               <div style={{ fontSize:52, fontWeight:900, color:scoreColor(result.resume_score) }}>
// //                 {result.resume_score?.toFixed(1)}%
// //               </div>
// //               <p style={{ color:'#7A7A9D', fontWeight:600 }}>Resume Score</p>
// //               <div className="progress-bar-wrap" style={{ marginTop:12 }}>
// //                 <div className="progress-bar-fill" style={{ width:`${result.resume_score}%`, background:scoreColor(result.resume_score) }} />
// //               </div>
// //             </div>
// //             <h3 style={{ fontWeight:800, marginBottom:12 }}>✅ Detected Skills ({result.extracted_skills?.length || 0})</h3>
// //             <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
// //               {(result.extracted_skills || []).map(s => (
// //                 <span key={s} className="badge" style={{ background:'#F0EEFF', color:'#6C63FF', fontSize:13 }}>
// //                   {s}
// //                 </span>
// //               ))}
// //               {(!result.extracted_skills || result.extracted_skills.length === 0) && (
// //                 <p style={{ color:'#7A7A9D', fontSize:14 }}>No skills detected. Try uploading a richer resume.</p>
// //               )}
// //             </div>
// //           </div>
// //         )}
// //       </div>

// //       {/* Tips */}
// //       <div className="card" style={{ marginTop:24, maxWidth:900, background:'#FFFBEA', border:'2px solid #F9A82533' }}>
// //         <h3 style={{ fontWeight:800, marginBottom:12, color:'#F9A825' }}>💡 Resume Tips</h3>
// //         <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
// //           {[
// //             'Include a Skills section with all technical tools',
// //             'List projects with technologies used',
// //             'Add certifications and online courses',
// //             'Mention internships and experience',
// //             'Use keywords matching your target job role',
// //             'Keep it to 1-2 pages with clear sections',
// //           ].map(tip => (
// //             <div key={tip} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:14 }}>
// //               <span style={{ color:'#F9A825', fontWeight:700 }}>→</span>
// //               <span style={{ color:'#555' }}>{tip}</span>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }
