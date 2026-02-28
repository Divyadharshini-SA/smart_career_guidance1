import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

// ── Domain required skills (mirrors backend DOMAIN_SKILLS) ────
const DOMAIN_SKILLS = {
  'Software Engineer'    : ['Python','Java','C++','Data Structures','Algorithms','Git','SQL','REST API','OOP','Linux'],
  'Data Scientist'       : ['Python','Statistics','Machine Learning','Pandas','NumPy','SQL','Data Visualization','Scikit-learn','Jupyter'],
  'Web Developer'        : ['HTML','CSS','JavaScript','React','Node.js','Git','REST API','MongoDB','Responsive Design'],
  'AI/ML Engineer'       : ['Python','Machine Learning','Deep Learning','TensorFlow','PyTorch','NLP','Computer Vision','MLOps','Docker'],
  'Cloud Engineer'       : ['AWS','Azure','GCP','Docker','Kubernetes','Linux','Networking','Terraform','CI/CD','Bash'],
  'Cybersecurity Analyst': ['Networking','Linux','Python','Security','Ethical Hacking','Cryptography','SIEM','Firewalls'],
  'Data Engineer'        : ['Python','SQL','Spark','Hadoop','Kafka','Airflow','ETL','Data Pipelines','AWS','Scala'],
};

// Learning resources for each skill
const SKILL_RESOURCES = {
  'Python'           : { yt:'https://www.youtube.com/watch?v=_uQrJ0TkZlc', doc:'https://docs.python.org/3/', free:'https://www.learnpython.org/' },
  'Java'             : { yt:'https://www.youtube.com/watch?v=eIrMbAQSU34', doc:'https://dev.java/learn/', free:'https://www.javatpoint.com/' },
  'C++'              : { yt:'https://www.youtube.com/watch?v=vLnPwxZdW4Y', doc:'https://cppreference.com/', free:'https://www.learncpp.com/' },
  'Data Structures'  : { yt:'https://www.youtube.com/watch?v=RBSGKlAvoiM', doc:'https://www.geeksforgeeks.org/data-structures/', free:'https://www.geeksforgeeks.org/data-structures/' },
  'Algorithms'       : { yt:'https://www.youtube.com/watch?v=kgBjXUE_Nwc', doc:'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', free:'https://www.geeksforgeeks.org/fundamentals-of-algorithms/' },
  'Git'              : { yt:'https://www.youtube.com/watch?v=RGOj5yH7evk', doc:'https://git-scm.com/doc', free:'https://learngitbranching.js.org/' },
  'SQL'              : { yt:'https://www.youtube.com/watch?v=HXV3zeQKqGY', doc:'https://www.w3schools.com/sql/', free:'https://sqlzoo.net/' },
  'Machine Learning' : { yt:'https://www.youtube.com/watch?v=NWONeJKn6kc', doc:'https://scikit-learn.org/stable/', free:'https://www.coursera.org/learn/machine-learning' },
  'React'            : { yt:'https://www.youtube.com/watch?v=bMknfKXIFA8', doc:'https://react.dev/', free:'https://react.dev/learn' },
  'Node.js'          : { yt:'https://www.youtube.com/watch?v=ENrzD9HAZK4', doc:'https://nodejs.org/en/docs/', free:'https://www.w3schools.com/nodejs/' },
  'Docker'           : { yt:'https://www.youtube.com/watch?v=fqMOX6JJhGo', doc:'https://docs.docker.com/', free:'https://docs.docker.com/get-started/' },
  'AWS'              : { yt:'https://www.youtube.com/watch?v=3hLmDS179YE', doc:'https://docs.aws.amazon.com/', free:'https://aws.amazon.com/free/' },
  'JavaScript'       : { yt:'https://www.youtube.com/watch?v=jS4aFq5-91M', doc:'https://developer.mozilla.org/en-US/docs/Web/JavaScript', free:'https://javascript.info/' },
  'HTML'             : { yt:'https://www.youtube.com/watch?v=pQN-pnXPaVg', doc:'https://developer.mozilla.org/en-US/docs/Web/HTML', free:'https://www.w3schools.com/html/' },
  'CSS'              : { yt:'https://www.youtube.com/watch?v=1Rs2ND1ryYc', doc:'https://developer.mozilla.org/en-US/docs/Web/CSS', free:'https://www.w3schools.com/css/' },
  'Networking'       : { yt:'https://www.youtube.com/watch?v=IPvYjXCsTg8', doc:'https://www.geeksforgeeks.org/computer-network-tutorials/', free:'https://www.geeksforgeeks.org/computer-network-tutorials/' },
  'Linux'            : { yt:'https://www.youtube.com/watch?v=ZtqBQ68cfJc', doc:'https://linux.die.net/', free:'https://linuxjourney.com/' },
  'Kubernetes'       : { yt:'https://www.youtube.com/watch?v=X48VuDVv0do', doc:'https://kubernetes.io/docs/', free:'https://kubernetes.io/docs/tutorials/' },
  'TensorFlow'       : { yt:'https://www.youtube.com/watch?v=tPYj3fFJGjk', doc:'https://www.tensorflow.org/learn', free:'https://www.tensorflow.org/tutorials' },
  'Statistics'       : { yt:'https://www.youtube.com/watch?v=xxpc-HPKN28', doc:'https://www.khanacademy.org/math/statistics-probability', free:'https://www.khanacademy.org/math/statistics-probability' },
};

const DEFAULT_RESOURCE = {
  yt   : 'https://www.youtube.com/results?search_query=',
  doc  : 'https://www.geeksforgeeks.org/search/?q=',
  free : 'https://www.geeksforgeeks.org/search/?q=',
};

const getResource = (skill) => SKILL_RESOURCES[skill] || {
  yt   : `${DEFAULT_RESOURCE.yt}${encodeURIComponent(skill + ' tutorial')}`,
  doc  : `${DEFAULT_RESOURCE.doc}${encodeURIComponent(skill)}`,
  free : `${DEFAULT_RESOURCE.free}${encodeURIComponent(skill)}`,
};

function LinkBtn({ href, icon, label, color }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'4px 12px', borderRadius:8, textDecoration:'none',
      background:`${color}15`, border:`1px solid ${color}33`,
      color, fontSize:12, fontWeight:700, transition:'all 0.15s', whiteSpace:'nowrap'
    }}
    onMouseEnter={e=>{ e.currentTarget.style.background=color; e.currentTarget.style.color='#fff'; }}
    onMouseLeave={e=>{ e.currentTarget.style.background=`${color}15`; e.currentTarget.style.color=color; }}>
      {icon} {label}
    </a>
  );
}

export default function SkillGap() {
  const [domain,   setDomain]   = useState('Software Engineer');
  const [result,   setResult]   = useState(null);
  const [profile,  setProfile]  = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  useEffect(() => {
    API.get('/profile/').then(r => setProfile(r.data)).catch(()=>{});
  }, []);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await API.post('/roadmap/generate', { career_domain: domain });
      setResult(res.data?.skill_gap || null);
      setAnalyzed(true);
      if (!res.data?.skill_gap) toast.info('Complete your profile & upload resume for better results');
      else toast.success('Skill gap analyzed! 📊');
    } catch { toast.error('Analysis failed — make sure your profile is complete'); }
    finally { setLoading(false); }
  };

  const required = DOMAIN_SKILLS[domain] || [];
  const userSkills = Object.keys(profile?.skills || {});

  // Local analysis (instant, from profile)
  const localHave    = required.filter(r => userSkills.some(s => s.toLowerCase() === r.toLowerCase()));
  const localMissing = required.filter(r => !userSkills.some(s => s.toLowerCase() === r.toLowerCase()));
  const localMatch   = required.length ? Math.round((localHave.length / required.length) * 100) : 0;

  // Server result (includes resume skills too)
  const serverHave    = result?.current_skills  || [];
  const serverMissing = result?.missing_skills  || [];
  const serverMatch   = result?.match_percentage || 0;
  const serverGap     = result?.gap_percentage   || 0;

  const have    = analyzed && result ? serverHave    : localHave;
  const missing = analyzed && result ? serverMissing : localMissing;
  const matchPct= analyzed && result ? serverMatch   : localMatch;
  const gapPct  = 100 - matchPct;

  const matchColor = matchPct >= 70 ? '#06D6A0' : matchPct >= 50 ? '#FFD93D' : '#FF6B6B';
  const matchLabel = matchPct >= 70 ? 'Strong Match! 🎉' : matchPct >= 50 ? 'Decent Match 👍' : 'Large Gap ⚠️';

  return (
    <div style={{ maxWidth:900, fontFamily:'Inter,sans-serif' }}>
      <h1 className="page-title">Skill Gap Analyzer</h1>
      <p className="page-sub">Find exactly what skills you're missing for your target career</p>

      {/* ── Domain Selector ── */}
      <div style={{
        display:'flex', gap:14, marginBottom:28, flexWrap:'wrap', alignItems:'flex-end'
      }}>
        <div style={{ flex:1, minWidth:240 }}>
          <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>
            Target Career Domain
          </label>
          <select value={domain} onChange={e => { setDomain(e.target.value); setAnalyzed(false); }}>
            {Object.keys(DOMAIN_SKILLS).map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={analyze} disabled={loading}
          style={{ padding:'13px 28px', fontSize:15, flexShrink:0 }}>
          {loading ? '⏳ Analyzing...' : '🔍 Analyze My Gap'}
        </button>
      </div>

      {/* ── Hero score card ── */}
      <div style={{
        borderRadius:24, padding:'28px 32px', marginBottom:24,
        background:`linear-gradient(135deg,${matchColor}18,rgba(124,92,252,0.1))`,
        border:`1px solid ${matchColor}33`,
        display:'flex', gap:28, alignItems:'center', flexWrap:'wrap'
      }}>
        {/* Circle */}
        <div style={{ position:'relative', width:120, height:120, flexShrink:0 }}>
          <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
            <circle cx="60" cy="60" r="50" fill="none" stroke={matchColor} strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*50}`}
              strokeDashoffset={`${2*Math.PI*50*(1-matchPct/100)}`}
              style={{ transition:'stroke-dashoffset 1.2s ease', filter:`drop-shadow(0 0 8px ${matchColor})` }}/>
          </svg>
          <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
            <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:22, fontWeight:900, color:matchColor }}>{Math.round(matchPct)}%</div>
            <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Match</div>
          </div>
        </div>

        <div style={{ flex:1 }}>
          <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:22, color:'#F0F0FF', marginBottom:6 }}>
            {domain}
          </div>
          <div style={{
            display:'inline-flex', alignItems:'center', gap:8,
            padding:'6px 16px', borderRadius:20,
            background:`${matchColor}20`, border:`1px solid ${matchColor}44`,
            color:matchColor, fontWeight:700, fontSize:14, marginBottom:16
          }}>{matchLabel}</div>

          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:'#06D6A0' }}>{have.length}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Skills Matched</div>
            </div>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:'#FF6B6B' }}>{missing.length}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Skills Missing</div>
            </div>
            <div>
              <div style={{ fontSize:28, fontWeight:900, color:'#FFD93D' }}>{required.length}</div>
              <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Total Required</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ marginBottom:24 }}>
        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
          <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)' }}>Skill Coverage</span>
          <span style={{ fontSize:13, fontWeight:800, color:matchColor }}>{Math.round(matchPct)}% matched • {Math.round(gapPct)}% gap</span>
        </div>
        <div style={{ height:12, background:'rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden', position:'relative' }}>
          <div style={{ position:'absolute', top:0, left:0, height:'100%', width:`${matchPct}%`, background:`linear-gradient(90deg,${matchColor},#7C5CFC)`, borderRadius:12, transition:'width 1.2s ease', boxShadow:`0 0 12px ${matchColor}44` }}/>
        </div>
      </div>

      {/* ── Two columns: Have + Missing ── */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>

        {/* Skills You HAVE */}
        <div className="card">
          <div style={{ fontSize:13, fontWeight:700, color:'#06D6A0', textTransform:'uppercase', letterSpacing:1, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            ✅ Skills You Have ({have.length})
          </div>
          {have.length === 0 ? (
            <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>
              No matching skills found — fill your profile first
            </p>
          ) : (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {have.map(s => (
                <div key={s} style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'6px 14px', borderRadius:20,
                  background:'rgba(6,214,160,0.12)',
                  border:'1px solid rgba(6,214,160,0.25)',
                  color:'#06D6A0', fontSize:13, fontWeight:700
                }}>
                  <span>✓</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Skills MISSING */}
        <div className="card">
          <div style={{ fontSize:13, fontWeight:700, color:'#FF6B6B', textTransform:'uppercase', letterSpacing:1, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
            ❌ Skills Missing ({missing.length})
          </div>
          {missing.length === 0 ? (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:36, marginBottom:10 }}>🎉</div>
              <p style={{ color:'#06D6A0', fontWeight:700, fontSize:14 }}>You have all required skills!</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
              {missing.map(s => (
                <div key={s} style={{
                  display:'inline-flex', alignItems:'center', gap:6,
                  padding:'6px 14px', borderRadius:20,
                  background:'rgba(255,107,107,0.12)',
                  border:'1px solid rgba(255,107,107,0.25)',
                  color:'#FF6B6B', fontSize:13, fontWeight:700
                }}>
                  <span>✗</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Learning Plan for Missing Skills ── */}
      {missing.length > 0 && (
        <>
          <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
            📚 Learning Plan — Fix Each Gap
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {missing.map((skill, i) => {
              const res = getResource(skill);
              return (
                <div key={skill} style={{
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                  gap:14, padding:'14px 18px', borderRadius:14,
                  background:'rgba(255,107,107,0.04)',
                  border:'1px solid rgba(255,107,107,0.12)',
                  flexWrap:'wrap'
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{
                      width:32, height:32, borderRadius:8, flexShrink:0,
                      background:'rgba(255,107,107,0.15)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      fontWeight:900, fontSize:13, color:'#FF6B6B'
                    }}>{i+1}</div>
                    <div>
                      <div style={{ fontWeight:800, fontSize:14, color:'#F0F0FF' }}>{skill}</div>
                      <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:500 }}>Missing for {domain}</div>
                    </div>
                  </div>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    <LinkBtn href={res.yt}   icon="▶️" label="YouTube" color="#FF6B6B" />
                    <LinkBtn href={res.doc}  icon="📖" label="Docs"    color="#7C5CFC" />
                    <LinkBtn href={res.free} icon="🆓" label="Free Course" color="#06D6A0" />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* ── Tip ── */}
      {!profile?.skills || Object.keys(profile.skills).length === 0 ? (
        <div style={{
          marginTop:24, padding:'16px 20px', borderRadius:14,
          background:'rgba(255,217,61,0.08)', border:'1px solid rgba(255,217,61,0.2)'
        }}>
          <p style={{ fontWeight:700, color:'#FFD93D', fontSize:14 }}>
            💡 Tip: Fill your <strong>Profile → Skill Ratings</strong> and upload your <strong>Resume</strong> for a more accurate skill gap analysis.
          </p>
        </div>
      ) : null}
    </div>
  );
}
