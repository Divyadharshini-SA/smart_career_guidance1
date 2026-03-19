import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

function SectionRow({ label, present }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '9px 14px', borderRadius: 10, marginBottom: 6,
      background: present ? 'rgba(6,214,160,0.06)' : 'rgba(255,107,107,0.06)',
      border: `1px solid ${present ? 'rgba(6,214,160,0.15)' : 'rgba(255,107,107,0.12)'}`
    }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
      <span style={{
        fontSize: 12, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
        background: present ? 'rgba(6,214,160,0.15)' : 'rgba(255,107,107,0.15)',
        color: present ? '#06D6A0' : '#FF6B6B'
      }}>{present ? '✓ Found' : '✗ Missing'}</span>
    </div>
  );
}

export default function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drag, setDrag] = useState(false);
  const [tab, setTab] = useState('overview');

  const [jd, setJd] = useState('');
  const [matchResult, setMatchResult] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);

  useEffect(() => {
    API.get('/resume/latest').then(r => setResult(r.data)).catch(() => { });
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
      setMatchResult(null);
      toast.success('Resume analyzed! 🎉');
    } catch { toast.error('Upload failed'); }
    finally { setLoading(false); }
  };

  const matchJd = async e => {
    e.preventDefault();
    if (!jd.trim()) { toast.warning('Please enter a job description'); return; }
    setMatchLoading(true);
    try {
      const res = await API.post('/resume/match-jd', { job_description: jd });
      setMatchResult(res.data);
      toast.success('Match completed! 🎯');
    } catch {
      toast.error('Failed to match JD. Ensure a resume is uploaded first.');
    } finally {
      setMatchLoading(false);
    }
  };

  const fb = result?.feedback;
  const score = result?.resume_score || 0;
  const scoreColor = fb?.score_color || (score >= 70 ? '#06D6A0' : score >= 50 ? '#FFD93D' : '#FF6B6B');
  const scoreLabel = fb?.score_label || (score >= 70 ? 'Excellent Resume ⭐' : score >= 50 ? 'Good Resume 👍' : 'Needs Work ⚠️');

  const TABS = [
    { key: 'overview', label: '📊 Overview' },
    { key: 'match', label: '🎯 JD Match' },
    { key: 'sections', label: '📋 Sections' },
    { key: 'strengths', label: '💪 Strengths' },
    { key: 'improve', label: '🔧 Improve' },
    { key: 'ats', label: '🤖 ATS Tips' },
  ];

  return (
    <div style={{ width: '100%', fontFamily: 'Inter,sans-serif' }}>
      <h1 className="page-title">Resume Analyzer</h1>
      <p className="page-sub">Upload your resume for AI-powered scoring, skill extraction &amp; smart feedback</p>

      {/* ── Main 2-column grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, alignItems: 'start' }}>

        {/* ══════════════════════════════════
            LEFT COLUMN — Upload + Quick Tips
            ══════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Upload card */}
          <div className="card">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
              📤 Upload Resume
            </div>
            <form onSubmit={upload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); setFile(e.dataTransfer.files[0]); }}
                onClick={() => document.getElementById('rf').click()}
                style={{
                  border: `2px dashed ${drag ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: 16, padding: '36px 20px', textAlign: 'center',
                  background: drag ? 'rgba(124,92,252,0.08)' : 'rgba(255,255,255,0.02)',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>{file ? '📄' : '📁'}</div>
                <p style={{ fontWeight: 700, color: file ? '#7C5CFC' : 'rgba(255,255,255,0.35)', fontSize: 13, marginBottom: 4 }}>
                  {file ? file.name : 'Drop file here or click to browse'}
                </p>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>PDF or DOCX • Max 16MB</p>
                <input id="rf" type="file" accept=".pdf,.doc,.docx"
                  onChange={e => setFile(e.target.files[0])} style={{ display: 'none' }} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? '⏳ Analyzing...' : '🔍 Analyze Resume'}
              </button>
            </form>
          </div>

          {/* Quick Tips — always visible */}
          <div className="card" style={{ background: 'rgba(255,217,61,0.04)', border: '1px solid rgba(255,217,61,0.15)' }}>
            <div style={{ fontWeight: 700, color: '#FFD93D', fontSize: 13, marginBottom: 10 }}>💡 Quick Tips</div>
            {['Include all technical skills', 'Add projects with tech stack', 'Use standard section headings', 'Keep it 1-2 pages'].map(t => (
              <div key={t} style={{ display: 'flex', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>
                <span style={{ color: '#FFD93D', flexShrink: 0 }}>→</span>{t}
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            RIGHT COLUMN — Score circle + Tabs + Content
            ══════════════════════════════════════════════ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {result ? (
            <>
              {/* Score circle card — TOP of right column */}
              <div className="card" style={{
                display: 'flex', alignItems: 'center', gap: 28,
                background: `${scoreColor}08`, border: `1.5px solid ${scoreColor}30`,
              }}>
                {/* SVG circle */}
                <div style={{ position: 'relative', width: 110, height: 110, flexShrink: 0 }}>
                  <svg width="110" height="110" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="55" cy="55" r="46" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" />
                    <circle cx="55" cy="55" r="46" fill="none" stroke={scoreColor} strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${2 * Math.PI * 46 * (1 - score / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s', filter: `drop-shadow(0 0 8px ${scoreColor})` }} />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
                    <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 22, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>
                      {score.toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Score info */}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 18, color: scoreColor, marginBottom: 4 }}>{scoreLabel}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
                    {fb?.skill_count || result.extracted_skills?.length || 0} skills detected from your resume
                  </div>
                  {/* Mini score bars */}
                  {[
                    { label: 'Skill Coverage', val: Math.min((result.extracted_skills?.length || 0) / 15, 1) * 100, color: '#7C5CFC' },
                    { label: 'Section Coverage', val: Object.values(fb?.sections || {}).filter(Boolean).length / Math.max(Object.keys(fb?.sections || {}).length, 1) * 100, color: '#06D6A0' },
                    { label: 'Content Length', val: Math.min(score, 100), color: '#FFD93D' },
                  ].map(b => (
                    <div key={b.label} style={{ marginBottom: 6 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{b.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: b.color }}>{Math.round(b.val)}%</span>
                      </div>
                      <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                        <div style={{ height: '100%', borderRadius: 4, background: b.color, width: `${b.val}%`, transition: 'width 1s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tab bar */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {TABS.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={{
                    padding: '8px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 13,
                    background: tab === t.key ? '#7C5CFC' : 'rgba(255,255,255,0.05)',
                    color: tab === t.key ? '#fff' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s'
                  }}>{t.label}</button>
                ))}
              </div>

              {/* ── Overview tab ── */}
              {tab === 'overview' && (
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
                    Detected Skills ({result.extracted_skills?.length || 0})
                  </div>
                  {(result.extracted_skills || []).length === 0 ? (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
                      No skills detected. Try uploading a richer resume with a proper Skills section.
                    </p>
                  ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                      {(result.extracted_skills || []).map(s => (
                        <span key={s} style={{
                          padding: '5px 14px', borderRadius: 20,
                          background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)',
                          color: '#A29BFE', fontSize: 13, fontWeight: 700, textTransform: 'capitalize'
                        }}>{s}</span>
                      ))}
                    </div>
                  )}

                  {/* Score breakdown */}
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14 }}>
                    Score Breakdown
                  </div>
                  {[
                    { label: 'Skill Coverage (50%)', val: Math.min((result.extracted_skills?.length || 0) / 15, 1) * 50, max: 50, color: '#7C5CFC' },
                    { label: 'Resume Sections (30%)', val: Object.values(fb?.sections || {}).filter(Boolean).length / 8 * 30, max: 30, color: '#06D6A0' },
                    { label: 'Content Length (20%)', val: Math.max(0, score - Math.min((result.extracted_skills?.length || 0) / 15, 1) * 50 - Object.values(fb?.sections || {}).filter(Boolean).length / 8 * 30), max: 20, color: '#FFD93D' },
                  ].map(b => (
                    <div key={b.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{b.label}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, color: b.color }}>{Math.max(0, b.val).toFixed(1)} / {b.max}</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 6 }}>
                        <div style={{ height: '100%', borderRadius: 6, background: b.color, width: `${Math.max(0, Math.min(b.val / b.max * 100, 100))}%`, transition: 'width 1s', boxShadow: `0 0 8px ${b.color}55` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Match JD tab ── */}
              {tab === 'match' && (
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0ABDE3', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 16 }}>
                    🎯 Job Description Matcher
                  </div>
                  <form onSubmit={matchJd} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
                    <textarea 
                      value={jd} onChange={e => setJd(e.target.value)} 
                      placeholder="Paste the Job Description here..." 
                      rows={5} required
                      style={{
                        width: '100%', padding: '12px 16px', background: 'rgba(255,255,255,0.05)',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, color: '#fff',
                        outline: 'none', transition: 'border-color 0.2s, box-shadow 0.2s', fontSize: 13, resize: 'vertical'
                      }}
                      onFocus={(e) => { e.target.style.borderColor = '#0ABDE3'; e.target.style.boxShadow = '0 0 0 3px rgba(10,189,227,0.15)'; }}
                      onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
                    />
                    <button type="submit" className="btn btn-primary" style={{ background: 'linear-gradient(135deg, #06D6A0, #0ABDE3)', border: 'none', justifyContent: 'center' }} disabled={matchLoading}>
                      {matchLoading ? '⏳ Matching...' : '✨ Calculate Match Score'}
                    </button>
                  </form>
                  
                  {matchResult && (
                    <div style={{ padding: 18, borderRadius: 12, background: 'rgba(10,189,227,0.06)', border: '1px solid rgba(10,189,227,0.15)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                        <div style={{ 
                          width: 60, height: 60, borderRadius: '50%', background: 'rgba(10,189,227,0.15)', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          fontSize: 20, fontWeight: 900, color: '#0ABDE3', flexShrink: 0
                        }}>
                          {matchResult.match_score}%
                        </div>
                        <div>
                          <div style={{ fontSize: 16, fontWeight: 800, color: '#0ABDE3', marginBottom: 2 }}>Match Score</div>
                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>Based on TF-IDF cosine similarity</div>
                        </div>
                      </div>
                      
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#06D6A0', marginBottom: 8 }}>✅ Matched Skills ({matchResult.matched_skills.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                        {matchResult.matched_skills.length > 0 ? matchResult.matched_skills.map(s => (
                          <span key={s} style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(6,214,160,0.1)', color: '#06D6A0', fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{s}</span>
                        )) : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>No direct skill matches found.</span>}
                      </div>
                      
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6B6B', marginBottom: 8 }}>❌ Missing Skills ({matchResult.missing_skills.length})</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {matchResult.missing_skills.length > 0 ? matchResult.missing_skills.map(s => (
                          <span key={s} style={{ padding: '4px 10px', borderRadius: 20, background: 'rgba(255,107,107,0.1)', color: '#FF6B6B', fontSize: 11, fontWeight: 700, textTransform: 'capitalize' }}>{s}</span>
                        )) : <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>You have all the required skills!</span>}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Sections tab ── */}
              {tab === 'sections' && fb?.sections && (
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    Resume Sections Check
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>
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
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#06D6A0', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
                    ✅ Your Strengths ({fb.strengths.length})
                  </div>
                  {fb.strengths.map((s, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                      background: 'rgba(6,214,160,0.06)', border: '1px solid rgba(6,214,160,0.15)'
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'rgba(6,214,160,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#06D6A0', fontSize: 13 }}>✓</div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{s}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Improve tab ── */}
              {tab === 'improve' && fb?.improvements && (
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#FF6B6B', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
                    🔧 What to Improve ({fb.improvements.length})
                  </div>
                  {fb.improvements.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 0' }}>
                      <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
                      <p style={{ color: '#06D6A0', fontWeight: 700 }}>No major improvements needed!</p>
                    </div>
                  ) : fb.improvements.map((imp, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                      background: 'rgba(255,107,107,0.06)', border: '1px solid rgba(255,107,107,0.15)'
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'rgba(255,107,107,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#FF6B6B', fontSize: 12 }}>{i + 1}</div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{imp}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* ── ATS tab ── */}
              {tab === 'ats' && fb?.ats_tips && (
                <div className="card">
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#7C5CFC', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
                    🤖 ATS Optimization Tips
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 18 }}>
                    ATS (Applicant Tracking System) scans your resume before a human sees it.
                  </p>
                  {fb.ats_tips.map((tip, i) => (
                    <div key={i} style={{
                      display: 'flex', gap: 12, alignItems: 'flex-start',
                      padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                      background: 'rgba(124,92,252,0.06)', border: '1px solid rgba(124,92,252,0.15)'
                    }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, background: 'rgba(124,92,252,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#7C5CFC', fontSize: 13 }}>→</div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>{tip}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 20, padding: '16px', borderRadius: 14, background: 'rgba(124,92,252,0.08)', border: '1px solid rgba(124,92,252,0.2)', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Estimated ATS Score</div>
                    <div style={{ fontFamily: 'Space Grotesk,sans-serif', fontSize: 32, fontWeight: 900, color: '#7C5CFC' }}>{score.toFixed(0)}%</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>Based on section coverage &amp; keyword density</div>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No resume yet */
            <div className="card" style={{ textAlign: 'center', padding: 60 }}>
              <div style={{ fontSize: 60, marginBottom: 20 }}>📄</div>
              <h3 style={{ fontFamily: 'Space Grotesk,sans-serif', fontWeight: 800, fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 10 }}>
                No resume analyzed yet
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14, lineHeight: 1.7 }}>
                Upload your PDF or DOCX resume to get:<br />
                AI skill extraction • Section checker • ATS tips • Improvement suggestions
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
