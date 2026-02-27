import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const GRAD = [
  'linear-gradient(135deg,#7C5CFC,#5A3FE0)',
  'linear-gradient(135deg,#06D6A0,#0ABDE3)',
  'linear-gradient(135deg,#FF6B6B,#EE0979)',
];

export default function Career() {
  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/career/history').then(r => { if(r.data?.length) setResult(r.data[0]); }).catch(()=>{});
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

  return (
    <div style={{ fontFamily:'Inter,sans-serif' }}>
      <h1 className="page-title">Career Prediction</h1>
      <p className="page-sub">AI-powered recommendations based on your skills, aptitude & interests</p>

      <button className="btn btn-primary" onClick={predict} disabled={loading}
        style={{ marginBottom:32, fontSize:15, padding:'13px 28px' }}>
        {loading ? '⏳ Predicting...' : '🔮 Get AI Recommendations'}
      </button>

      {!result && !loading && (
        <div style={{
          maxWidth:480, borderRadius:24, padding:48, textAlign:'center',
          background:'rgba(124,92,252,0.06)', border:'1px solid rgba(124,92,252,0.15)'
        }}>
          <div style={{ fontSize:64, marginBottom:20 }}>🔮</div>
          <h3 style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:20, color:'#F0F0FF', marginBottom:12 }}>Ready for your prediction?</h3>
          <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, lineHeight:1.7 }}>
            Complete your profile, take assessments, and upload your resume for the most accurate results.
          </p>
        </div>
      )}

      {result && (
        <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:800 }}>

          {/* Top careers */}
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>
            🏆 Top Career Matches
          </div>
          {(result.top_careers||[]).map((c,i) => (
            <div key={c.domain} style={{
              borderRadius:20, padding:'20px 24px',
              background: GRAD[i] + '22',
              border:`1px solid rgba(255,255,255,0.08)`,
              display:'flex', alignItems:'center', gap:20
            }}>
              <div style={{
                width:52, height:52, borderRadius:14, flexShrink:0,
                background:GRAD[i], display:'flex', alignItems:'center',
                justifyContent:'center', fontFamily:'Space Grotesk,sans-serif',
                fontWeight:900, fontSize:20, color:'#fff',
                boxShadow:`0 8px 20px rgba(0,0,0,0.3)`
              }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800, fontSize:18, color:'#F0F0FF', marginBottom:10 }}>{c.domain}</div>
                <div style={{ height:8, background:'rgba(255,255,255,0.06)', borderRadius:8 }}>
                  <div style={{ height:'100%', borderRadius:8, background:GRAD[i], width:`${c.suitability_percentage}%`, transition:'width 1s' }}/>
                </div>
              </div>
              <div style={{ fontWeight:900, fontSize:26, color:'#F0F0FF', flexShrink:0 }}>
                {c.suitability_percentage?.toFixed(1)}%
              </div>
            </div>
          ))}

          {/* Score grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[
              { label:'Skill Match',    val:result.skill_match_score,    icon:'💡', color:'#7C5CFC' },
              { label:'Aptitude Score', val:result.aptitude_score,       icon:'🧠', color:'#FF6B6B' },
              { label:'Interest Match', val:result.interest_match_score, icon:'❤️', color:'#06D6A0' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign:'center', padding:24 }}>
                <div style={{ fontSize:32, marginBottom:10 }}>{s.icon}</div>
                <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:30, fontWeight:900, color:s.color }}>
                  {(s.val||0).toFixed(1)}%
                </div>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.4)', fontWeight:600, marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Confidence */}
          <div style={{
            borderRadius:20, padding:28, textAlign:'center',
            background:'linear-gradient(135deg,rgba(124,92,252,0.15),rgba(6,214,160,0.08))',
            border:'1px solid rgba(124,92,252,0.2)'
          }}>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:13, fontWeight:600, marginBottom:8 }}>AI Confidence Score</p>
            <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:52, fontWeight:900, background:'linear-gradient(135deg,#7C5CFC,#06D6A0)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
              {result.confidence_score?.toFixed(1)}%
            </div>
            <p style={{ color:'rgba(255,255,255,0.4)', fontSize:14, marginTop:10 }}>
              Based on your skill match, aptitude, and interest alignment
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

// export default function Career() {
//   const [result, setResult]   = useState(null);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     API.get('/career/history').then(r => { if (r.data?.length) setResult(r.data[0]); }).catch(() => {});
//   }, []);

//   const predict = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get('/career/recommend');
//       setResult(res.data);
//       toast.success('Career prediction complete! 🎯');
//     } catch { toast.error('Prediction failed. Complete your profile & assessments first.'); }
//     finally { setLoading(false); }
//   };

//   const COLORS = ['#6C63FF','#FF6584','#43E97B'];

//   return (
//     <div>
//       <h1 className="page-title">🎯 Career Prediction</h1>
//       <p className="page-sub">AI-powered career recommendations based on your skills, aptitude & interests</p>

//       <button className="btn btn-primary" onClick={predict} disabled={loading} style={{ marginBottom:28, fontSize:16, padding:'13px 28px' }}>
//         {loading ? '⏳ Predicting...' : '🔮 Get Career Recommendations'}
//       </button>

//       {result && (
//         <div style={{ display:'flex', flexDirection:'column', gap:24, maxWidth:800 }}>
//           {/* Top Careers */}
//           <div>
//             <h2 style={{ fontWeight:800, marginBottom:16 }}>🏆 Top Career Matches</h2>
//             <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
//               {(result.top_careers || []).map((c, i) => (
//                 <div key={c.domain} className="card" style={{ display:'flex', alignItems:'center', gap:20, padding:'20px 24px' }}>
//                   <div style={{
//                     width:48, height:48, borderRadius:14, background:COLORS[i]+'22',
//                     display:'flex', alignItems:'center', justifyContent:'center',
//                     fontSize:24, fontWeight:900, color:COLORS[i]
//                   }}>#{i+1}</div>
//                   <div style={{ flex:1 }}>
//                     <div style={{ fontWeight:800, fontSize:17 }}>{c.domain}</div>
//                     <div className="progress-bar-wrap" style={{ marginTop:8 }}>
//                       <div className="progress-bar-fill" style={{ width:`${c.suitability_percentage}%`, background:COLORS[i] }} />
//                     </div>
//                   </div>
//                   <div style={{ fontWeight:900, fontSize:22, color:COLORS[i] }}>
//                     {c.suitability_percentage?.toFixed(1)}%
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Score breakdown */}
//           <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
//             {[
//               { label:'Skill Match',    val:result.skill_match_score,     icon:'💡', color:'#6C63FF' },
//               { label:'Aptitude Score', val:result.aptitude_score,        icon:'🧠', color:'#FF6584' },
//               { label:'Interest Match', val:result.interest_match_score,  icon:'❤️', color:'#43E97B' },
//             ].map(s => (
//               <div key={s.label} className="card" style={{ textAlign:'center', padding:20 }}>
//                 <div style={{ fontSize:30, marginBottom:6 }}>{s.icon}</div>
//                 <div style={{ fontSize:28, fontWeight:900, color:s.color }}>{s.val?.toFixed(1) || 0}%</div>
//                 <div style={{ fontSize:13, color:'#7A7A9D', fontWeight:600 }}>{s.label}</div>
//               </div>
//             ))}
//           </div>

//           {/* Confidence */}
//           <div className="card" style={{ background:'#F0EEFF', border:'2px solid #6C63FF33', textAlign:'center', padding:24 }}>
//             <p style={{ color:'#7A7A9D', fontWeight:600, marginBottom:4 }}>AI Confidence Score</p>
//             <div style={{ fontSize:42, fontWeight:900, color:'#6C63FF' }}>{result.confidence_score?.toFixed(1)}%</div>
//             <p style={{ color:'#555', fontSize:14, marginTop:8 }}>
//               Based on your combined skill match, aptitude performance, and interest alignment
//             </p>
//           </div>
//         </div>
//       )}

//       {!result && !loading && (
//         <div className="card" style={{ maxWidth:500, textAlign:'center', padding:40 }}>
//           <div style={{ fontSize:60, marginBottom:16 }}>🔮</div>
//           <h3 style={{ fontWeight:800, marginBottom:8 }}>Ready for your prediction?</h3>
//           <p style={{ color:'#7A7A9D', fontSize:14 }}>
//             Complete your profile, take assessments, and upload your resume for the most accurate results.
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
