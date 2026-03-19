import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../AuthContext';
import API from '../api';

// ── Quick action cards for students ───────────────────────────
const STUDENT_ACTIONS = [
  { to: '/assessment', icon: '📝', label: 'Assessment', sub: 'Take topic tests', grad: 'linear-gradient(135deg,#7C5CFC,#5A3FE0)' },
  { to: '/resume', icon: '📄', label: 'Resume', sub: 'AI analysis', grad: 'linear-gradient(135deg,#FF6B6B,#EE0979)' },
  { to: '/career', icon: '🎯', label: 'Career AI', sub: 'Get predictions', grad: 'linear-gradient(135deg,#06D6A0,#0ABDE3)' },
  { to: '/roadmap', icon: '🗺️', label: 'Roadmap', sub: 'Step-by-step plan', grad: 'linear-gradient(135deg,#FFD93D,#F9A825)' },
  { to: '/placement', icon: '💼', label: 'Placement', sub: 'Prep resources', grad: 'linear-gradient(135deg,#4ECDC4,#1A9EAE)' },
  { to: '/chatbot', icon: '🤖', label: 'AI Mentor', sub: 'Career guidance', grad: 'linear-gradient(135deg,#A29BFE,#6C5CE7)' },
];

// ── Quick action cards for admin ──────────────────────────────
const ADMIN_ACTIONS = [
  { to: '/admin', icon: '📊', label: 'Overview', sub: 'Platform stats', grad: 'linear-gradient(135deg,#7C5CFC,#5A3FE0)' },
  { to: '/admin', icon: '👥', label: 'Students', sub: 'Manage users', grad: 'linear-gradient(135deg,#FF6B6B,#EE0979)', tab: 'users' },
  { to: '/admin', icon: '📝', label: 'Questions', sub: 'Manage question DB', grad: 'linear-gradient(135deg,#06D6A0,#0ABDE3)', tab: 'questions' },
  { to: '/admin', icon: '🤖', label: 'Model', sub: 'IEEE comparison', grad: 'linear-gradient(135deg,#FFD93D,#F9A825)', tab: 'model' },
];

const TIPS = [
  '💡 Practice 5 aptitude questions daily to build speed',
  '🎯 Focus on your weakest topic first for faster improvement',
  '📄 Update your resume after every new project or skill',
  '🗺️ Complete at least 2 roadmap steps every week',
  '💼 Study one company profile from Placement hub daily',
  '🤖 Ask the AI Mentor for personalized study advice',
];

const ADMIN_TIPS = [
  '📊 Check placement readiness trends weekly',
  '📝 Upload more aptitude questions to improve accuracy',
  '👥 Students below 50% readiness need immediate attention',
  '🤖 Review career prediction trends in Model Metrics tab',
];

// ── Reusable glow card ─────────────────────────────────────────
function GlowCard({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: 22,
        transition: 'all 0.25s',
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(124,92,252,0.35)';
        e.currentTarget.style.boxShadow = '0 0 24px rgba(124,92,252,0.12)';
        if (onClick) e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)';
        e.currentTarget.style.boxShadow = 'none';
        if (onClick) e.currentTarget.style.transform = 'none';
      }}
    >
      {children}
    </div>
  );
}

// ── Readiness circle SVG ───────────────────────────────────────
function ReadinessCircle({ value }) {
  const r = 46;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  return (
    <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
      <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="55" cy="55" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
        <circle cx="55" cy="55" r={r} fill="none"
          stroke="url(#prog)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s' }}
        />
        <defs>
          <linearGradient id="prog" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#7C5CFC" />
            <stop offset="100%" stopColor="#06D6A0" />
          </linearGradient>
        </defs>
      </svg>
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)', textAlign: 'center',
      }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#F0F0FF', lineHeight: 1 }}>
          {Math.round(value)}%
        </div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>Ready</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Dashboard — shared for student AND admin
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'admin';

  const [prog, setProg] = useState(null);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);   // admin only
  const [tip, setTip] = useState(0);

  useEffect(() => {
    if (isAdmin) {
      // Admin: load platform stats
      API.get('/admin/stats').then(r => setStats(r.data)).catch(() => { });
    } else {
      // Student: load personal progress + history
      Promise.allSettled([
        API.get('/progress/'),
        API.get('/assessment/history'),
      ]).then(([p, h]) => {
        if (p.status === 'fulfilled') setProg(p.value.data);
        if (h.status === 'fulfilled') setHistory(h.value.data);
      });
    }

    // Rotating tips
    const tipList = isAdmin ? ADMIN_TIPS : TIPS;
    const interval = setInterval(() => setTip(x => (x + 1) % tipList.length), 5000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // ── Student computed values ───────────────────────────────
  const readiness = prog?.placement_readiness || 0;
  const totalTests = history.length;
  const avgScore = totalTests
    ? (history.reduce((s, h) => s + (h.percentage || 0), 0) / totalTests).toFixed(1)
    : 0;
  const bestScore = totalTests
    ? Math.max(...history.map(h => h.percentage || 0)).toFixed(1)
    : 0;

  const aptitudeTests = history.filter(h => h.type === 'aptitude').length;
  const technicalTests = history.filter(h => h.type === 'technical').length;
  const scoreReliable = aptitudeTests >= 5 && technicalTests >= 3;
  const reliabilityMsg = aptitudeTests < 5
    ? `Aptitude score from ${aptitudeTests} test(s). Take ${5 - aptitudeTests} more for accuracy.`
    : technicalTests < 3
      ? `Technical score from ${technicalTests} test(s). Take ${3 - technicalTests} more.`
      : 'Your scores are highly reliable! ✅';

  const levelColor = readiness >= 70 ? '#06D6A0' : readiness >= 50 ? '#FFD93D' : '#FF6B6B';
  const levelLabel = readiness >= 70 ? 'Placement Ready 🎉' : readiness >= 50 ? 'Getting There 💪' : 'Keep Going 📚';

  const SCORE_BARS = [
    { label: 'Technical', val: prog?.skill_score, color: '#7C5CFC' },
    { label: 'Aptitude', val: prog?.aptitude_score, color: '#FF6B6B' },
    { label: 'Resume', val: prog?.resume_score, color: '#06D6A0' },
    { label: 'Roadmap', val: prog?.roadmap_completion, color: '#FFD93D' },
  ];

  const currentTips = isAdmin ? ADMIN_TIPS : TIPS;

  return (
    <div style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── HERO BANNER ──────────────────────────────────────── */}
      <div style={{
        position: 'relative', borderRadius: 24, padding: '32px 36px',
        marginBottom: 28, overflow: 'hidden',
        background: isAdmin
          ? 'linear-gradient(135deg,rgba(255,107,107,0.18),rgba(124,92,252,0.1))'
          : 'linear-gradient(135deg,rgba(124,92,252,0.2),rgba(6,214,160,0.1))',
        border: `1px solid ${isAdmin ? 'rgba(255,107,107,0.2)' : 'rgba(124,92,252,0.2)'}`,
      }}>
        {/* Glow blob */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 300, height: 300, borderRadius: '50%',
          background: isAdmin
            ? 'radial-gradient(circle,rgba(255,107,107,0.12) 0%,transparent 70%)'
            : 'radial-gradient(circle,rgba(124,92,252,0.15) 0%,transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 14, fontWeight: 600, marginBottom: 6 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            <h1 style={{ fontSize: 30, fontWeight: 800, color: '#F0F0FF', marginBottom: 8, lineHeight: 1.2 }}>
              {isAdmin ? `Admin Panel, ${user?.name?.split(' ')[0]} 🛡️` : `Hey, ${user?.name?.split(' ')[0]} 👋`}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, marginBottom: 20 }}>
              {isAdmin
                ? 'Manage students, monitor progress and platform health'
                : 'Track your placement readiness and grow daily'}
            </p>

            {/* Status and Streak badges */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {isAdmin ? (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '8px 16px', borderRadius: 20,
                  background: 'rgba(255,107,107,0.15)',
                  border: '1px solid rgba(255,107,107,0.35)',
                  color: '#FF6B6B', fontWeight: 700, fontSize: 14,
                }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#FF6B6B', boxShadow: '0 0 8px #FF6B6B' }} />
                  Administrator Access
                </div>
              ) : (
                <>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    padding: '8px 16px', borderRadius: 20,
                    background: `${levelColor}18`, border: `1px solid ${levelColor}44`,
                    color: levelColor, fontWeight: 700, fontSize: 14,
                  }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: levelColor, boxShadow: `0 0 8px ${levelColor}` }} />
                    {levelLabel}
                  </div>
                  {prog && prog.streak_days > 0 && (
                    <div title={`Best Streak: ${prog.best_streak || prog.streak_days} days`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '8px 16px', borderRadius: 20,
                      background: 'linear-gradient(135deg,rgba(255,107,107,0.15),rgba(255,217,61,0.1))',
                      border: '1px solid rgba(255,107,107,0.3)',
                      color: '#FFD93D', fontWeight: 800, fontSize: 14,
                      boxShadow: '0 0 12px rgba(255,107,107,0.15)'
                    }}>
                      <span style={{ fontSize: 16 }}>🔥</span> {prog.streak_days} Day Streak
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Right side: readiness circle for students, stat for admin */}
          {isAdmin && stats ? (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 40, fontWeight: 900, color: '#FF6B6B', lineHeight: 1 }}>
                {stats.total_students}
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 4 }}>
                Total Students
              </div>
              <div style={{ fontSize: 13, color: '#06D6A0', fontWeight: 700, marginTop: 8 }}>
                Avg: {stats.avg_placement_readiness}% ready
              </div>
            </div>
          ) : (
            <ReadinessCircle value={readiness} />
          )}
        </div>

        {/* Rotating tip */}
        <div style={{
          marginTop: 20, padding: '10px 16px', borderRadius: 12,
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          fontSize: 13, color: 'rgba(255,255,255,0.6)', fontWeight: 500,
        }}>
          {currentTips[tip]}
        </div>
      </div>

      {/* ── STUDENT: Stats row ───────────────────────────────── */}
      {!isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Tests Taken', value: totalTests, icon: '📝', color: '#7C5CFC' },
            { label: 'Avg Score', value: `${avgScore}%`, icon: '📊', color: '#06D6A0' },
            { label: 'Best Score', value: `${bestScore}%`, icon: '🏆', color: '#FFD93D' },
            { label: 'Resume Score', value: `${(prog?.resume_score || 0).toFixed(0)}%`, icon: '📄', color: '#FF6B6B' },
          ].map(s => (
            <GlowCard key={s.label}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      )}

      {/* ── ADMIN: Stats row ─────────────────────────────────── */}
      {isAdmin && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 14, marginBottom: 28 }}>
          {[
            { label: 'Total Students', value: stats.total_students, icon: '👥', color: '#7C5CFC' },
            { label: 'Assessments Taken', value: stats.total_assessments, icon: '📝', color: '#06D6A0' },
            { label: 'Career Predictions', value: stats.total_career_predictions, icon: '🔮', color: '#FF6B6B' },
            { label: 'Questions in DB', value: stats.total_questions, icon: '❓', color: '#FFD93D' },
          ].map(s => (
            <GlowCard key={s.label} onClick={() => navigate('/admin')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${s.color}18`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{s.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                </div>
              </div>
            </GlowCard>
          ))}
        </div>
      )}

      {/* ── STUDENT: Score bars + Recent tests ──────────────── */}
      {!isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28, alignItems: 'start' }}>

          {/* Score overview */}
          <GlowCard>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
              Score Overview
            </div>
            {SCORE_BARS.map(s => (
              <div key={s.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{(s.val || 0).toFixed(0)}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
                  <div style={{
                    height: '100%', borderRadius: 6,
                    background: s.color, width: `${s.val || 0}%`,
                    boxShadow: `0 0 8px ${s.color}66`, transition: 'width 1s',
                  }} />
                </div>
              </div>
            ))}

            {/* Reliability warning/badge */}
            {totalTests > 0 && (
              <div style={{
                marginTop: 12, padding: '10px 14px', borderRadius: 10,
                background: scoreReliable ? 'rgba(6,214,160,0.06)' : 'rgba(255,217,61,0.08)',
                border: `1px solid ${scoreReliable ? 'rgba(6,214,160,0.2)' : 'rgba(255,217,61,0.2)'}`,
                fontSize: 12, fontWeight: 600,
                color: scoreReliable ? '#06D6A0' : '#FFD93D',
              }}>
                {scoreReliable ? '✅ ' : '⚠️ '}{reliabilityMsg}
              </div>
            )}
            {!prog && (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
              Take a test to see your scores
            </p>
          )}
        </GlowCard>

        {/* Readiness History Chart */}
        <GlowCard>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
            Placement Readiness Trend
          </div>
          {prog?.readiness_history && prog.readiness_history.length > 1 ? (
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <LineChart data={prog.readiness_history} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    stroke="rgba(255,255,255,0.2)" 
                    fontSize={10} 
                    tickFormatter={(val) => new Date(val).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                    minTickGap={20}
                  />
                  <YAxis stroke="rgba(255,255,255,0.2)" fontSize={10} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(10,10,15,0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                    itemStyle={{ color: '#06D6A0', fontWeight: 700 }}
                    labelFormatter={(val) => new Date(val).toLocaleDateString()}
                  />
                  <Line type="monotone" dataKey="score" stroke="#06D6A0" strokeWidth={3} dot={{ r: 3, fill: '#13131F', stroke: '#06D6A0', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📈</div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Take more assessments to view your growth history</p>
            </div>
          )}
        </GlowCard>

        {/* Recent tests */}
        <GlowCard style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
              Recent Tests
            </div>
            {history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>📝</div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>No tests taken yet</p>
                <button
                  onClick={() => navigate('/assessment')}
                  style={{
                    marginTop: 14, padding: '9px 20px', borderRadius: 10,
                    background: 'rgba(124,92,252,0.15)', border: '1px solid rgba(124,92,252,0.3)',
                    color: '#A29BFE', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >Start Testing →</button>
              </div>
            ) : history.slice(0, 5).map((h, i) => {
              const p = h.percentage || 0;
              const c = p >= 85 ? '#06D6A0' : p >= 70 ? '#7C5CFC' : p >= 50 ? '#FFD93D' : '#FF6B6B';
              return (
                <div key={h.id} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10, marginBottom: 8,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)', textTransform: 'capitalize' }}>
                      {h.type?.replace('_', ' ')} Test
                      {h.scores?._topic ? ` · ${h.scores._topic}` : ''}
                    </div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
                      {new Date(h.taken_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, fontSize: 16, color: c }}>{p.toFixed(0)}%</div>
                </div>
              );
            })}
            {history.length > 5 && (
              <button
                onClick={() => navigate('/assessment')}
                style={{
                  width: '100%', marginTop: 4, padding: '8px 0',
                  background: 'none', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8, color: 'rgba(255,255,255,0.3)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >View all {history.length} tests →</button>
            )}
          </GlowCard>
        </div>
      )}

      {/* ── ADMIN: Top domains summary ───────────────────────── */}
      {isAdmin && stats?.top_predicted_domains?.length > 0 && (
        <GlowCard style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
            🏆 Most Predicted Career Domains
          </div>
          {stats.top_predicted_domains.map((d, i) => (
            <div key={d.domain} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontSize: 16, width: 22 }}>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, color: '#F0F0FF', fontWeight: 600 }}>{d.domain}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{d.count}</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                  <div style={{
                    height: '100%', borderRadius: 4,
                    background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)',
                    width: `${Math.min((d.count / (stats.top_predicted_domains[0]?.count || 1)) * 100, 100)}%`,
                  }} />
                </div>
              </div>
            </div>
          ))}
        </GlowCard>
      )}

      {/* ── QUICK ACTIONS ────────────────────────────────────── */}
      <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
        {isAdmin ? 'Admin Quick Links' : 'Quick Actions'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(155px,1fr))', gap: 14 }}>
        {(isAdmin ? ADMIN_ACTIONS : STUDENT_ACTIONS).map((a, i) => (
          <div
            key={i}
            onClick={() => navigate(a.to)}
            style={{
              borderRadius: 18, padding: '22px 18px', cursor: 'pointer',
              background: a.grad, position: 'relative', overflow: 'hidden',
              transition: 'all 0.25s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ fontSize: 28, marginBottom: 10 }}>{a.icon}</div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>{a.label}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 500 }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}


