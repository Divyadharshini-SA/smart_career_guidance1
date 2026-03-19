import React, { useState, useEffect } from 'react';
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line,
  PieChart, Pie, Cell,
  AreaChart, Area,
} from 'recharts';
import API from '../api';

// ── Colour palette ────────────────────────────────────────────
const C = {
  purple: '#6C63FF',
  pink: '#FF6584',
  green: '#43E97B',
  orange: '#F9A825',
  blue: '#29B6F6',
  violet: '#AB47BC',
};

// ── Reusable stat card ────────────────────────────────────────
function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', borderRadius: 18, padding: '20px 22px',
      border: `2px solid ${color}44`,
      display: 'flex', alignItems: 'center', gap: 16
    }}>
      <div style={{
        width: 52, height: 52, borderRadius: 14, flexShrink: 0,
        background: `${color}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 12, color: '#7A7A9D', fontWeight: 700, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 900, color }}>{value}</div>
        {sub && <div style={{ fontSize: 12, color: '#7A7A9D', fontWeight: 600, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ── Section heading ───────────────────────────────────────────
function SectionTitle({ children }) {
  return (
    <h2 style={{ fontWeight: 900, fontSize: 18, color: '#F0F0FF', marginBottom: 16, marginTop: 32, display: 'flex', alignItems: 'center', gap: 8 }}>
      {children}
    </h2>
  );
}

// ── Custom tooltip for charts ─────────────────────────────────
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'rgba(20,20,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
      <p style={{ fontWeight: 800, marginBottom: 4, color: '#F0F0FF' }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color, fontWeight: 700, fontSize: 13 }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) + '%' : p.value}
        </p>
      ))}
    </div>
  );
}

export default function Progress() {
  const [prog, setProg] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      API.get('/progress/'),
      API.get('/assessment/history'),
    ]).then(([p, h]) => {
      if (p.status === 'fulfilled') setProg(p.value.data);
      if (h.status === 'fulfilled') setHistory(h.value.data);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
      <p style={{ color: '#7A7A9D', fontWeight: 700 }}>Loading your progress...</p>
    </div>
  );

  // ── Derived data ─────────────────────────────────────────────
  const readiness = prog?.placement_readiness || 0;
  const level = readiness >= 70
    ? { label: 'Placement Ready 🎉', color: C.green }
    : readiness >= 50
      ? { label: 'Getting There! 💪', color: C.orange }
      : { label: 'Keep Practicing 📚', color: C.pink };

  // Radar data
  const radarData = [
    { subject: 'Technical', val: prog?.skill_score || 0 },
    { subject: 'Aptitude', val: prog?.aptitude_score || 0 },
    { subject: 'Resume', val: prog?.resume_score || 0 },
    { subject: 'Roadmap', val: prog?.roadmap_completion || 0 },
    { subject: 'Readiness', val: prog?.placement_readiness || 0 },
  ];

  // Score breakdown bar chart
  const scoreBarData = [
    { name: 'Technical', score: prog?.skill_score || 0, fill: C.purple },
    { name: 'Aptitude', score: prog?.aptitude_score || 0, fill: C.pink },
    { name: 'Resume', score: prog?.resume_score || 0, fill: C.green },
    { name: 'Roadmap', score: prog?.roadmap_completion || 0, fill: C.orange },
  ];

  // History → line chart (last 10 tests, sorted oldest first)
  const lineData = [...history]
    .reverse()
    .slice(-10)
    .map((h, i) => ({
      test: `Test ${i + 1}`,
      score: parseFloat((h.percentage || 0).toFixed(1)),
      type: h.type,
      date: new Date(h.taken_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    }));

  // Tests by type for pie chart
  const typeCount = history.reduce((acc, h) => {
    acc[h.type] = (acc[h.type] || 0) + 1;
    return acc;
  }, {});
  const pieData = Object.entries(typeCount).map(([name, value]) => ({ name, value }));
  const PIE_COLORS = [C.purple, C.pink, C.green, C.orange, C.blue];

  // Score distribution (A/B/C/D)
  const gradeCount = { 'A (85%+)': 0, 'B (70-84%)': 0, 'C (50-69%)': 0, 'D (<50%)': 0 };
  history.forEach(h => {
    const p = h.percentage || 0;
    if (p >= 85) gradeCount['A (85%+)']++;
    else if (p >= 70) gradeCount['B (70-84%)']++;
    else if (p >= 50) gradeCount['C (50-69%)']++;
    else gradeCount['D (<50%)']++;
  });
  const gradeData = Object.entries(gradeCount).map(([grade, count]) => ({ grade, count }));

  // Avg by type
  const avgByType = Object.entries(
    history.reduce((acc, h) => {
      if (!acc[h.type]) acc[h.type] = { sum: 0, count: 0 };
      acc[h.type].sum += h.percentage || 0;
      acc[h.type].count += 1;
      return acc;
    }, {})
  ).map(([type, { sum, count }]) => ({
    type, avg: parseFloat((sum / count).toFixed(1))
  }));

  const totalTests = history.length;
  const avgScore = totalTests ? (history.reduce((s, h) => s + (h.percentage || 0), 0) / totalTests) : 0;
  const bestScore = totalTests ? Math.max(...history.map(h => h.percentage || 0)) : 0;

  return (
    <div style={{ width: '100%' }}>
      <h1 className="page-title">Learning Progress</h1>
      <p style={{ color: '#7A7A9D', marginBottom: 28, fontSize: 15 }}>
        Your complete placement readiness analytics
      </p>

      {/* ── Hero readiness banner ────────────────────────────── */}
      <div style={{
        background: `linear-gradient(135deg,${level.color},#6C63FF)`,
        borderRadius: 24, padding: '28px 36px', color: '#fff',
        marginBottom: 28, display: 'flex',
        justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20
      }}>
        <div>
          <p style={{ fontSize: 14, opacity: 0.85, marginBottom: 6 }}>Overall Placement Readiness</p>
          <div style={{ fontSize: 60, fontWeight: 900, lineHeight: 1 }}>{readiness.toFixed(1)}%</div>
          <div style={{
            marginTop: 12, background: 'rgba(255,255,255,0.2)', borderRadius: 20,
            padding: '6px 18px', display: 'inline-block', fontWeight: 800, fontSize: 15
          }}>{level.label}</div>
        </div>
        {/* Circular progress */}
        <div style={{ position: 'relative', width: 120, height: 120 }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="10" />
            <circle cx="60" cy="60" r="50" fill="none" stroke="#fff" strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - readiness / 100)}`}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s' }} />
          </svg>
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            fontWeight: 900, fontSize: 22, color: '#fff'
          }}>{Math.round(readiness)}%</div>
        </div>
      </div>

      {/* ── Top 4 stat cards ──────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: 14, marginBottom: 8 }}>
        <StatCard icon="📝" label="Tests Taken" value={totalTests} color={C.purple} sub="total assessments" />
        <StatCard icon="📊" label="Average Score" value={`${avgScore.toFixed(1)}%`} color={C.blue} sub="across all tests" />
        <StatCard icon="🏆" label="Best Score" value={`${bestScore.toFixed(1)}%`} color={C.green} sub="personal best" />
        <StatCard icon="📄" label="Resume Score" value={`${(prog?.resume_score || 0).toFixed(1)}%`} color={C.orange} sub="ATS readiness" />
      </div>

      {/* ── Row 1: Bar chart + Radar ──────────────────────────── */}
      <SectionTitle>📈 Score Breakdown</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 8 }}>

        {/* Score Bar Chart */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: '#F0F0FF' }}>📊 Category Scores</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={scoreBarData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEFF" />
              <XAxis dataKey="name" tick={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontFamily: 'Nunito', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {scoreBarData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar Chart */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: '#F0F0FF' }}>🕸️ Skills Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E0E7FF" />
              <PolarAngleAxis dataKey="subject" tick={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12 }} />
              <Tooltip formatter={v => `${parseFloat(v).toFixed(1)}%`} />
              <Radar name="Score" dataKey="val" stroke={C.purple} fill={C.purple} fillOpacity={0.25} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Row 2: Score trend line chart ────────────────────── */}
      <SectionTitle>📉 Score Trend Over Time</SectionTitle>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
        {lineData.length < 2 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#7A7A9D' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📝</div>
            <p style={{ fontWeight: 700 }}>Take at least 2 tests to see your score trend</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.purple} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={C.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEFF" />
              <XAxis dataKey="date" tick={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontFamily: 'Nunito', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="score" name="Score" stroke={C.purple} strokeWidth={3}
                fill="url(#scoreGrad)" dot={{ fill: C.purple, r: 5 }} activeDot={{ r: 7 }} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ── Row 3: Pie + Grade bar ────────────────────────────── */}
      <SectionTitle>🧩 Test Analytics</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 8 }}>

        {/* Tests by type Pie */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: '#F0F0FF' }}>🥧 Tests by Category</h3>
          {pieData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#7A7A9D', fontWeight: 700 }}>No tests taken yet</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={80} innerRadius={40} paddingAngle={4}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}>
                  {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} tests`, n]} />
              </PieChart>
            </ResponsiveContainer>
          )}
          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8, justifyContent: 'center' }}>
            {pieData.map((p, i) => (
              <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: 3, background: PIE_COLORS[i % PIE_COLORS.length] }} />
                <span style={{ fontSize: 12, fontWeight: 700, color: '#7A7A9D', textTransform: 'capitalize' }}>{p.name} ({p.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, color: '#F0F0FF' }}>🎓 Grade Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeData} barSize={40}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEFF" />
              <XAxis dataKey="grade" tick={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontFamily: 'Nunito', fontSize: 11 }} />
              <Tooltip content={({ active, payload, label }) => active && payload?.length ? (
                <div style={{ background: 'rgba(20,20,30,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '10px 16px', backdropFilter: 'blur(10px)' }}>
                  <p style={{ fontWeight: 800, color: '#F0F0FF' }}>{label}</p>
                  <p style={{ color: C.purple, fontWeight: 700 }}>{payload[0].value} tests</p>
                </div>
              ) : null} />
              <Bar dataKey="count" name="Tests" radius={[8, 8, 0, 0]}>
                {gradeData.map((_, i) => (
                  <Cell key={i} fill={[C.green, C.purple, C.orange, C.pink][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Avg score by type bar chart ───────────────────────── */}
      {avgByType.length > 0 && (<>
        <SectionTitle>🏅 Average Score by Test Type</SectionTitle>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={avgByType} barSize={50}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EEFF" />
              <XAxis dataKey="type" tick={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13, textTransform: 'capitalize' }} />
              <YAxis domain={[0, 100]} tick={{ fontFamily: 'Nunito', fontSize: 11 }} tickFormatter={v => `${v}%`} />
              <Tooltip content={<ChartTooltip />} />
              <Bar dataKey="avg" name="Avg Score" radius={[10, 10, 0, 0]}>
                {avgByType.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </>)}

      {/* ── Progress bars ─────────────────────────────────────── */}
      <SectionTitle>⚡ Detailed Progress Bars</SectionTitle>
      <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)', marginBottom: 8 }}>
        {[
          { label: 'Technical Skill Score', val: prog?.skill_score, color: C.purple, icon: '💻' },
          { label: 'Aptitude Score', val: prog?.aptitude_score, color: C.pink, icon: '🧠' },
          { label: 'Resume Score', val: prog?.resume_score, color: C.green, icon: '📄' },
          { label: 'Roadmap Completion', val: prog?.roadmap_completion, color: C.orange, icon: '🗺️' },
          { label: 'Placement Readiness', val: prog?.placement_readiness, color: C.blue, icon: '🎯' },
        ].map(p => (
          <div key={p.label} style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 14 }}>{p.icon} {p.label}</span>
              <span style={{ fontWeight: 900, color: p.color, fontSize: 15 }}>{(p.val || 0).toFixed(1)}%</span>
            </div>
            <div style={{ height: 12, background: '#F0EEFF', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 10, background: p.color,
                width: `${p.val || 0}%`, transition: 'width 1.2s ease',
                boxShadow: `0 2px 8px ${p.color}55`
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent tests list ─────────────────────────────────── */}
      {history.length > 0 && (<>
        <SectionTitle>🕐 Recent Tests</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 8 }}>
          {history.slice(0, 5).map((h, i) => {
            const p = h.percentage || 0;
            const gr = p >= 85 ? { g: 'A', c: C.green } : p >= 70 ? { g: 'B', c: C.purple } : p >= 50 ? { g: 'C', c: C.orange } : { g: 'D', c: C.pink };
            return (
              <div key={h.id} style={{
                background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '14px 20px',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${gr.c}18`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontWeight: 900, color: gr.c, fontSize: 16
                  }}>{gr.g}</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 14, textTransform: 'capitalize' }}>{h.type} Test</div>
                    <div style={{ fontSize: 12, color: '#7A7A9D', fontWeight: 600 }}>
                      {new Date(h.taken_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                </div>
                <div style={{ fontWeight: 900, fontSize: 20, color: gr.c }}>{p.toFixed(1)}%</div>
              </div>
            );
          })}
        </div>
      </>)}

      {/* ── Completed roadmap steps ───────────────────────────── */}
      {prog?.completed_roadmap_steps?.length > 0 && (<>
        <SectionTitle>✅ Completed Roadmap Steps</SectionTitle>
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {prog.completed_roadmap_steps.map(s => (
              <span key={s} style={{
                background: '#EFFFEF', color: C.green, borderRadius: 10,
                padding: '6px 14px', fontSize: 13, fontWeight: 800,
                border: `1.5px solid ${C.green}33`
              }}>✓ {s}</span>
            ))}
          </div>
        </div>
      </>)}

    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';
// import API from '../api';

// export default function Progress() {
//   const [prog, setProg] = useState(null);

//   useEffect(() => { API.get('/progress/').then(r => setProg(r.data)).catch(() => {}); }, []);

//   if (!prog) return <div><h1 className="page-title">📊 Progress Tracker</h1><p style={{color:'#7A7A9D'}}>Loading...</p></div>;

//   const radarData = [
//     { subject:'Skills',    val: prog.skill_score    || 0 },
//     { subject:'Aptitude',  val: prog.aptitude_score || 0 },
//     { subject:'Resume',    val: prog.resume_score   || 0 },
//     { subject:'Roadmap',   val: prog.roadmap_completion || 0 },
//     { subject:'Readiness', val: prog.placement_readiness || 0 },
//   ];

//   const readiness = prog.placement_readiness || 0;
//   const level     = readiness >= 70 ? { label:'Placement Ready 🎉', color:'#43E97B' }
//                   : readiness >= 50 ? { label:'Getting There! 💪',  color:'#F9A825' }
//                   : { label:'Keep Going! 📚', color:'#FF6584' };

//   return (
//     <div>
//       <h1 className="page-title">📊 Progress Tracker</h1>
//       <p className="page-sub">Your overall placement readiness at a glance</p>

//       {/* Readiness Hero */}
//       <div style={{
//         background:`linear-gradient(135deg,${level.color},#6C63FF)`,
//         borderRadius:20, padding:'32px 36px', color:'#fff', marginBottom:28,
//         display:'flex', justifyContent:'space-between', alignItems:'center'
//       }}>
//         <div>
//           <p style={{ fontSize:16, opacity:0.85, marginBottom:8 }}>Overall Placement Readiness</p>
//           <div style={{ fontSize:56, fontWeight:900 }}>{readiness.toFixed(1)}%</div>
//           <div style={{ marginTop:10, background:'rgba(255,255,255,0.2)', borderRadius:20, padding:'6px 18px', display:'inline-block', fontWeight:700 }}>
//             {level.label}
//           </div>
//         </div>
//         <div style={{ fontSize:80 }}>🎯</div>
//       </div>

//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
//         {/* Score cards */}
//         <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
//           {[
//             { label:'Technical Skill Score',  val:prog.skill_score,         color:'#6C63FF', icon:'💻' },
//             { label:'Aptitude Score',          val:prog.aptitude_score,      color:'#FF6584', icon:'🧠' },
//             { label:'Resume Score',            val:prog.resume_score,        color:'#43E97B', icon:'📄' },
//             { label:'Roadmap Completion',      val:prog.roadmap_completion,  color:'#F9A825', icon:'🗺️' },
//           ].map(p => (
//             <div key={p.label} className="card" style={{ padding:'18px 22px' }}>
//               <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
//                 <div style={{ display:'flex', gap:10, alignItems:'center' }}>
//                   <span style={{ fontSize:22 }}>{p.icon}</span>
//                   <span style={{ fontWeight:700, fontSize:15 }}>{p.label}</span>
//                 </div>
//                 <span style={{ fontWeight:900, fontSize:20, color:p.color }}>{(p.val||0).toFixed(1)}%</span>
//               </div>
//               <div className="progress-bar-wrap">
//                 <div className="progress-bar-fill" style={{ width:`${p.val||0}%`, background:p.color }} />
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Radar Chart */}
//         <div className="card">
//           <h3 style={{ fontWeight:800, marginBottom:16 }}>🕸️ Skills Radar</h3>
//           <ResponsiveContainer width="100%" height={280}>
//             <RadarChart data={radarData}>
//               <PolarGrid />
//               <PolarAngleAxis dataKey="subject" tick={{ fontFamily:'Nunito', fontWeight:700, fontSize:13 }} />
//               <Tooltip formatter={(v) => `${v.toFixed(1)}%`} />
//               <Radar name="Score" dataKey="val" stroke="#6C63FF" fill="#6C63FF" fillOpacity={0.3} />
//             </RadarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Completed Steps */}
//       {prog.completed_roadmap_steps?.length > 0 && (
//         <div className="card" style={{ marginTop:24 }}>
//           <h3 style={{ fontWeight:800, marginBottom:14 }}>✅ Completed Roadmap Steps ({prog.completed_roadmap_steps.length})</h3>
//           <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//             {prog.completed_roadmap_steps.map(s => (
//               <span key={s} className="badge" style={{ background:'#EFFFEF', color:'#43E97B', fontSize:13, padding:'6px 14px' }}>✓ {s}</span>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
