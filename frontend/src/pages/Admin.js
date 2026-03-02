import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const TABS = ['overview', 'users', 'model', 'questions'];

export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [qStats, setQStats] = useState(null);
  const [loading, setLoading] = useState(false);

  // Role guard — admin role comes from JWT, not a hardcoded password
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error('Admin access required');
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    load();
  }, [tab]);

  const load = async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const r = await API.get('/admin/stats');
        setStats(r.data);
      } else if (tab === 'users') {
        const r = await API.get('/admin/users?limit=50');
        setUsers(r.data.users || []);
      } else if (tab === 'model') {
        const r = await API.get('/admin/model-metrics');
        setMetrics(r.data);
      } else if (tab === 'questions') {
        const r = await API.get('/admin/question-stats');
        setQStats(r.data);
      }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ fontFamily: 'Inter,sans-serif' }}>
      <h1 className="page-title">Admin Panel</h1>
      <p className="page-sub">Manage students, questions, and view model performance</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
        {[['overview', '📊 Overview'], ['users', '👥 Students'], ['model', '🤖 Model Metrics'], ['questions', '📝 Questions']].map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '10px 20px', borderRadius: 12, border: '1px solid',
            borderColor: tab === t ? '#FF6B6B' : 'rgba(255,255,255,0.1)',
            background: tab === t ? 'rgba(255,107,107,0.15)' : 'rgba(255,255,255,0.03)',
            color: tab === t ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
          }}>{label}</button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>Loading...</div>
      )}

      {/* ── Overview ── */}
      {!loading && tab === 'overview' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
            {[
              { label: 'Total Students', val: stats.total_students, icon: '👥', color: '#7C5CFC' },
              { label: 'Assessments Taken', val: stats.total_assessments, icon: '📝', color: '#06D6A0' },
              { label: 'Career Predictions', val: stats.total_career_predictions, icon: '🔮', color: '#FF6B6B' },
              { label: 'Resumes Uploaded', val: stats.total_resumes_uploaded, icon: '📄', color: '#FFD93D' },
              { label: 'Questions in DB', val: stats.total_questions, icon: '❓', color: '#A29BFE' },
              { label: 'Avg Placement Ready', val: `${stats.avg_placement_readiness}%`, icon: '🎯', color: '#06D6A0' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 28, fontWeight: 900, color: s.color }}>{s.val}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Top predicted domains */}
          {stats.top_predicted_domains?.length > 0 && (
            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>🏆 Most Predicted Career Domains</h3>
              {stats.top_predicted_domains.map((d, i) => (
                <div key={d.domain} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                  <span style={{ fontSize: 16 }}>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 14, color: '#F0F0FF', fontWeight: 600 }}>{d.domain}</span>
                      <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{d.count} predictions</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                      <div style={{
                        height: '100%', background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)', borderRadius: 4,
                        width: `${Math.min((d.count / (stats.top_predicted_domains[0]?.count || 1)) * 100, 100)}%`
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Questions by type */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>📝 Questions by Type</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {Object.entries(stats.questions_by_type || {}).map(([type, count]) => (
                <div key={type} style={{ textAlign: 'center', padding: 16, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#A29BFE' }}>{count}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{type.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Students ── */}
      {!loading && tab === 'users' && (
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>
            👥 Student List <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>({users.length} shown)</span>
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Name', 'Email', 'College', 'Branch', 'Yr', 'Aptitude', 'Skill', 'Placement Ready', 'Joined'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '10px 12px', color: '#F0F0FF', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)' }}>{u.email}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)' }}>{u.college || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)' }}>{u.branch || '—'}</td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{u.year || '—'}</td>
                    <td style={{ padding: '10px 12px', color: '#A29BFE', fontWeight: 700 }}>{u.aptitude_score?.toFixed(0)}%</td>
                    <td style={{ padding: '10px 12px', color: '#06D6A0', fontWeight: 700 }}>{u.skill_score?.toFixed(0)}%</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                        background: u.placement_readiness >= 70 ? 'rgba(6,214,160,0.15)' : u.placement_readiness >= 50 ? 'rgba(255,211,61,0.15)' : 'rgba(255,107,107,0.15)',
                        color: u.placement_readiness >= 70 ? '#06D6A0' : u.placement_readiness >= 50 ? '#FFD93D' : '#FF6B6B',
                      }}>{u.placement_readiness?.toFixed(0)}%</span>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>{new Date(u.joined).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Model Metrics (IEEE paper Table 1) ── */}
      {!loading && tab === 'model' && metrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: 16, borderRadius: 14, background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              📄 <strong style={{ color: '#A29BFE' }}>Paper reference:</strong> {metrics.paper_reference}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>
              🤖 <strong style={{ color: '#A29BFE' }}>Your algorithm:</strong> {metrics.algorithm_used}
            </div>
          </div>

          {/* Comparison table */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>
              📊 Algorithm Comparison Table <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>(IEEE Paper Table 1)</span>
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['Model', 'Accuracy', 'AUC', 'Precision', 'F1 Score', 'Notes'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {metrics.comparison_table.map(row => (
                    <tr key={row.model} style={{
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                      background: row.is_paper_model ? 'rgba(255,107,107,0.05)' : row.is_your_model ? 'rgba(124,92,252,0.08)' : 'transparent'
                    }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: row.is_paper_model ? '#FF6B6B' : row.is_your_model ? '#A29BFE' : '#F0F0FF' }}>
                        {row.is_paper_model ? '⭐ ' : row.is_your_model ? '🚀 ' : ''}{row.model}
                      </td>
                      <td style={{ padding: '10px 12px', color: row.accuracy ? '#06D6A0' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{row.accuracy ? `${row.accuracy}%` : '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)' }}>{row.auc ?? '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)' }}>{row.precision ?? '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.6)' }}>{row.f1_score ?? '—'}</td>
                      <td style={{ padding: '10px 12px', color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Engine features */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>🔧 CareerEngineV2 Features</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(metrics.engine_features || {}).map(([k, v]) => (
                <div key={k} style={{ padding: '10px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 4 }}>{k.replace(/_/g, ' ').toUpperCase()}</div>
                  <div style={{ fontSize: 13, color: '#A29BFE', fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Questions ── */}
      {!loading && tab === 'questions' && qStats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(qStats).map(([type, data]) => (
            <div key={type} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF' }}>
                  {type === 'aptitude' ? '🧮' : type === 'technical' ? '💻' : '🤝'} {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h3>
                <span style={{ fontSize: 20, fontWeight: 900, color: '#7C5CFC' }}>{data.total} Qs</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {Object.entries(data.topics || {}).map(([topic, count]) => (
                  <div key={topic} style={{ padding: '5px 12px', borderRadius: 12, background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)', fontSize: 12, fontWeight: 600, color: '#A29BFE' }}>
                    {topic} ({count})
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={{ textAlign: 'center', padding: 20 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Upload more questions via the Assessment admin upload endpoint</p>
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// export default function Admin() {
//   const [stats,   setStats]   = useState(null);
//   const [file,    setFile]    = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [manual,  setManual]  = useState({
//     test_type:'aptitude', topic:'', level:'easy',
//     question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:''
//   });

//   useEffect(() => { loadStats(); }, []);

//   const loadStats = () => API.get('/assessment/stats').then(r => setStats(r.data)).catch(()=>{});

//   const uploadCSV = async e => {
//     e.preventDefault();
//     if (!file) { toast.warning('Select a CSV file'); return; }
//     const fd = new FormData(); fd.append('file', file);
//     setLoading(true);
//     try {
//       const res = await API.post('/assessment/upload-questions', fd, { headers:{'Content-Type':'multipart/form-data'} });
//       toast.success(res.data.message); loadStats();
//     } catch { toast.error('Upload failed'); }
//     finally { setLoading(false); }
//   };

//   const addManual = async e => {
//     e.preventDefault(); setLoading(true);
//     try {
//       await API.post('/assessment/add-question', manual);
//       toast.success('Question added!'); loadStats();
//       setManual({ test_type:'aptitude', topic:'', level:'easy', question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:'' });
//     } catch { toast.error('Failed to add'); }
//     finally { setLoading(false); }
//   };

//   const h = e => setManual({...manual, [e.target.name]:e.target.value});

//   const TYPE_COLORS = { aptitude:'#7C5CFC', technical:'#06D6A0', soft_skill:'#FFD93D' };

//   return (
//     <div style={{ fontFamily:'Inter,sans-serif' }}>
//       <h1 className="page-title">Admin Panel</h1>
//       <p className="page-sub">Manage your question bank — upload CSV or add questions manually</p>

//       {/* Stats */}
//       {stats && (
//         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16, marginBottom:28 }}>
//           {Object.entries(stats).map(([type, data]) => {
//             const col = TYPE_COLORS[type] || '#7C5CFC';
//             return (
//               <div key={type} className="card">
//                 <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
//                   <span style={{ fontWeight:800, fontSize:15, color:'rgba(255,255,255,0.8)', textTransform:'capitalize' }}>
//                     {type.replace('_',' ')}
//                   </span>
//                   <span style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:30, fontWeight:900, color:col }}>
//                     {data.total}
//                   </span>
//                 </div>
//                 <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4, marginBottom:14 }}>
//                   <div style={{ height:'100%', borderRadius:4, background:col, width:`${Math.min(data.total/20,1)*100}%` }}/>
//                 </div>
//                 <div style={{ display:'flex', flexDirection:'column', gap:5, maxHeight:160, overflowY:'auto' }}>
//                   {Object.entries(data.topics||{}).map(([t,c]) => (
//                     <div key={t} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
//                       <span style={{ color:'rgba(255,255,255,0.4)' }}>{t}</span>
//                       <span style={{ fontWeight:700, color:col }}>{c}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
//         {/* CSV Upload */}
//         <div className="card">
//           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//             📤 Upload CSV
//           </div>
//           <form onSubmit={uploadCSV} style={{ display:'flex', flexDirection:'column', gap:14 }}>
//             <div onClick={() => document.getElementById('csv-file').click()} style={{
//               border:'2px dashed rgba(124,92,252,0.3)', borderRadius:14,
//               padding:28, textAlign:'center', cursor:'pointer',
//               background:'rgba(124,92,252,0.04)', transition:'all 0.2s'
//             }}
//             onMouseEnter={e=>{ e.currentTarget.style.borderColor='rgba(124,92,252,0.6)'; e.currentTarget.style.background='rgba(124,92,252,0.08)'; }}
//             onMouseLeave={e=>{ e.currentTarget.style.borderColor='rgba(124,92,252,0.3)'; e.currentTarget.style.background='rgba(124,92,252,0.04)'; }}>
//               <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
//               <p style={{ fontWeight:700, color: file ? '#7C5CFC' : 'rgba(255,255,255,0.3)', fontSize:14 }}>
//                 {file ? file.name : 'Click to choose CSV file'}
//               </p>
//               <input id="csv-file" type="file" accept=".csv"
//                 onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
//             </div>
//             <button type="submit" className="btn btn-primary" style={{ justifyContent:'center' }} disabled={loading}>
//               {loading ? '⏳ Uploading...' : '📤 Upload Questions'}
//             </button>
//           </form>
//           <div style={{ marginTop:16, padding:14, background:'rgba(255,217,61,0.06)', borderRadius:10, border:'1px solid rgba(255,217,61,0.15)' }}>
//             <p style={{ fontWeight:700, color:'#FFD93D', marginBottom:8, fontSize:13 }}>📋 CSV Format:</p>
//             <code style={{ fontSize:11, color:'rgba(255,255,255,0.4)', lineHeight:1.9, display:'block' }}>
//               test_type,topic,level,question,opt_a,opt_b,opt_c,opt_d,answer,source<br/>
//               aptitude,Percentages,easy,What is 20% of 150?,25,30,35,20,30,indiabix
//             </code>
//           </div>
//         </div>

//         {/* Manual */}
//         <div className="card">
//           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:18 }}>
//             ✏️ Add Single Question
//           </div>
//           <form onSubmit={addManual} style={{ display:'flex', flexDirection:'column', gap:12 }}>
//             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
//               <div>
//                 <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Test Type</label>
//                 <select name="test_type" value={manual.test_type} onChange={h}>
//                   <option value="aptitude">Aptitude</option>
//                   <option value="technical">Technical</option>
//                   <option value="soft_skill">Soft Skill</option>
//                 </select>
//               </div>
//               <div>
//                 <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Level</label>
//                 <select name="level" value={manual.level} onChange={h}>
//                   <option value="easy">Easy</option>
//                   <option value="medium">Medium</option>
//                   <option value="hard">Hard</option>
//                 </select>
//               </div>
//             </div>
//             <div>
//               <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Topic</label>
//               <input name="topic" value={manual.topic} onChange={h} placeholder="e.g. Percentages, Python" />
//             </div>
//             <div>
//               <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>Question</label>
//               <textarea name="question" value={manual.question} onChange={h}
//                 placeholder="Enter the question..." rows={2} style={{ resize:'vertical' }} />
//             </div>
//             {['option_a','option_b','option_c','option_d'].map((opt, i) => (
//               <div key={opt}>
//                 <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
//                   Option {['A','B','C','D'][i]}
//                 </label>
//                 <input name={opt} value={manual[opt]} onChange={h} placeholder={`Option ${['A','B','C','D'][i]}`} />
//               </div>
//             ))}
//             <div>
//               <label style={{ display:'block', fontSize:12, fontWeight:600, color:'rgba(255,255,255,0.4)', marginBottom:6 }}>
//                 ✅ Correct Answer
//               </label>
//               <input name="answer" value={manual.answer} onChange={h} placeholder="Type exact correct answer" />
//             </div>
//             <button type="submit" className="btn btn-primary" style={{ justifyContent:'center', marginTop:4 }} disabled={loading}>
//               {loading ? '⏳ Adding...' : '➕ Add Question'}
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// }

// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-toastify';
// // import API from '../api';

// // export default function Admin() {
// //   const [stats,    setStats]   = useState(null);
// //   const [file,     setFile]    = useState(null);
// //   const [loading,  setLoading] = useState(false);
// //   const [manual,   setManual]  = useState({
// //     test_type:'aptitude', topic:'', level:'easy',
// //     question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:''
// //   });

// //   useEffect(() => { loadStats(); }, []);

// //   const loadStats = () => {
// //     API.get('/assessment/stats').then(r => setStats(r.data)).catch(() => {});
// //   };

// //   const uploadCSV = async e => {
// //     e.preventDefault();
// //     if (!file) { toast.warning('Select a CSV file'); return; }
// //     const fd = new FormData();
// //     fd.append('file', file);
// //     setLoading(true);
// //     try {
// //       const res = await API.post('/assessment/upload-questions', fd,
// //         { headers: { 'Content-Type': 'multipart/form-data' }});
// //       toast.success(res.data.message);
// //       loadStats();
// //     } catch { toast.error('Upload failed'); }
// //     finally { setLoading(false); }
// //   };

// //   const addManual = async e => {
// //     e.preventDefault();
// //     setLoading(true);
// //     try {
// //       await API.post('/assessment/add-question', manual);
// //       toast.success('Question added!');
// //       loadStats();
// //       setManual({ test_type:'aptitude', topic:'', level:'easy', question:'', option_a:'', option_b:'', option_c:'', option_d:'', answer:'' });
// //     } catch { toast.error('Failed to add'); }
// //     finally { setLoading(false); }
// //   };

// //   const h = e => setManual({...manual, [e.target.name]: e.target.value});

// //   return (
// //     <div>
// //       <h1 className="page-title">⚙️ Question Bank Admin</h1>
// //       <p className="page-sub">Upload questions from CSV or add manually</p>

// //       {/* Stats */}
// //       {stats && (
// //         <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:28 }}>
// //           {Object.entries(stats).map(([type, data]) => (
// //             <div key={type} className="card" style={{ padding:20 }}>
// //               <h3 style={{ fontWeight:800, textTransform:'capitalize', marginBottom:8 }}>
// //                 {type.replace('_',' ')}
// //               </h3>
// //               <div style={{ fontSize:32, fontWeight:900, color:'#6C63FF' }}>{data.total}</div>
// //               <div style={{ fontSize:13, color:'#7A7A9D' }}>questions</div>
// //               <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:4 }}>
// //                 {Object.entries(data.topics || {}).map(([t,c]) => (
// //                   <div key={t} style={{ display:'flex', justifyContent:'space-between', fontSize:12 }}>
// //                     <span style={{ color:'#555' }}>{t}</span>
// //                     <span style={{ fontWeight:700, color:'#6C63FF' }}>{c}</span>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
// //         {/* CSV Upload */}
// //         <div className="card">
// //           <h2 style={{ fontWeight:800, marginBottom:6 }}>📤 Upload CSV</h2>
// //           <p style={{ color:'#7A7A9D', fontSize:13, marginBottom:16 }}>
// //             CSV format: test_type, topic, level, question, option_a, option_b, option_c, option_d, answer, source
// //           </p>
// //           <form onSubmit={uploadCSV} style={{ display:'flex', flexDirection:'column', gap:12 }}>
// //             <div style={{ border:'2px dashed #6C63FF', borderRadius:12, padding:24,
// //               textAlign:'center', background:'#F0EEFF', cursor:'pointer' }}
// //               onClick={() => document.getElementById('csv-file').click()}>
// //               <div style={{ fontSize:32, marginBottom:8 }}>📁</div>
// //               <p style={{ fontWeight:700, color:'#6C63FF' }}>{file ? file.name : 'Click to choose CSV file'}</p>
// //               <input id="csv-file" type="file" accept=".csv"
// //                 onChange={e => setFile(e.target.files[0])} style={{ display:'none' }} />
// //             </div>
// //             <button type="submit" className="btn btn-primary"
// //               style={{ justifyContent:'center' }} disabled={loading}>
// //               {loading ? '⏳ Uploading...' : '📤 Upload Questions'}
// //             </button>
// //           </form>
// //           <div style={{ marginTop:16, padding:14, background:'#FFFBEA',
// //             borderRadius:10, border:'2px solid #F9A82533' }}>
// //             <p style={{ fontWeight:800, color:'#F9A825', marginBottom:6 }}>📋 CSV Template:</p>
// //             <code style={{ fontSize:11, color:'#555', lineHeight:1.8, display:'block' }}>
// //               test_type,topic,level,question,opt_a,opt_b,opt_c,opt_d,answer,source<br/>
// //               aptitude,Percentages,easy,What is 20% of 150?,25,30,35,20,30,indiabix<br/>
// //               technical,Python,medium,Output of 2**10?,20,100,1024,512,1024,manual
// //             </code>
// //           </div>
// //         </div>

// //         {/* Manual Add */}
// //         <div className="card">
// //           <h2 style={{ fontWeight:800, marginBottom:16 }}>✏️ Add Single Question</h2>
// //           <form onSubmit={addManual} style={{ display:'flex', flexDirection:'column', gap:10 }}>
// //             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
// //               <div>
// //                 <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Test Type</label>
// //                 <select name="test_type" value={manual.test_type} onChange={h}>
// //                   <option value="aptitude">Aptitude</option>
// //                   <option value="technical">Technical</option>
// //                   <option value="soft_skill">Soft Skill</option>
// //                 </select>
// //               </div>
// //               <div>
// //                 <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Level</label>
// //                 <select name="level" value={manual.level} onChange={h}>
// //                   <option value="easy">Easy</option>
// //                   <option value="medium">Medium</option>
// //                   <option value="hard">Hard</option>
// //                 </select>
// //               </div>
// //             </div>
// //             <div>
// //               <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Topic</label>
// //               <input name="topic" value={manual.topic} onChange={h} placeholder="e.g. Percentages, Python, Leadership" />
// //             </div>
// //             <div>
// //               <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>Question</label>
// //               <textarea name="question" value={manual.question} onChange={h}
// //                 placeholder="Enter the question..." rows={2}
// //                 style={{ resize:'vertical' }} />
// //             </div>
// //             {['option_a','option_b','option_c','option_d'].map((opt, i) => (
// //               <div key={opt}>
// //                 <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>
// //                   Option {['A','B','C','D'][i]}
// //                 </label>
// //                 <input name={opt} value={manual[opt]} onChange={h} placeholder={`Option ${['A','B','C','D'][i]}`} />
// //               </div>
// //             ))}
// //             <div>
// //               <label style={{ fontWeight:700, fontSize:13, display:'block', marginBottom:4 }}>
// //                 ✅ Correct Answer (must match one option exactly)
// //               </label>
// //               <input name="answer" value={manual.answer} onChange={h}
// //                 placeholder="Type exact correct answer" />
// //             </div>
// //             <button type="submit" className="btn btn-primary"
// //               style={{ justifyContent:'center', marginTop:4 }} disabled={loading}>
// //               {loading ? '⏳ Adding...' : '➕ Add Question'}
// //             </button>
// //           </form>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


