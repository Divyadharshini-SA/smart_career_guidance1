import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import API from '../api';
import { useAuth } from '../AuthContext';
import { useNavigate, useParams } from 'react-router-dom';

const TABS = [
  ['overview', '📊 Overview'],
  ['students', '👥 Students'],
  ['upload', '📤 Upload Questions'],
  ['questions', '📝 Question Bank'],
  ['model', '🤖 Model Metrics'],
];

function StatCard({ icon, label, value, color, sub }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: `1.5px solid ${color}22`, borderRadius: 16, padding: '20px 18px', transition: 'all 0.2s' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}55`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.transform = 'none'; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 3 }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: `${color}99`, marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function ReadinessBadge({ value }) {
  const v = parseFloat(value) || 0;
  const color = v >= 70 ? '#06D6A0' : v >= 50 ? '#FFD93D' : '#FF6B6B';
  return <span style={{ padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700, background: `${color}18`, color, border: `1px solid ${color}35` }}>{v.toFixed(0)}%</span>;
}

// ── Student detail modal ───────────────────────────────────────
function StudentModal({ student, onClose }) {
  if (!student) return null;
  const scores = [
    { label: 'Skill Score', val: student.skill_score, color: '#7C5CFC' },
    { label: 'Aptitude Score', val: student.aptitude_score, color: '#FF6B6B' },
    { label: 'Resume Score', val: student.resume_score, color: '#06D6A0' },
    { label: 'Placement Readiness', val: student.placement_readiness, color: '#FFD93D' },
  ];
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={onClose}>
      <div style={{ background: '#0F0F1A', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 28, maxWidth: 480, width: '100%', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 18, color: '#F0F0FF' }}>{student.name}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{student.email}</div>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 8, width: 32, height: 32, cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
          {[
            { label: 'College', val: student.college || '—' },
            { label: 'Branch', val: student.branch || '—' },
            { label: 'Year', val: student.year ? `Year ${student.year}` : '—' },
            { label: 'CGPA', val: student.cgpa != null ? parseFloat(student.cgpa).toFixed(1) : '—' },
            { label: 'Joined', val: new Date(student.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
            { label: 'Status', val: student.placement_readiness >= 70 ? '✅ Placement Ready' : student.placement_readiness >= 50 ? '🟡 Intermediate' : '🔴 Needs Work' },
          ].map(({ label, val }) => (
            <div key={label} style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, color: '#F0F0FF', fontWeight: 600 }}>{val}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12 }}>Score Breakdown</div>
        {scores.map(s => (
          <div key={s.label} style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>{s.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: s.color }}>{(s.val || 0).toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
              <div style={{ height: '100%', borderRadius: 6, background: s.color, width: `${s.val || 0}%`, transition: 'width 0.8s', boxShadow: `0 0 8px ${s.color}55` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
export default function Admin() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { tab = 'overview' } = useParams();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [file, setFile] = useState(null);
  const [manual, setManual] = useState({
    test_type: 'aptitude', topic: '', level: 'easy',
    question: '', option_a: '', option_b: '', option_c: '', option_d: '', answer: ''
  });
  const [metrics, setMetrics] = useState(null);
  const [qStats, setQStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Upload state
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const fileInputRef = useRef(null);

  // Single question form
  const emptyQ = { test_type: 'aptitude', topic: '', level: 'easy', question: '', option_a: '', option_b: '', option_c: '', option_d: '', answer: '' };
  const [singleQ, setSingleQ] = useState(emptyQ);
  const [addingQ, setAddingQ] = useState(false);

  useEffect(() => {
    if (!user || user.role !== 'admin') { toast.error('Admin access required'); navigate('/dashboard'); }
  }, [user, navigate]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    loadTab(tab);
  }, [tab]);

  const loadTab = async (t) => {
    setLoading(true);
    try {
      if (t === 'overview') { const r = await API.get('/admin/stats'); setStats(r.data); }
      else if (t === 'students') { const r = await API.get('/admin/users?limit=200'); setUsers(r.data.users || []); }
      else if (t === 'model') { const r = await API.get('/admin/model-metrics'); setMetrics(r.data); }
      else if (t === 'questions') { const r = await API.get('/admin/question-stats'); setQStats(r.data); }
    } catch { toast.error('Failed to load data'); }
    finally { setLoading(false); }
  };

  const uploadCSV = async e => {
    e.preventDefault();
    if (!uploadFile) { toast.warning('Select a CSV file'); return; }
    const fd = new FormData(); fd.append('file', uploadFile);
    setUploading(true);
    try {
      const res = await API.post('/assessment/upload-questions', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success(res.data.message); setUploadResult(res.data); loadTab('questions');
    } catch { toast.error('Upload failed'); }
    finally { setUploading(false); setUploadFile(null); if (fileInputRef.current) fileInputRef.current.value = ''; }
  };

  const addManual = async e => {
    e.preventDefault(); setAddingQ(true);
    try {
      await API.post('/assessment/add-question', singleQ);
      toast.success('Question added!'); loadTab('questions');
      setSingleQ(emptyQ);
    } catch { toast.error('Failed to add'); }
    finally { setAddingQ(false); }
  };

  const h = e => setSingleQ({ ...singleQ, [e.target.name]: e.target.value });

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await API.get('/admin/export-users', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', `students_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV downloaded!');
    } catch { toast.error('Export failed.'); }
    finally { setExporting(false); }
  };

  const handleCSVUpload = async () => {
    if (!uploadFile) { toast.warning('Select a CSV file first'); return; }
    setUploading(true); setUploadResult(null);
    try {
      const fd = new FormData();
      fd.append('file', uploadFile);
      const res = await API.post('/assessment/upload-questions', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setUploadResult(res.data);
      toast.success(`✅ ${res.data.message}`);
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) { toast.error(err.response?.data?.detail || 'Upload failed'); }
    finally { setUploading(false); }
  };

  const handleAddSingle = async () => {
    for (const f of ['topic', 'question', 'option_a', 'option_b', 'option_c', 'option_d', 'answer']) {
      if (!singleQ[f]?.trim()) { toast.warning(`Fill in: ${f.replace('_', ' ')}`); return; }
    }
    setAddingQ(true);
    try {
      await API.post('/assessment/add-question', singleQ);
      toast.success('Question added!');
      setSingleQ(emptyQ);
    } catch (err) { toast.error(err.response?.data?.detail || 'Failed to add question'); }
    finally { setAddingQ(false); }
  };

  const filtered = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.college?.toLowerCase().includes(search.toLowerCase()) ||
    u.branch?.toLowerCase().includes(search.toLowerCase())
  );

  if (!user || user.role !== 'admin') return null;

  const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: 24 };
  const inp = { width: '100%', padding: '10px 14px', borderRadius: 9, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)', color: '#EEEEFF', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box' };
  const lbl = { fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.45)', marginBottom: 6, display: 'block', textTransform: 'uppercase', letterSpacing: 0.6 };

  return (
    <div>
      <h1 style={{ fontWeight: 800, fontSize: 26, color: '#F0F0FF', marginBottom: 6 }}>🛡️ Admin Panel</h1>
      {loading && <div style={{ textAlign: 'center', padding: 60, color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>⏳ Loading...</div>}

      {/* ── OVERVIEW ─────────────────────────────────────────── */}
      {!loading && tab === 'overview' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 14 }}>
            <StatCard icon="👥" label="Total Students" value={stats.total_students} color="#7C5CFC" />
            <StatCard icon="📝" label="Assessments Taken" value={stats.total_assessments} color="#06D6A0" />
            <StatCard icon="🔮" label="Career Predictions" value={stats.total_career_predictions} color="#FF6B6B" />
            <StatCard icon="📄" label="Resumes Uploaded" value={stats.total_resumes_uploaded} color="#FFD93D" />
            <StatCard icon="❓" label="Questions in DB" value={stats.total_questions} color="#A29BFE" sub={stats.total_questions === 0 ? 'Upload questions!' : null} />
            <StatCard icon="🎯" label="Avg Placement Ready" value={`${stats.avg_placement_readiness}%`} color="#06D6A0" sub={stats.avg_placement_readiness >= 70 ? 'Platform doing great!' : 'Students need more practice'} />
          </div>

          {stats.top_predicted_domains?.length > 0 && (
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 18 }}>🏆 Most Predicted Career Domains</h3>
              {stats.top_predicted_domains.map((d, i) => (
                <div key={d.domain} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <span style={{ fontSize: 18, width: 24 }}>{['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][i]}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                      <span style={{ fontSize: 14, color: '#F0F0FF', fontWeight: 600 }}>{d.domain}</span>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>{d.count} predictions</span>
                    </div>
                    <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                      <div style={{ height: '100%', background: 'linear-gradient(135deg,#7C5CFC,#06D6A0)', borderRadius: 4, width: `${Math.min((d.count / (stats.top_predicted_domains[0]?.count || 1)) * 100, 100)}%`, transition: 'width 0.8s' }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>📝 Questions by Type</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {Object.entries(stats.questions_by_type || {}).map(([type, count]) => {
                const color = type === 'aptitude' ? '#7C5CFC' : type === 'technical' ? '#FFB347' : '#4ECDC4';
                return (
                  <div key={type} style={{ textAlign: 'center', padding: 18, borderRadius: 14, background: `${color}0A`, border: `1px solid ${color}25` }}>
                    <div style={{ fontSize: 28, fontWeight: 900, color }}>{count}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', marginTop: 6, fontWeight: 600, textTransform: 'capitalize' }}>{type.replace('_', ' ')}</div>
                    {count === 0 && <div style={{ fontSize: 11, color: '#FF6B6B', marginTop: 4 }}>⚠️ Upload needed</div>}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── STUDENTS ─────────────────────────────────────────── */}
      {!loading && tab === 'students' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#F0F0FF' }}>👥 {filtered.length} of {users.length} students</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>🔍</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, email, college..."
                  style={{ ...inp, paddingLeft: 30, width: 240 }} />
              </div>
              <button onClick={handleExport} disabled={exporting} style={{
                padding: '9px 18px', borderRadius: 9, background: exporting ? 'rgba(6,214,160,0.06)' : 'rgba(6,214,160,0.14)',
                border: '1px solid rgba(6,214,160,0.35)', color: '#06D6A0', fontWeight: 700, fontSize: 13,
                cursor: exporting ? 'wait' : 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 6,
              }}>{exporting ? '⏳ Exporting...' : '⬇️ Export CSV'}</button>
            </div>
          </div>

          {filtered.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 10 }}>
              {[
                { label: 'Avg Readiness', val: `${(filtered.reduce((s, u) => s + (u.placement_readiness || 0), 0) / filtered.length).toFixed(1)}%`, color: '#06D6A0' },
                { label: 'Avg Aptitude', val: `${(filtered.reduce((s, u) => s + (u.aptitude_score || 0), 0) / filtered.length).toFixed(1)}%`, color: '#FF6B6B' },
                { label: 'Ready ≥70%', val: filtered.filter(u => u.placement_readiness >= 70).length, color: '#06D6A0' },
                { label: 'Need Attention <50%', val: filtered.filter(u => u.placement_readiness < 50).length, color: '#FF6B6B' },
              ].map(s => (
                <div key={s.label} style={{ padding: '12px 16px', borderRadius: 12, background: `${s.color}0A`, border: `1px solid ${s.color}25` }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          <div style={card}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['#', 'Name & Email', 'Branch / College', 'CGPA', 'Skill', 'Aptitude', 'Resume', 'Readiness', 'Joined', ''].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.07)', whiteSpace: 'nowrap', fontSize: 12 }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {filtered.length === 0
                    ? <tr><td colSpan={10} style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.25)', fontSize: 13 }}>{search ? `No match for "${search}"` : 'No students yet'}</td></tr>
                    : filtered.map((u, i) => (
                      <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '11px 12px', color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>{i + 1}</td>
                        <td style={{ padding: '11px 12px' }}>
                          <div style={{ fontWeight: 700, color: '#F0F0FF' }}>{u.name}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{u.email}</div>
                        </td>
                        <td style={{ padding: '11px 12px' }}>
                          <div style={{ color: 'rgba(255,255,255,0.6)' }}>{u.branch || '—'}</div>
                          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{u.college || '—'}</div>
                        </td>
                        <td style={{ padding: '11px 12px', textAlign: 'center' }}>
                          {u.cgpa != null
                            ? <span style={{ fontWeight: 800, color: u.cgpa >= 8 ? '#06D6A0' : u.cgpa >= 6.5 ? '#FFD93D' : '#FF6B6B' }}>{parseFloat(u.cgpa).toFixed(1)}</span>
                            : <span style={{ color: 'rgba(255,255,255,0.2)' }}>—</span>}
                        </td>
                        <td style={{ padding: '11px 12px', color: '#A29BFE', fontWeight: 700 }}>{(u.skill_score || 0).toFixed(0)}%</td>
                        <td style={{ padding: '11px 12px', color: '#FF6B6B', fontWeight: 700 }}>{(u.aptitude_score || 0).toFixed(0)}%</td>
                        <td style={{ padding: '11px 12px', color: '#FFD93D', fontWeight: 700 }}>{(u.resume_score || 0).toFixed(0)}%</td>
                        <td style={{ padding: '11px 12px' }}><ReadinessBadge value={u.placement_readiness} /></td>
                        <td style={{ padding: '11px 12px', color: 'rgba(255,255,255,0.3)', whiteSpace: 'nowrap', fontSize: 12 }}>
                          {new Date(u.joined).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}
                        </td>
                        <td style={{ padding: '11px 12px' }}>
                          <button onClick={() => setSelectedUser(u)} style={{ padding: '5px 12px', borderRadius: 7, background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.3)', color: '#A29BFE', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>View</button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── UPLOAD QUESTIONS ─────────────────────────────────── */}
      {!loading && tab === 'upload' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: 24, alignItems: 'start' }}>

          {/* CSV Upload section */}
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 6 }}>📤 Upload Questions via CSV</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Upload multiple questions at once. First row can be a header row — it will be skipped automatically.</p>

            <div style={{ background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)', borderRadius: 12, padding: '14px 16px', marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#A29BFE', marginBottom: 8 }}>📋 CSV Column Order (9 required, 10th optional):</div>
              <code style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', display: 'block', lineHeight: 2 }}>
                test_type &nbsp;|&nbsp; topic &nbsp;|&nbsp; level &nbsp;|&nbsp; question &nbsp;|&nbsp; option_a &nbsp;|&nbsp; option_b &nbsp;|&nbsp; option_c &nbsp;|&nbsp; option_d &nbsp;|&nbsp; answer &nbsp;|&nbsp; source
              </code>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 8, lineHeight: 1.8 }}>
                <strong style={{ color: '#A29BFE' }}>test_type:</strong> aptitude / technical / soft_skill &nbsp;&nbsp;
                <strong style={{ color: '#A29BFE' }}>level:</strong> easy / medium / hard &nbsp;&nbsp;
                <strong style={{ color: '#A29BFE' }}>answer:</strong> exact text of the correct option
              </div>
            </div>

            <div style={{ background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.2)', borderRadius: 10, padding: '12px 14px', marginBottom: 20, overflowX: 'auto' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#06D6A0', marginBottom: 6 }}>✅ Example row:</div>
              <code style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                aptitude, Percentages, easy, "What is 20% of 150?", 20, 25, 30, 35, 30, manual
              </code>
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 220 }}>
                <label style={lbl}>Choose CSV File</label>
                <input ref={fileInputRef} type="file" accept=".csv" onChange={e => setUploadFile(e.target.files[0])}
                  style={{ ...inp, padding: '8px 12px' }} />
              </div>
              <button onClick={handleCSVUpload} disabled={uploading || !uploadFile} style={{
                padding: '11px 24px', borderRadius: 10, fontFamily: 'inherit',
                background: uploading ? 'rgba(124,92,252,0.1)' : 'linear-gradient(135deg,#7C5CFC,#5A3FE0)',
                border: 'none', color: '#fff', fontWeight: 700, fontSize: 14,
                cursor: (uploading || !uploadFile) ? 'not-allowed' : 'pointer', opacity: !uploadFile ? 0.5 : 1,
              }}>{uploading ? '⏳ Uploading...' : '📤 Upload CSV'}</button>
            </div>

            {uploadResult && (
              <div style={{ marginTop: 16, padding: '14px 16px', borderRadius: 10, background: 'rgba(6,214,160,0.08)', border: '1px solid rgba(6,214,160,0.25)' }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#06D6A0', marginBottom: 6 }}>✅ {uploadResult.message}</div>
                {uploadResult.errors?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#FF6B6B', marginBottom: 4 }}>⚠️ {uploadResult.errors.length} row errors:</div>
                    {uploadResult.errors.map((e, i) => (<div key={i} style={{ fontSize: 11, color: 'rgba(255,107,107,0.8)', marginBottom: 2 }}>• {e}</div>))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Add Single Question section */}
          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 6 }}>➕ Add Single Question</h3>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 20 }}>Manually type and add one question.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={lbl}>Test Type</label>
                <select value={singleQ.test_type} onChange={e => setSingleQ({ ...singleQ, test_type: e.target.value })} style={inp}>
                  <option value="aptitude">Aptitude</option>
                  <option value="technical">Technical</option>
                  <option value="soft_skill">Soft Skill</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Topic</label>
                <input value={singleQ.topic} onChange={e => setSingleQ({ ...singleQ, topic: e.target.value })} placeholder="e.g. Percentages" style={inp} />
              </div>
              <div>
                <label style={lbl}>Difficulty Level</label>
                <select value={singleQ.level} onChange={e => setSingleQ({ ...singleQ, level: e.target.value })} style={inp}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Question Text</label>
              <textarea value={singleQ.question} onChange={e => setSingleQ({ ...singleQ, question: e.target.value })}
                placeholder="Enter the full question here..." rows={3}
                style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
              {['a', 'b', 'c', 'd'].map(opt => (
                <div key={opt}>
                  <label style={lbl}>Option {opt.toUpperCase()}</label>
                  <input value={singleQ[`option_${opt}`]} onChange={e => setSingleQ({ ...singleQ, [`option_${opt}`]: e.target.value })}
                    placeholder={`Type option ${opt.toUpperCase()}`} style={inp} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={lbl}>Correct Answer (copy exactly from one option above)</label>
              <input value={singleQ.answer} onChange={e => setSingleQ({ ...singleQ, answer: e.target.value })}
                placeholder="Paste the correct option text exactly as typed above" style={inp} />
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 5 }}>
                ⚠️ The answer must exactly match one of the option texts above (case-sensitive)
              </div>
            </div>

            <button onClick={handleAddSingle} disabled={addingQ} style={{
              padding: '11px 28px', borderRadius: 10, fontFamily: 'inherit',
              background: addingQ ? 'rgba(6,214,160,0.1)' : 'linear-gradient(135deg,#06D6A0,#04B486)',
              border: 'none', color: '#fff', fontWeight: 700, fontSize: 14, cursor: addingQ ? 'wait' : 'pointer',
            }}>{addingQ ? '⏳ Adding...' : '✅ Add Question'}</button>
          </div>
        </div>
      )}

      {/* ── QUESTION BANK ─────────────────────────────────────── */}
      {!loading && tab === 'questions' && qStats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(qStats).map(([type, data]) => {
            const icon = type === 'aptitude' ? '🧮' : type === 'technical' ? '💻' : '🤝';
            const color = type === 'aptitude' ? '#7C5CFC' : type === 'technical' ? '#FFB347' : '#4ECDC4';
            return (
              <div key={type} style={card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', margin: 0 }}>{icon} {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                    <span style={{ fontSize: 20, fontWeight: 900, color, background: `${color}15`, border: `1px solid ${color}30`, borderRadius: 10, padding: '4px 14px' }}>{data.total} Qs</span>
                    <button onClick={() => navigate('/dashboard/admin/upload')} style={{ padding: '6px 14px', borderRadius: 8, background: `${color}12`, border: `1px solid ${color}30`, color, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>+ Add More</button>
                  </div>
                </div>
                {Object.keys(data.topics || {}).length === 0
                  ? <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)', marginBottom: 12 }}>No questions for {type} yet</div>
                    <button onClick={() => navigate('/dashboard/admin/upload')} style={{ padding: '8px 18px', borderRadius: 9, background: `${color}14`, border: `1px solid ${color}35`, color, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>📤 Upload Now</button>
                  </div>
                  : <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {Object.entries(data.topics).sort((a, b) => b[1] - a[1]).map(([topic, count]) => (
                      <div key={topic} style={{ padding: '6px 14px', borderRadius: 20, background: `${color}10`, border: `1px solid ${color}25`, fontSize: 12, fontWeight: 600, color, display: 'flex', alignItems: 'center', gap: 6 }}>
                        {topic}
                        <span style={{ background: `${color}25`, borderRadius: 10, padding: '1px 7px', fontSize: 11, fontWeight: 800 }}>{count}</span>
                      </div>
                    ))}
                  </div>
                }
              </div>
            );
          })}
        </div>
      )}

      {/* ── MODEL METRICS ────────────────────────────────────── */}
      {!loading && tab === 'model' && metrics && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ padding: '16px 20px', borderRadius: 14, background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)' }}>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>📄 <strong style={{ color: '#A29BFE' }}>Paper:</strong> {metrics.paper_reference}</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>🤖 <strong style={{ color: '#A29BFE' }}>Algorithm:</strong> {metrics.algorithm_used}</div>
          </div>

          <div style={card}>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 4 }}>📊 Algorithm Comparison</h3>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginBottom: 18 }}>IEEE ICAISS 2025 — Table 1</p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>{['Model', 'Accuracy', 'AUC', 'Precision', 'F1 Score'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'rgba(255,255,255,0.3)', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.07)' }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {metrics.comparison_table.map(row => (
                    <tr key={row.model} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', background: row.is_your_model ? 'rgba(124,92,252,0.08)' : row.is_paper_model ? 'rgba(255,107,107,0.05)' : 'transparent' }}>
                      <td style={{ padding: '11px 12px', fontWeight: 700, color: row.is_your_model ? '#A29BFE' : row.is_paper_model ? '#FF6B6B' : '#F0F0FF' }}>
                        {row.is_paper_model ? '⭐ ' : row.is_your_model ? '🚀 ' : ''}{row.model}
                      </td>
                      <td style={{ padding: '11px 12px', color: row.accuracy ? '#06D6A0' : 'rgba(255,255,255,0.25)', fontWeight: 700 }}>{row.accuracy ? `${row.accuracy}%` : '—'}</td>
                      <td style={{ padding: '11px 12px', color: 'rgba(255,255,255,0.55)' }}>{row.auc ?? '—'}</td>
                      <td style={{ padding: '11px 12px', color: 'rgba(255,255,255,0.55)' }}>{row.precision ?? '—'}</td>
                      <td style={{ padding: '11px 12px', color: 'rgba(255,255,255,0.55)' }}>{row.f1_score ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {metrics.engine_features && (
            <div style={card}>
              <h3 style={{ fontSize: 15, fontWeight: 800, color: '#F0F0FF', marginBottom: 16 }}>🔧 CareerEngineV2 Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 10 }}>
                {Object.entries(metrics.engine_features).map(([k, v]) => (
                  <div key={k} style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontWeight: 700, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.8 }}>{k.replace(/_/g, ' ')}</div>
                    <div style={{ fontSize: 13, color: '#A29BFE', fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Student detail modal */}
      <StudentModal student={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
