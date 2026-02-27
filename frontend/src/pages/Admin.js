import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

export default function Admin() {
  const [stats,   setStats]   = useState(null);
  const [file,    setFile]    = useState(null);
  const [loading, setLoading] = useState(false);
  const [manual,  setManual]  = useState({
    test_type:'aptitude', topic:'', level:'easy',
    question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:''
  });

  useEffect(() => { loadStats(); }, []);

  const loadStats = () => API.get('/assessment/stats').then(r => setStats(r.data)).catch(()=>{});

  const uploadCSV = async e => {
    e.preventDefault();
    if (!file) { toast.warning('Select a CSV file'); return; }
    const fd = new FormData(); fd.append('file', file);
    setLoading(true);
    try {
      const res = await API.post('/assessment/upload-questions', fd, { headers:{'Content-Type':'multipart/form-data'} });
      toast.success(res.data.message); loadStats();
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  const addManual = async e => {
    e.preventDefault(); setLoading(true);
    try {
      await API.post('/assessment/add-question', manual);
      toast.success('Question added!'); loadStats();
      setManual({ test_type:'aptitude', topic:'', level:'easy', question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:'' });
    } catch { toast.error('Failed to add'); }
    finally { setLoading(false); }
  };

  const h = e => setManual({...manual, [e.target.name]:e.target.value});

  const TYPE_COLORS = { aptitude:'#7C5CFC', technical:'#06D6A0', soft_skill:'#FFD93D' };

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-sub">Manage your question bank — upload CSV or add questions manually</p>

      {/* Stats */}
      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16, marginBottom:28 }}>
          {Object.entries(stats).map(([type, data]) => {
            const col = TYPE_COLORS[type] || '#7C5CFC';
            return (
              <div key={type} className="card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                  <span style={{ fontWeight:800, fontSize:15, color:'rgba(255,255,255,0.8)', textTransform:'capitalize' }}>
                    {type.replace('_',' ')}
                  </span>
                  <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:30, fontWeight:900, color:col }}>
                    {data.total}
                  </span>
                </div>
                <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:14 }}>
                  <div style={{ height:'100%', borderRadius:4, background:col, width:`${Math.min(data.total/20,1)*100}%` }}/>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:160, overflowY:'auto' }}>
                  {Object.entries(data.topics||{}).map(([t,c]) => (
                    <div key={t} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
                      <span style={{ color:'rgba(255,255,255,0.4)' }}>{t}</span>
                      <span style={{ fontWeight:700, color:col }}>{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* CSV Upload */}
        <div className="card">
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
            📤 Upload CSV
          </div>
          <form onSubmit={uploadCSV} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div onClick={() => document.getElementById('csv-file').click()} style={{
              border:'2px dashed rgba(124,92,252,0.3)', borderRadius:14,
              padding:28, textAlign:'center', cursor:'pointer',
              background:'rgba(124,92,252,0.04)', transition:'all 0.2s'
            }}
            onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(124,92,252,0.6)'; e.currentTarget.style.background='rgba(124,92,252,0.08)'; }}
            onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(124,92,252,0.3)'; e.currentTarget.style.background='rgba(124,92,252,0.04)'; }}>
              <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
              <p style={{ fontWeight:700, color: file ? '#7C5CFC' : 'rgba(255,255,255,0.3)', fontSize:14 }}>
                {file ? file.name : 'Click to choose CSV file'}
              </p>
              <input id="csv-file" type="file" accept=".csv"
                onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
              {loading ? '⏳ Uploading...' : '📤 Upload Questions'}
            </button>
          </form>
          <div style={{ marginTop:16, padding:14, background:'rgba(255,217,61,0.06)', borderRadius:10, border:'1px solid rgba(255,217,61,0.15)' }}>
            <p style={{ fontWeight:700, color:'#FFD93D', marginBottom:8, fontSize:13 }}>📋 CSV Format:</p>
            <code style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.9, display:'block' }}>
              test_type,topic,level,question,opt_a,opt_b,opt_c,opt_d,answer,source<br/>
              aptitude,Percentages,easy,What is 20% of 150?,25,30,35,20,30,indiabix
            </code>
          </div>
        </div>

        {/* Manual */}
        <div className="card">
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
            ✏️ Add Single Question
          </div>
          <form onSubmit={addManual} style={{ display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Test Type</label>
                <select name="test_type" value={manual.test_type} onChange={h}>
                  <option value="aptitude">Aptitude</option>
                  <option value="technical">Technical</option>
                  <option value="soft_skill">Soft Skill</option>
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Level</label>
                <select name="level" value={manual.level} onChange={h}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Topic</label>
              <input name="topic" value={manual.topic} onChange={h} placeholder="e.g. Percentages, Python" />
            </div>
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Question</label>
              <textarea name="question" value={manual.question} onChange={h}
                placeholder="Enter the question..." rows={2} style={{ resize:'vertical' }} />
            </div>
            {['option_a','option_b','option_c','option_d'].map((opt, i) => (
              <div key={opt}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
                  Option {['A','B','C','D'][i]}
                </label>
                <input name={opt} value={manual[opt]} onChange={h} placeholder={`Option ${['A','B','C','D'][i]}`} />
              </div>
            ))}
            <div>
              <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
                ✅ Correct Answer
              </label>
              <input name="answer" value={manual.answer} onChange={h} placeholder="Type exact correct answer" />
            </div>
            <button type="submit" className="btn btn-primary" style={{ justifyContent:'center', marginTop:4 }} disabled={loading}>
              {loading ? '⏳ Adding...' : '➕ Add Question'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// export default function Admin() {
//   const [stats,    setStats]   = useState(null);
//   const [file,     setFile]    = useState(null);
//   const [loading,  setLoading] = useState(false);
//   const [manual,   setManual]  = useState({
//     test_type:'aptitude', topic:'', level:'easy',
//     question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:''
//   });

//   useEffect(() => { loadStats(); }, []);

//   const loadStats = () => {
//     API.get('/assessment/stats').then(r => setStats(r.data)).catch(() => {});
//   };

//   const uploadCSV = async e => {
//     e.preventDefault();
//     if (!file) { toast.warning('Select a CSV file'); return; }
//     const fd = new FormData();
//     fd.append('file', file);
//     setLoading(true);
//     try {
//       const res = await API.post('/assessment/upload-questions', fd,
//         { headers: { 'Content-Type': 'multipart/form-data' }});
//       toast.success(res.data.message);
//       loadStats();
//     } catch { toast.error('Upload failed'); }
//     finally { setLoading(false); }
//   };

//   const addManual = async e => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await API.post('/assessment/add-question', manual);
//       toast.success('Question added!');
//       loadStats();
//       setManual({ test_type:'aptitude', topic:'', level:'easy', question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:'' });
//     } catch { toast.error('Failed to add'); }
//     finally { setLoading(false); }
//   };

//   const h = e => setManual({...manual, [e.target.name]: e.target.value});

//   return (
//     <div>
//       <h1 className="page-title">⚙️ Question Bank Admin</h1>
//       <p className="page-sub">Upload questions from CSV or add manually</p>

//       {/* Stats */}
//       {stats && (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
//           {Object.entries(stats).map(([type, data]) => (
//             <div key={type} className="card" style={{ padding:20 }}>
//               <h3 style={{ fontWeight:800, textTransform:'capitalize', marginBottom:8 }}>
//                 {type.replace('_',' ')}
//               </h3>
//               <div style={{ fontSize:32, fontWeight:900, color:'#6C63FF' }}>{data.total}</div>
//               <div style={{ fontSize:13, color:'#7A7A9D' }}>questions</div>
//               <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:4 }}>
//                 {Object.entries(data.topics || {}).map(([t,c]) => (
//                   <div key={t} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
//                     <span style={{ color:'#555' }}>{t}</span>
//                     <span style={{ fontWeight:700, color:'#6C63FF' }}>{c}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
//         {/* CSV Upload */}
//         <div className="card">
//           <h2 style={{ fontWeight:800, marginBottom:6 }}>📤 Upload CSV</h2>
//           <p style={{ color:'#7A7A9D', fontSize:13, marginBottom:16 }}>
//             CSV format: test_type, topic, level, question, option_a, option_b, option_c, option_d, answer, source
//           </p>
//           <form onSubmit={uploadCSV} style={{ display:'flex', flexDirection:'column', gap:12 }}>
//             <div style={{ border:'2px dashed #6C63FF', borderRadius:12, padding:24,
//               textAlign:'center', background:'#F0EEFF', cursor:'pointer' }}
//               onClick={() => document.getElementById('csv-file').click()}>
//               <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
//               <p style={{ fontWeight:700, color:'#6C63FF' }}>{file ? file.name : 'Click to choose CSV file'}</p>
//               <input id="csv-file" type="file" accept=".csv"
//                 onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
//             </div>
//             <button type="submit" className="btn btn-primary"
//               style={{ justifyContent:'center' }} disabled={loading}>
//               {loading ? '⏳ Uploading...' : '📤 Upload Questions'}
//             </button>
//           </form>
//           <div style={{ marginTop:16, padding:14, background:'#FFFBEA',
//             borderRadius:10, border:'2px solid #F9A82533' }}>
//             <p style={{ fontWeight:800, color:'#F9A825', marginBottom:6 }}>📋 CSV Template:</p>
//             <code style={{ fontSize:11, color:'#555', lineHeight:1.8, display:'block' }}>
//               test_type,topic,level,question,opt_a,opt_b,opt_c,opt_d,answer,source<br/>
//               aptitude,Percentages,easy,What is 20% of 150?,25,30,35,20,30,indiabix<br/>
//               technical,Python,medium,Output of 2**10?,20,100,1024,512,1024,manual
//             </code>
//           </div>
//         </div>

//         {/* Manual Add */}
//         <div className="card">
//           <h2 style={{ fontWeight:800, marginBottom:16 }}>✏️ Add Single Question</h2>
//           <form onSubmit={addManual} style={{ display:'flex', flexDirection:'column', gap:10 }}>
//             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
//               <div>
//                 <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Test Type</label>
//                 <select name="test_type" value={manual.test_type} onChange={h}>
//                   <option value="aptitude">Aptitude</option>
//                   <option value="technical">Technical</option>
//                   <option value="soft_skill">Soft Skill</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Level</label>
//                 <select name="level" value={manual.level} onChange={h}>
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//               </div>
//             </div>
//             <div>
//               <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Topic</label>
//               <input name="topic" value={manual.topic} onChange={h} placeholder="e.g. Percentages, Python, Leadership" />
//             </div>
//             <div>
//               <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Question</label>
//               <textarea name="question" value={manual.question} onChange={h}
//                 placeholder="Enter the question..." rows={2}
//                 style={{ resize:'vertical' }} />
//             </div>
//             {['option_a','option_b','option_c','option_d'].map((opt, i) => (
//               <div key={opt}>
//                 <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>
//                   Option {['A','B','C','D'][i]}
//                 </label>
//                 <input name={opt} value={manual[opt]} onChange={h} placeholder={`Option ${['A','B','C','D'][i]}`} />
//               </div>
//             ))}
//             <div>
//               <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>
//                 ✅ Correct Answer (must match one option exactly)
//               </label>
//               <input name="answer" value={manual.answer} onChange={h}
//                 placeholder="Type exact correct answer" />
//             </div>
//             <button type="submit" className="btn btn-primary"
//               style={{ justifyContent:'center', marginTop:4 }} disabled={loading}>
//               {loading ? '⏳ Adding...' : '➕ Add Question'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }


