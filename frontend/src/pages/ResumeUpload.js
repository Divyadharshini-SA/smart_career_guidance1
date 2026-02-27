import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

export default function ResumeUpload() {
  const [file, setFile]       = useState(null);
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag]       = useState(false);

  useEffect(() => { API.get('/resume/latest').then(r => setResult(r.data)).catch(()=>{}); }, []);

  const upload = async e => {
    e.preventDefault();
    if (!file) { toast.warning('Please select a file'); return; }
    const fd = new FormData();
    fd.append('file', file);
    setLoading(true);
    try {
      const res = await API.post('/resume/upload', fd, { headers:{'Content-Type':'multipart/form-data'} });
      setResult(res.data);
      toast.success('Resume analyzed! 🎉');
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  const score = result?.resume_score || 0;
  const scoreColor = score>=70 ? '#06D6A0' : score>=50 ? '#FFD93D' : '#FF6B6B';
  const scoreLabel = score>=70 ? 'Strong Resume ✅' : score>=50 ? 'Good Resume 👍' : 'Needs Work ⚠️';

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      <h1 className="page-title">Resume Analyzer</h1>
      <p className="page-sub">Upload your resume for AI-powered skill extraction and ATS scoring</p>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(340px,1fr))', gap:20, maxWidth:900 }}>

        {/* Upload */}
        <div className="card">
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
            📤 Upload Resume
          </div>
          <form onSubmit={upload} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div
              onDragOver={e=>{ e.preventDefault(); setDrag(true); }}
              onDragLeave={()=>setDrag(false)}
              onDrop={e=>{ e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById('rf').click()}
              style={{
                border:`2px dashed ${drag ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
                borderRadius:16, padding:'40px 20px', textAlign:'center',
                background: drag ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.02)',
                cursor:'pointer', transition:'all 0.2s'
              }}>
              <div style={{ fontSize:40, marginBottom:12 }}>
                {file ? '📄' : '📁'}
              </div>
              <p style={{ fontWeight:700, color: file ? '#7C5CFC' : 'rgba(255,255,255,0.4)', fontSize:14, marginBottom:6 }}>
                {file ? file.name : 'Drop file here or click to browse'}
              </p>
              <p style={{ color:'rgba(255,255,255,0.2)', fontSize:12 }}>PDF or DOCX • Max 16MB</p>
              <input id="rf" type="file" accept=".pdf,.doc,.docx"
                onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
              {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
            </button>
          </form>

          {/* Tips */}
          <div style={{ marginTop:20, padding:16, borderRadius:12, background:'rgba(255,217,61,0.06)', border:'1px solid rgba(255,217,61,0.15)' }}>
            <p style={{ fontWeight:700, color:'#FFD93D', fontSize:13, marginBottom:10 }}>💡 Tips to score higher</p>
            {['Include all technical skills clearly','Add projects with tech stack used','Add certifications and courses','Use job-role specific keywords'].map(t => (
              <div key={t} style={{ display:'flex', gap:8, fontSize:13, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
                <span style={{ color:'#FFD93D' }}>→</span>{t}
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="card">
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
              📊 Analysis Results
            </div>

            {/* Score circle */}
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <div style={{ position:'relative', width:120, height:120, margin:'0 auto 16px' }}>
                <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke={scoreColor} strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*50}`}
                    strokeDashoffset={`${2*Math.PI*50*(1-score/100)}`}
                    style={{ transition:'stroke-dashoffset 1s', filter:`drop-shadow(0 0 8px ${scoreColor})` }}/>
                </svg>
                <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
                  <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:24, fontWeight:900, color:scoreColor }}>{score.toFixed(0)}%</div>
                </div>
              </div>
              <div style={{ fontWeight:800, fontSize:15, color:scoreColor }}>{scoreLabel}</div>
            </div>

            {/* Skills */}
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', marginBottom:12 }}>
              Detected Skills ({result.extracted_skills?.length || 0})
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {(result.extracted_skills||[]).map(s => (
                <span key={s} style={{
                  padding:'5px 12px', borderRadius:20,
                  background:'rgba(124,92,252,0.12)',
                  border:'1px solid rgba(124,92,252,0.25)',
                  color:'#A29BFE', fontSize:12, fontWeight:700
                }}>{s}</span>
              ))}
              {(!result.extracted_skills || result.extracted_skills.length===0) && (
                <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>No skills detected. Try a richer resume.</p>
              )}
            </div>
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
//   const [file, setFile]     = useState(null);
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     API.get('/resume/latest').then(r => setResult(r.data)).catch(() => {});
//   }, []);

//   const upload = async e => {
//     e.preventDefault();
//     if (!file) { toast.warning('Please select a file'); return; }
//     const fd = new FormData();
//     fd.append('file', file);
//     setLoading(true);
//     try {
//       const res = await API.post('/resume/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
//       setResult(res.data);
//       toast.success('Resume analyzed! 🎉');
//     } catch { toast.error('Upload failed'); }
//     finally { setLoading(false); }
//   };

//   const scoreColor = s => s >= 70 ? '#43E97B' : s >= 50 ? '#F9A825' : '#FF6584';

//   return (
//     <div>
//       <h1 className="page-title">📄 Resume Analyzer</h1>
//       <p className="page-sub">Upload your resume for AI-powered skill extraction and scoring</p>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24, maxWidth:900 }}>
//         {/* Upload card */}
//         <div className="card">
//           <h2 style={{ fontWeight:800, marginBottom:20 }}>📤 Upload Resume</h2>
//           <form onSubmit={upload} style={{ display:'flex', flexDirection:'column', gap:16 }}>
//             <div style={{
//               border:'2px dashed #6C63FF', borderRadius:14, padding:32, textAlign:'center',
//               background:'#F0EEFF', cursor:'pointer'
//             }} onClick={() => document.getElementById('rf').click()}>
//               <div style={{ fontSize:40, marginBottom:10 }}>📁</div>
//               <p style={{ fontWeight:700, color:'#6C63FF' }}>
//                 {file ? file.name : 'Click to choose PDF or DOCX'}
//               </p>
//               <p style={{ color:'#7A7A9D', fontSize:13, marginTop:4 }}>Max 16MB</p>
//               <input id="rf" type="file" accept=".pdf,.doc,.docx"
//                 onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
//             </div>
//             <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
//               {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
//             </button>
//           </form>
//         </div>

//         {/* Results card */}
//         {result && (
//           <div className="card">
//             <h2 style={{ fontWeight:800, marginBottom:20 }}>📊 Analysis Results</h2>
//             <div style={{ textAlign:'center', marginBottom:24 }}>
//               <div style={{ fontSize:52, fontWeight:900, color:scoreColor(result.resume_score) }}>
//                 {result.resume_score?.toFixed(1)}%
//               </div>
//               <p style={{ color:'#7A7A9D', fontWeight:600 }}>Resume Score</p>
//               <div className="progress-bar-wrap" style={{ marginTop:12 }}>
//                 <div className="progress-bar-fill" style={{ width:`${result.resume_score}%`, background:scoreColor(result.resume_score) }} />
//               </div>
//             </div>
//             <h3 style={{ fontWeight:800, marginBottom:12 }}>✅ Detected Skills ({result.extracted_skills?.length || 0})</h3>
//             <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//               {(result.extracted_skills || []).map(s => (
//                 <span key={s} className="badge" style={{ background:'#F0EEFF', color:'#6C63FF', fontSize:13 }}>
//                   {s}
//                 </span>
//               ))}
//               {(!result.extracted_skills || result.extracted_skills.length === 0) && (
//                 <p style={{ color:'#7A7A9D', fontSize:14 }}>No skills detected. Try uploading a richer resume.</p>
//               )}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Tips */}
//       <div className="card" style={{ marginTop:24, maxWidth:900, background:'#FFFBEA', border:'2px solid #F9A82533' }}>
//         <h3 style={{ fontWeight:800, marginBottom:12, color:'#F9A825' }}>💡 Resume Tips</h3>
//         <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
//           {[
//             'Include a Skills section with all technical tools',
//             'List projects with technologies used',
//             'Add certifications and online courses',
//             'Mention internships and experience',
//             'Use keywords matching your target job role',
//             'Keep it to 1-2 pages with clear sections',
//           ].map(tip => (
//             <div key={tip} style={{ display:'flex', gap:8, alignItems:'flex-start', fontSize:14 }}>
//               <span style={{ color:'#F9A825', fontWeight:700 }}>→</span>
//               <span style={{ color:'#555' }}>{tip}</span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }
