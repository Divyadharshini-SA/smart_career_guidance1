import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const TOPIC_CONFIG = {
  aptitude: {
    label: 'Quantitative Aptitude', icon: '📐', color: '#7C5CFC',
    gradient: 'linear-gradient(135deg,#7C5CFC,#a78bfa)',
    topics: [
      'Percentages', 'Profit & Loss', 'Time & Work', 'Speed, Distance & Time',
      'Simple & Compound Interest', 'Ratio & Proportion', 'Averages',
      'Mixtures & Alligations', 'Number System', 'HCF & LCM',
      'Permutation & Combination', 'Probability', 'Geometry & Mensuration',
      'Ages Problems', 'Calendar & Clocks', 'Pipes & Cisterns',
      'Partnership', 'Boats & Streams', 'Trains', 'Algebra',
    ]
  },
  logical: {
    label: 'Logical Reasoning', icon: '🧩', color: '#FF6B6B',
    gradient: 'linear-gradient(135deg,#FF6B6B,#ff8fab)',
    topics: [
      'Number Series', 'Letter Series', 'Syllogisms', 'Blood Relations',
      'Coding & Decoding', 'Direction Sense', 'Seating Arrangements',
      'Puzzles', 'Input & Output', 'Statements & Conclusions',
      'Analogies', 'Classification', 'Order & Ranking', 'Venn Diagrams',
    ]
  },
  verbal: {
    label: 'Verbal Ability', icon: '📝', color: '#06D6A0',
    gradient: 'linear-gradient(135deg,#06D6A0,#38f9d7)',
    topics: [
      'Synonyms & Antonyms', 'Sentence Correction', 'Fill in the Blanks',
      'Reading Comprehension', 'Idioms & Phrases', 'Para Jumbles',
      'Error Detection', 'One Word Substitution', 'Active & Passive Voice', 'Vocabulary',
    ]
  },
  technical: {
    label: 'Technical', icon: '💻', color: '#FFB347',
    gradient: 'linear-gradient(135deg,#FFB347,#ffcc02)',
    topics: [
      'Python', 'Java', 'C++', 'Data Structures', 'Algorithms',
      'DBMS', 'Operating System', 'Networking', 'OOP Concepts',
      'Web Technologies', 'Software Engineering', 'Cloud Computing',
    ]
  },
  soft_skill: {
    label: 'Soft Skills', icon: '🤝', color: '#4ECDC4',
    gradient: 'linear-gradient(135deg,#4ECDC4,#06D6A0)',
    topics: [
      'Communication', 'Leadership', 'Teamwork', 'Time Management',
      'Problem Solving', 'Critical Thinking', 'Emotional Intelligence',
      'Conflict Resolution', 'Presentation Skills', 'Work Ethics',
    ]
  }
};

const SECTION_TO_TYPE = {
  aptitude: 'aptitude', logical: 'aptitude', verbal: 'aptitude',
  technical: 'technical', soft_skill: 'soft_skill',
};

const getGrade = (p) => {
  if (p >= 85) return { label: 'Excellent', emoji: '🏆', color: '#06D6A0' };
  if (p >= 70) return { label: 'Good', emoji: '👍', color: '#7C5CFC' };
  if (p >= 55) return { label: 'Average', emoji: '📝', color: '#FFB347' };
  if (p >= 40) return { label: 'Poor', emoji: '⚠️', color: '#FF6B6B' };
  return { label: 'Very Poor', emoji: '❌', color: '#e53935' };
};

// ─────────────────────────────────────────────────────────────
// TopicAccordion — one row per topic, expand to show tests
// ─────────────────────────────────────────────────────────────
function TopicAccordion({ topic, count, cfg, completedTests, onStart, onViewResult, loading }) {
  const [open, setOpen] = useState(false);
  const numTests = count > 0 ? Math.ceil(count / 10) : 0;
  const done = completedTests.get(topic) || new Set();
  const doneCount = done.size;
  const allDone = numTests > 0 && doneCount >= numTests;

  return (
    <div style={{
      borderRadius: 12,
      border: `1.5px solid ${open ? cfg.color + '55' : 'rgba(255,255,255,0.07)'}`,
      overflow: 'hidden',
      background: open ? `${cfg.color}09` : 'transparent',
      transition: 'all 0.2s',
    }}>

      {/* ── Header row — always visible ── */}
      <div
        onClick={() => numTests > 0 && setOpen(o => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '14px 18px',
          cursor: numTests > 0 ? 'pointer' : 'default',
          gap: 12,
          userSelect: 'none',
        }}
      >
        {/* Accent bar */}
        <div style={{
          width: 3, height: 36, borderRadius: 3, flexShrink: 0,
          background: numTests > 0 ? cfg.color : 'rgba(255,255,255,0.1)',
        }} />

        {/* Topic info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700,
            fontSize: 14,
            color: numTests > 0 ? '#EEEEFF' : 'rgba(255,255,255,0.25)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {topic}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
            {numTests > 0
              ? `${count} questions · ${numTests} test${numTests > 1 ? 's' : ''}`
              : 'No questions uploaded yet'}
          </div>
        </div>

        {/* Right side badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          {numTests > 0 && doneCount > 0 && (
            <div style={{
              fontSize: 11, fontWeight: 700,
              color: allDone ? '#06D6A0' : cfg.color,
              background: allDone ? 'rgba(6,214,160,0.12)' : `${cfg.color}15`,
              border: `1px solid ${allDone ? 'rgba(6,214,160,0.3)' : `${cfg.color}30`}`,
              borderRadius: 20, padding: '3px 10px',
            }}>
              {allDone ? '✓ Complete' : `${doneCount}/${numTests} done`}
            </div>
          )}
          {numTests > 0 && (
            <div style={{
              fontSize: 11,
              color: open ? cfg.color : 'rgba(255,255,255,0.2)',
              transition: 'transform 0.2s, color 0.2s',
              transform: open ? 'rotate(180deg)' : 'none',
              fontWeight: 800,
            }}>▼</div>
          )}
        </div>
      </div>

      {/* ── Expanded: test buttons ── */}
      {open && numTests > 0 && (
        <div style={{
          padding: '0 18px 16px 33px',
          borderTop: `1px dashed ${cfg.color}25`,
          paddingTop: 12,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600,
            color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase', letterSpacing: '0.8px',
            marginBottom: 10,
          }}>
            Choose a test
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Array.from({ length: numTests }, (_, i) => i + 1).map(idx => {
              const isDone = done.has(idx);
              return (
                <button
                  key={idx}
                  disabled={loading}
                  onClick={e => { e.stopPropagation(); isDone ? onViewResult(topic, idx) : onStart(topic, idx); }}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 8,
                    border: `1.5px solid ${isDone ? 'rgba(6,214,160,0.45)' : `${cfg.color}45`}`,
                    background: isDone ? 'rgba(6,214,160,0.1)' : `${cfg.color}10`,
                    color: isDone ? '#06D6A0' : cfg.color,
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: loading ? 'wait' : 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s',
                    display: 'flex', alignItems: 'center', gap: 5,
                  }}
                  onMouseEnter={e => {
                    if (!loading) {
                      e.currentTarget.style.background = isDone ? 'rgba(6,214,160,0.2)' : `${cfg.color}25`;
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = isDone ? 'rgba(6,214,160,0.1)' : `${cfg.color}10`;
                    e.currentTarget.style.transform = 'none';
                  }}
                >
                  {isDone && <span style={{ fontSize: 10 }}>✓</span>}
                  Test {idx}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Assessment component
// ─────────────────────────────────────────────────────────────
export default function Assessment() {
  const [screen, setScreen] = useState('home');
  const [section, setSection] = useState(null);
  const [selTopic, setSelTopic] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answered, setAnswered] = useState(0);
  const [topicCounts, setTopicCounts] = useState({});
  const [currentTestIndex, setCurrentTestIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const Q_PER_PAGE = 10;

  const [timeLeft, setTimeLeft] = useState(0);
  const [timerOn, setTimerOn] = useState(false);
  const timerRef = React.useRef(null);

  useEffect(() => { setAnswered(Object.keys(answers).length); }, [answers]);
  useEffect(() => {
    API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
  }, []);
  useEffect(() => {
    if (section) {
      API.get(`/assessment/topic-counts/${SECTION_TO_TYPE[section]}`)
        .then(r => setTopicCounts(r.data)).catch(() => { });
    }
  }, [section]);

  const completedTests = React.useMemo(() => {
    const map = new Map();
    history.forEach(h => {
      if (h.scores?._topic) {
        const t = h.scores._topic, idx = h.scores._test_index;
        if (!map.has(t)) map.set(t, new Set());
        if (idx !== undefined) map.get(t).add(idx);
      }
    });
    return map;
  }, [history]);

  // Timer
  useEffect(() => {
    if (!timerOn) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current); setTimerOn(false);
          toast.warning('⏰ Time\'s up! Auto-submitting...');
          handleAutoSubmit(); return 0;
        }
        if (t === 120) toast.warning('⚠️ 2 minutes remaining!');
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const startTimer = n => { setTimeLeft(Math.min(Math.max(n * 60, 300), 900)); setTimerOn(true); };
  const stopTimer = () => { clearInterval(timerRef.current); setTimerOn(false); };
  const fmtTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const timerColor = timeLeft <= 60 ? '#FF6B6B' : timeLeft <= 120 ? '#FFD93D' : '#06D6A0';

  const handleAutoSubmit = async () => {
    setLoading(true);
    try {
      const payload = { type: SECTION_TO_TYPE[section] || 'aptitude', answers };
      if (selTopic !== 'General') { payload.topic = selTopic; payload.test_index = currentTestIndex; }
      const res = await API.post('/assessment/submit', payload);
      setResult(res.data); setScreen('result');
      toast.success('Auto-submitted! 🎉');
      API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
    } catch { toast.error('Submission failed'); }
    finally { setLoading(false); }
  };

  const startTopicTest = async (topic, tIndex = 1) => {
    setLoading(true); setSelTopic(topic); setCurrentTestIndex(tIndex);
    try {
      const res = await API.get(`/assessment/questions/${SECTION_TO_TYPE[section]}`, {
        params: { topic, count: 10, skip: (tIndex - 1) * 10 }
      });
      if (!res.data.questions?.length) { toast.warning(`No questions for "${topic}".`); setLoading(false); return; }
      setQuestions(res.data.questions); setAnswers({}); setResult(null);
      setCurrentPage(0); setScreen('quiz'); startTimer(res.data.questions.length);
    } catch (err) {
      toast.warning(err.response?.status === 404 ? `No questions uploaded for "${topic}" yet.` : 'Failed to load questions');
    }
    finally { setLoading(false); }
  };

  const startGeneralTest = async sec => {
    setLoading(true); setSelTopic('General'); setCurrentTestIndex(null);
    try {
      const res = await API.get(`/assessment/questions/${SECTION_TO_TYPE[sec]}`, { params: { count: 20 } });
      if (!res.data.questions?.length) { toast.warning('No questions found.'); setLoading(false); return; }
      setQuestions(res.data.questions); setAnswers({}); setResult(null);
      setCurrentPage(0); setScreen('quiz'); startTimer(res.data.questions.length);
    } catch { toast.error('Failed to load questions'); }
    finally { setLoading(false); }
  };

  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.warning(`Answer all ${questions.length} questions!`); return;
    }
    stopTimer(); setLoading(true);
    try {
      const payload = { type: SECTION_TO_TYPE[section], answers };
      if (selTopic !== 'General') { payload.topic = selTopic; payload.test_index = currentTestIndex; }
      const res = await API.post('/assessment/submit', payload);
      setResult(res.data); setScreen('result');
      toast.success('Submitted! 🎉');
      API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
    } catch { toast.error('Submission failed'); }
    finally { setLoading(false); }
  };

  const viewResult = (topic, testIndex) => {
    const match = history.find(h => h.scores?._topic === topic && h.scores?._test_index === testIndex);
    if (match) {
      setResult({ percentage: match.percentage, score: Math.round((match.percentage / 100) * 10), total: 10, topic_scores: { [topic]: match.percentage }, ...match });
      setSelTopic(topic); setScreen('result');
    } else toast.error('Result not found');
  };

  const reset = () => {
    stopTimer(); setTimeLeft(0); setSearchQuery('');
    setScreen('home'); setSection(null); setSelTopic(null); setCurrentTestIndex(null);
    setQuestions([]); setAnswers({}); setResult(null); setCurrentPage(0);
  };

  // ══════════════════════════════════════════════════════
  // RESULT SCREEN
  // ══════════════════════════════════════════════════════
  if (screen === 'result' && result) {
    const grade = getGrade(result.percentage);
    const cfg = TOPIC_CONFIG[section] || TOPIC_CONFIG.aptitude;
    return (
      <div style={{ maxWidth: 660 }}>
        <button onClick={() => setScreen('topics')} style={{
          background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
          padding: '6px 14px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
          fontSize: 13, fontWeight: 600, marginBottom: 20, fontFamily: 'inherit',
        }}>← Back to Topics</button>

        <div style={{
          background: `${grade.color}10`,
          border: `1.5px solid ${grade.color}35`,
          borderRadius: 20, padding: '32px 28px', textAlign: 'center', marginBottom: 16,
        }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>{grade.emoji}</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
            {result.percentage?.toFixed(0)}%
          </div>
          <div style={{ fontWeight: 700, color: grade.color, margin: '6px 0 4px', fontSize: 16 }}>{grade.label}</div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{result.score} / {result.total} correct</div>
          <div style={{ marginTop: 16, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 6, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${result.percentage}%`, background: grade.color, borderRadius: 6, transition: 'width 1s' }} />
          </div>
        </div>

        {Object.entries(result.topic_scores || {}).filter(([k]) => !k.startsWith('_')).length > 0 && (
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Topic Breakdown</div>
            {Object.entries(result.topic_scores).filter(([k]) => !k.startsWith('_')).map(([t, s]) => (
              <div key={t} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{t}</span>
                  <span style={{ fontWeight: 800, fontSize: 13, color: cfg.color }}>{s}%</span>
                </div>
                <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                  <div style={{ height: '100%', borderRadius: 4, background: cfg.color, width: `${s}%`, transition: 'width 0.8s' }} />
                </div>
              </div>
            ))}
          </div>
        )}

        {result.review?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Review</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.review.map((r, i) => {
                const correct = r.chosen?.trim() === r.correct?.trim();
                return (
                  <div key={i} style={{
                    background: correct ? 'rgba(6,214,160,0.05)' : 'rgba(255,107,107,0.05)',
                    border: `1px solid ${correct ? 'rgba(6,214,160,0.2)' : 'rgba(255,107,107,0.2)'}`,
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.4, color: '#EEEEFF' }}>Q{i + 1}: {r.question}</p>
                    <div style={{ fontSize: 12, color: correct ? '#06D6A0' : '#FF6B6B' }}>Your answer: <strong>{r.chosen}</strong></div>
                    {!correct && <div style={{ fontSize: 12, color: '#06D6A0', marginTop: 3 }}>Correct: <strong>{r.correct}</strong></div>}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={() => startTopicTest(selTopic, currentTestIndex || 1)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>🔁 Retake</button>
          <button onClick={() => setScreen('topics')} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>📚 Topics</button>
          <button onClick={reset} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>🏠 Home</button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ══════════════════════════════════════════════════════
  if (screen === 'quiz' && questions.length) {
    const cfg = TOPIC_CONFIG[section] || TOPIC_CONFIG.aptitude;
    const totalPages = Math.ceil(questions.length / Q_PER_PAGE);
    const visible = questions.slice(currentPage * Q_PER_PAGE, (currentPage + 1) * Q_PER_PAGE);

    return (
      <div style={{ maxWidth: 720 }}>
        {/* Quiz header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
              {cfg.icon} {cfg.label}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 19, color: '#EEEEFF', margin: 0 }}>{selTopic}</h2>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
              {questions.length} questions{currentTestIndex ? ` · Test ${currentTestIndex}` : ''}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              padding: '7px 14px', borderRadius: 10,
              background: `${timerColor}15`, border: `1.5px solid ${timerColor}40`,
              color: timerColor, fontWeight: 900, fontSize: 16,
              fontFamily: 'monospace',
              boxShadow: timeLeft <= 60 ? `0 0 12px ${timerColor}40` : 'none',
            }}>
              ⏱ {fmtTime(timeLeft)}
            </div>
            <div style={{
              padding: '7px 12px', borderRadius: 10,
              background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)',
              color: '#A29BFE', fontWeight: 800, fontSize: 13,
            }}>
              {answered}/{questions.length}
            </div>
          </div>
        </div>

        {/* Progress */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 20 }}>
          <div style={{ height: '100%', borderRadius: 4, background: cfg.color, width: `${(answered / questions.length) * 100}%`, transition: 'width 0.3s' }} />
        </div>

        {/* Page dots */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => setCurrentPage(i)} style={{
                width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
                fontWeight: 700, fontSize: 11, fontFamily: 'inherit',
                background: i === currentPage ? cfg.color : 'rgba(255,255,255,0.07)',
                color: i === currentPage ? '#fff' : 'rgba(255,255,255,0.3)',
              }}>{i + 1}</button>
            ))}
          </div>
        )}

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visible.map((q, idx) => {
            const ai = currentPage * Q_PER_PAGE + idx;
            return (
              <div key={q.id} style={{
                background: answers[q.id] ? `${cfg.color}08` : 'rgba(255,255,255,0.02)',
                border: `1.5px solid ${answers[q.id] ? `${cfg.color}40` : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 14, padding: '18px 18px', transition: 'all 0.15s',
              }}>
                <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, lineHeight: 1.6, color: '#EEEEFF' }}>
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: 22, height: 22, borderRadius: 5, marginRight: 8,
                    background: cfg.color, color: '#fff', fontSize: 11, fontWeight: 900, flexShrink: 0,
                  }}>{ai + 1}</span>
                  {q.question}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {q.options.map((opt, oi) => {
                    const chosen = answers[q.id] === opt;
                    return (
                      <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{
                        padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                        border: `1.5px solid ${chosen ? cfg.color : 'rgba(255,255,255,0.08)'}`,
                        background: chosen ? `${cfg.color}18` : 'rgba(255,255,255,0.02)',
                        color: chosen ? cfg.color : 'rgba(255,255,255,0.6)',
                        fontWeight: chosen ? 700 : 500, fontSize: 13,
                        textAlign: 'left', fontFamily: 'inherit',
                        display: 'flex', alignItems: 'center', gap: 7,
                        transition: 'all 0.12s',
                      }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                          background: chosen ? cfg.color : 'rgba(255,255,255,0.06)',
                          color: chosen ? '#fff' : 'rgba(255,255,255,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 800,
                        }}>{['A', 'B', 'C', 'D'][oi]}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {currentPage > 0
            ? <button className="btn btn-outline" onClick={() => setCurrentPage(c => c - 1)} style={{ padding: '12px 18px' }}>← Prev</button>
            : <button className="btn btn-outline" onClick={() => { stopTimer(); setScreen('topics'); }} style={{ padding: '12px 18px' }}>← Quit</button>
          }
          {currentPage < totalPages - 1
            ? <button className="btn btn-primary" onClick={() => setCurrentPage(c => c + 1)} style={{ flex: 1, justifyContent: 'center' }}>Next →</button>
            : <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg,#06D6A0,#04B486)' }}>
              {loading ? '⏳ Submitting...' : `✅ Submit (${answered}/${questions.length})`}
            </button>
          }
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // TOPIC PICKER — accordion list
  // ══════════════════════════════════════════════════════
  if (screen === 'topics' && section) {
    const cfg = TOPIC_CONFIG[section];
    const filtered = cfg.topics.filter(t =>
      t.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalQs = Object.values(topicCounts).reduce((a, b) => a + b, 0);

    return (
      <div style={{ maxWidth: 820 }}>

        {/* Breadcrumb */}
        <button onClick={reset} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600,
          padding: 0, fontFamily: 'inherit', marginBottom: 18,
          display: 'flex', alignItems: 'center', gap: 5,
        }}>
          ← Assessment Center
        </button>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{cfg.icon}</div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 21, color: '#EEEEFF', margin: 0 }}>{cfg.label}</h1>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
              {cfg.topics.length} topics · {totalQs} total questions
            </div>
          </div>
        </div>

        {/* Mixed test banner */}
        <div
          onClick={() => !loading && startGeneralTest(section)}
          style={{
            background: cfg.gradient,
            borderRadius: 14, padding: '16px 22px',
            margin: '18px 0',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: `0 4px 18px ${cfg.color}30`,
            transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}45`; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 18px ${cfg.color}30`; }}
        >
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>🎯 Full Mixed Test</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
              20 random questions from all {cfg.topics.length} topics
            </div>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.22)', borderRadius: 8,
            padding: '6px 14px', color: '#fff', fontWeight: 800, fontSize: 13,
          }}>
            {loading ? '...' : 'Start →'}
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 14 }}>
          <span style={{
            position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
            fontSize: 14, color: 'rgba(255,255,255,0.25)',
          }}>🔍</span>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            style={{
              width: '100%', padding: '9px 12px 9px 34px',
              borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.09)',
              background: 'rgba(255,255,255,0.04)', color: '#EEEEFF',
              fontSize: 13, fontFamily: 'inherit', outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Topics label */}
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: 'rgba(255,255,255,0.22)',
          textTransform: 'uppercase', letterSpacing: '0.8px',
          marginBottom: 8,
        }}>
          📚 Topic-wise Practice — {filtered.length} topics
        </div>

        {/* Accordion list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {filtered.map(topic => (
            <TopicAccordion
              key={topic}
              topic={topic}
              count={topicCounts[topic] || 0}
              cfg={cfg}
              completedTests={completedTests}
              onStart={startTopicTest}
              onViewResult={viewResult}
              loading={loading}
            />
          ))}
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
              No topics match "{searchQuery}"
            </div>
          )}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
            ⏳ Loading questions...
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // HOME — section cards
  // ══════════════════════════════════════════════════════
  return (
    <div style={{ maxWidth: 920 }}>
      <h1 style={{ fontWeight: 800, fontSize: 24, color: '#EEEEFF', marginBottom: 6 }}>
        📝 Assessment Center
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 28, fontSize: 14 }}>
        Choose a category, then pick a topic to start practicing
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
        {Object.entries(TOPIC_CONFIG).map(([key, cfg]) => (
          <div key={key}
            onClick={() => { setSection(key); setScreen('topics'); setTopicCounts({}); setSearchQuery(''); }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${cfg.color}20`,
              borderRadius: 16, padding: '22px 20px', cursor: 'pointer',
              transition: 'all 0.18s', position: 'relative', overflow: 'hidden',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = `${cfg.color}50`;
              e.currentTarget.style.background = `${cfg.color}08`;
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 10px 28px ${cfg.color}15`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = `${cfg.color}20`;
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Glow */}
            <div style={{
              position: 'absolute', top: -16, right: -16, width: 70, height: 70,
              borderRadius: '50%', background: `${cfg.color}10`, filter: 'blur(18px)', pointerEvents: 'none',
            }} />

            <div style={{ fontSize: 28, marginBottom: 12 }}>{cfg.icon}</div>
            <h3 style={{ fontWeight: 800, color: cfg.color, fontSize: 14, marginBottom: 5 }}>{cfg.label}</h3>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginBottom: 14 }}>
              {cfg.topics.length} topics
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
              {cfg.topics.slice(0, 3).map(t => (
                <span key={t} style={{
                  background: `${cfg.color}10`, color: cfg.color,
                  border: `1px solid ${cfg.color}20`,
                  borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 600,
                }}>{t}</span>
              ))}
              <span style={{
                background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)',
                borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 600,
              }}>+{cfg.topics.length - 3}</span>
            </div>
            <div style={{
              background: cfg.gradient, borderRadius: 8, padding: '9px 0',
              textAlign: 'center', fontWeight: 800, fontSize: 12, color: '#fff',
            }}>
              Open →
            </div>
          </div>
        ))}
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
            Recent Tests
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.slice(0, 5).map((h, i) => {
              const pct = h.percentage || 0;
              const col = pct >= 70 ? '#06D6A0' : pct >= 50 ? '#FFD93D' : '#FF6B6B';
              return (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 14px', borderRadius: 9,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
                    {h.type?.replace('_', ' ')}{h.scores?._topic ? ` · ${h.scores._topic}` : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 800, color: col, fontSize: 14 }}>{pct.toFixed(0)}%</span>
                    <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
                      {new Date(h.taken_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// // ── All topics hardcoded (matches your CSV questions) ─────────
// const TOPIC_CONFIG = {
//   aptitude: {
//     label: '📐 Quantitative Aptitude',
//     color: '#6C63FF',
//     topics: [
//       'Percentages', 'Profit & Loss', 'Time & Work', 'Speed, Distance & Time',
//       'Simple & Compound Interest', 'Ratio & Proportion', 'Averages',
//       'Mixtures & Alligations', 'Number System', 'HCF & LCM',
//       'Permutation & Combination', 'Probability', 'Geometry & Mensuration',
//       'Ages Problems', 'Calendar & Clocks', 'Pipes & Cisterns',
//       'Partnership', 'Boats & Streams', 'Trains', 'Algebra',
//     ]
//   },
//   logical: {
//     label: '🧩 Logical Reasoning',
//     color: '#FF6584',
//     topics: [
//       'Number Series', 'Letter Series', 'Syllogisms', 'Blood Relations',
//       'Coding & Decoding', 'Direction Sense', 'Seating Arrangements',
//       'Puzzles', 'Input & Output', 'Statements & Conclusions',
//       'Analogies', 'Classification', 'Order & Ranking', 'Venn Diagrams',
//     ]
//   },
//   verbal: {
//     label: '📝 Verbal Ability',
//     color: '#43E97B',
//     topics: [
//       'Synonyms & Antonyms', 'Sentence Correction', 'Fill in the Blanks',
//       'Reading Comprehension', 'Idioms & Phrases', 'Para Jumbles',
//       'Error Detection', 'One Word Substitution',
//       'Active & Passive Voice', 'Vocabulary',
//     ]
//   },
//   technical: {
//     label: '💻 Technical',
//     color: '#F9A825',
//     topics: [
//       'Python', 'Java', 'C++', 'Data Structures', 'Algorithms',
//       'DBMS', 'Operating System', 'Networking', 'OOP Concepts',
//       'Web Technologies', 'Software Engineering', 'Cloud Computing',
//     ]
//   },
//   soft_skill: {
//     label: '🤝 Soft Skills',
//     color: '#29B6F6',
//     topics: [
//       'Communication', 'Leadership', 'Teamwork', 'Time Management',
//       'Problem Solving', 'Critical Thinking', 'Emotional Intelligence',
//       'Conflict Resolution', 'Presentation Skills', 'Work Ethics',
//     ]
//   }
// };

// // Map section → test_type for API
// const SECTION_TO_TYPE = {
//   aptitude: 'aptitude',
//   logical: 'aptitude',
//   verbal: 'aptitude',
//   technical: 'technical',
//   soft_skill: 'soft_skill',
// };

// const getGrade = (p) => {
//   if (p >= 85) return { label: 'Excellent 🏆', color: '#43E97B' };
//   if (p >= 70) return { label: 'Good 👍', color: '#6C63FF' };
//   if (p >= 55) return { label: 'Average 📝', color: '#F9A825' };
//   if (p >= 40) return { label: 'Poor ⚠️', color: '#FF6584' };
//   return { label: 'Very Poor ❌', color: '#E53935' };
// };

// export default function Assessment() {
//   const [screen, setScreen] = useState('home');
//   const [section, setSection] = useState(null);
//   const [selTopic, setSelTopic] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [result, setResult] = useState(null);
//   const [history, setHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [answered, setAnswered] = useState(0);
//   const [topicCounts, setTopicCounts] = useState({});
//   const [currentTestIndex, setCurrentTestIndex] = useState(null);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(0);
//   const Q_PER_PAGE = 10;

//   // Timer state
//   const [timeLeft, setTimeLeft] = useState(0);
//   const [timerOn, setTimerOn] = useState(false);
//   const timerRef = React.useRef(null);

//   // Count answered
//   useEffect(() => { setAnswered(Object.keys(answers).length); }, [answers]);

//   // Fetch history on mount
//   useEffect(() => {
//     API.get('/assessment/history')
//       .then(res => setHistory(res.data))
//       .catch(() => { });
//   }, []);

//   // Fetch topic counts when section changes
//   useEffect(() => {
//     if (section) {
//       const type = SECTION_TO_TYPE[section];
//       API.get(`/assessment/topic-counts/${type}`)
//         .then(res => setTopicCounts(res.data))
//         .catch(() => { });
//     }
//   }, [section]);

//   // Compute completed topics from history
//   const completedTests = React.useMemo(() => {
//     const map = new Map();
//     history.forEach(h => {
//       if (h.scores && h.scores._topic) {
//         const t = h.scores._topic;
//         const idx = h.scores._test_index;
//         if (!map.has(t)) map.set(t, new Set());
//         if (idx !== undefined) map.get(t).add(idx);
//       }
//     });
//     return map;
//   }, [history]);

//   const viewResult = (topic, testIndex) => {
//     const match = history.find(h => h.scores?._topic === topic && h.scores?._test_index === testIndex);
//     if (match) {
//       // Create a mock result object that works with the result screen
//       const totalQs = 10;
//       setResult({
//         percentage: match.percentage,
//         score: Math.round((match.percentage / 100) * totalQs),
//         total: totalQs,
//         topic_scores: { [topic]: match.percentage }, // approximate
//         ...match
//       });
//       setSelTopic(topic);
//       setSection(section);
//       setScreen('result');
//     } else {
//       toast.error('Result not found');
//     }
//   };

//   // Timer tick - auto submit when 0
//   useEffect(() => {
//     if (!timerOn) return;
//     timerRef.current = setInterval(() => {
//       setTimeLeft(t => {
//         if (t <= 1) {
//           clearInterval(timerRef.current);
//           setTimerOn(false);
//           toast.warning('⏰ Time is up! Auto-submitting...');
//           handleAutoSubmit();
//           return 0;
//         }
//         if (t === 120) toast.warning('⚠️ 2 minutes remaining!');
//         return t - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timerRef.current);
//   }, [timerOn]);

//   const startTimer = (numQ) => {
//     const secs = Math.min(Math.max(numQ * 60, 300), 900);
//     setTimeLeft(secs);
//     setTimerOn(true);
//   };

//   const stopTimer = () => { clearInterval(timerRef.current); setTimerOn(false); };

//   const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

//   const timerColor = timeLeft <= 60 ? '#FF6B6B' : timeLeft <= 120 ? '#FFD93D' : '#06D6A0';

//   const handleAutoSubmit = async () => {
//     setLoading(true);
//     try {
//       const testType = SECTION_TO_TYPE[section] || 'aptitude';
//       const payload = { type: testType, answers };
//       if (selTopic !== 'General') {
//         payload.topic = selTopic;
//         payload.test_index = currentTestIndex;
//       }
//       const res = await API.post('/assessment/submit', payload);
//       setResult(res.data);
//       setScreen('result');
//       toast.success('Auto-submitted! 🎉');

//       // refresh history
//       API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
//     } catch { toast.error('Submission failed'); }
//     finally { setLoading(false); }
//   };

//   // ── Start topic test ───────────────────────────────────────
//   const startTopicTest = async (topic, tIndex = 1) => {
//     setLoading(true);
//     setSelTopic(topic);
//     setCurrentTestIndex(tIndex);
//     const testType = SECTION_TO_TYPE[section];
//     const skip = (tIndex - 1) * 10;
//     try {
//       const res = await API.get(`/assessment/questions/${testType}`, {
//         params: { topic, count: 10, skip }
//       });
//       if (!res.data.questions?.length) {
//         toast.warning(`No questions found for "${topic}". Please upload questions first.`);
//         setLoading(false); return;
//       }
//       setQuestions(res.data.questions);
//       setAnswers({});
//       setResult(null);
//       setCurrentPage(0);
//       setScreen('quiz');
//       startTimer(res.data.questions.length);
//     } catch (err) {
//       if (err.response?.status === 404) {
//         toast.warning(`No questions uploaded yet for "${topic}". Ask admin to upload questions for this topic.`);
//       } else {
//         toast.error('Failed to load questions');
//       }
//     }
//     finally { setLoading(false); }
//   };

//   // ── Start general test (all topics) ───────────────────────
//   const startGeneralTest = async (sec) => {
//     setLoading(true);
//     setSelTopic('General');
//     setCurrentTestIndex(null);
//     const testType = SECTION_TO_TYPE[sec];
//     try {
//       const res = await API.get(`/assessment/questions/${testType}`, {
//         params: { count: 20 }
//       });
//       if (!res.data.questions?.length) {
//         toast.warning('No questions found. Please upload questions first.');
//         setLoading(false); return;
//       }
//       setQuestions(res.data.questions);
//       setAnswers({});
//       setResult(null);
//       setCurrentPage(0);
//       setScreen('quiz');
//       startTimer(res.data.questions.length);
//     } catch { toast.error('Failed to load questions'); }
//     finally { setLoading(false); }
//   };

//   // ── Submit ─────────────────────────────────────────────────
//   const submit = async () => {
//     if (Object.keys(answers).length < questions.length) {
//       toast.warning(`Please answer all ${questions.length} questions!`); return;
//     }
//     stopTimer();
//     setLoading(true);
//     try {
//       const testType = SECTION_TO_TYPE[section];
//       const payload = { type: testType, answers };
//       if (selTopic !== 'General') {
//         payload.topic = selTopic;
//         payload.test_index = currentTestIndex;
//       }
//       const res = await API.post('/assessment/submit', payload);
//       setResult(res.data);
//       setScreen('result');
//       toast.success('Assessment submitted! 🎉');

//       // refresh history
//       API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
//     } catch { toast.error('Submission failed'); }
//     finally { setLoading(false); }
//   };

//   // ── Reset ──────────────────────────────────────────────────
//   const reset = () => {
//     stopTimer(); setTimeLeft(0);
//     setScreen('home'); setSection(null); setSelTopic(null); setCurrentTestIndex(null);
//     setQuestions([]); setAnswers({}); setResult(null); setCurrentPage(0);
//   };

//   // ═══════════════════════════════════════════════════════════
//   // SCREEN: RESULT
//   // ═══════════════════════════════════════════════════════════
//   if (screen === 'result' && result) {
//     const grade = getGrade(result.percentage);
//     return (
//       <div style={{ maxWidth: 700 }}>
//         <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 6 }}>🎉 Test Complete!</h1>
//         <p style={{ color: '#7A7A9D', marginBottom: 28 }}>
//           {selTopic} — {TOPIC_CONFIG[section]?.label}
//         </p>

//         {/* Score card */}
//         <div style={{
//           background: `linear-gradient(135deg,${grade.color}22,${grade.color}08)`,
//           border: `2px solid ${grade.color}44`,
//           borderRadius: 24, padding: 36, textAlign: 'center', marginBottom: 24
//         }}>
//           <div style={{ fontSize: 72, marginBottom: 8 }}>
//             {result.percentage >= 85 ? '🏆' : result.percentage >= 70 ? '👍' : result.percentage >= 55 ? '📝' : '📚'}
//           </div>
//           <div style={{ fontSize: 56, fontWeight: 900, color: grade.color }}>
//             {result.percentage?.toFixed(1)}%
//           </div>
//           <div style={{ fontSize: 20, fontWeight: 800, color: grade.color, marginBottom: 8 }}>
//             {grade.label}
//           </div>
//           <p style={{ color: '#7A7A9D', fontSize: 16 }}>
//             {result.score} correct out of {result.total} questions
//           </p>
//           {/* Score bar */}
//           <div style={{ marginTop: 20, height: 12, background: '#E0E7FF', borderRadius: 10 }}>
//             <div style={{
//               height: '100%', borderRadius: 10,
//               width: `${result.percentage}%`,
//               background: grade.color, transition: 'width 1s'
//             }} />
//           </div>
//         </div>

//         {/* Topic breakdown */}
//         {Object.keys(result.topic_scores || {}).length > 0 && (
//           <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24, marginBottom: 24, border: '1px solid rgba(255,255,255,0.08)' }}>
//             <h3 style={{ fontWeight: 900, marginBottom: 16 }}>📊 Topic-wise Scores</h3>
//             {Object.entries(result.topic_scores).map(([t, s]) => (
//               <div key={t} style={{ marginBottom: 12 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
//                   <span style={{ fontWeight: 700, fontSize: 14, textTransform: 'capitalize' }}>{t}</span>
//                   <span style={{ fontWeight: 900, color: '#6C63FF' }}>{s}%</span>
//                 </div>
//                 <div style={{ height: 8, background: '#F0EEFF', borderRadius: 8 }}>
//                   <div style={{ height: '100%', borderRadius: 8, background: '#6C63FF', width: `${s}%` }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Review Answers */}
//         {result.review && result.review.length > 0 && (
//           <div style={{ marginBottom: 32 }}>
//             <h3 style={{ fontWeight: 900, marginBottom: 16, fontSize: 20 }}>📝 Question Review</h3>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//               {result.review.map((r, i) => {
//                 const isCorrect = r.chosen.trim() === r.correct.trim();
//                 return (
//                   <div key={i} style={{
//                     background: 'rgba(255,255,255,0.02)', borderRadius: 16, padding: '16px 20px',
//                     borderLeft: `4px solid ${isCorrect ? '#06D6A0' : '#FF6B6B'}`
//                   }}>
//                     <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, lineHeight: 1.4 }}>Q{i + 1}: {r.question}</p>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
//                       <div style={{ color: isCorrect ? '#06D6A0' : '#FF6B6B' }}>
//                         <span style={{ opacity: 0.7 }}>Your Answer: </span> {r.chosen}
//                       </div>
//                       {!isCorrect && (
//                         <div style={{ color: '#06D6A0' }}>
//                           <span style={{ opacity: 0.7 }}>Correct Answer: </span> {r.correct}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>
//           </div>
//         )}

//         <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
//           <button className="btn btn-primary" onClick={() => startTopicTest(selTopic)} style={{ flex: 1 }}>
//             🔁 Retake Test
//           </button>
//           <button className="btn btn-outline" onClick={() => setScreen('topics')} style={{ flex: 1 }}>
//             📚 Try Another Topic
//           </button>
//           <button className="btn btn-outline" onClick={reset} style={{ flex: 1 }}>
//             🏠 Back to Home
//           </button>
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════
//   // SCREEN: QUIZ
//   if (screen === 'quiz' && questions.length) {
//     const cfg = TOPIC_CONFIG[section];
//     const totalPages = Math.ceil(questions.length / Q_PER_PAGE);
//     const visibleQuestions = questions.slice(currentPage * Q_PER_PAGE, (currentPage + 1) * Q_PER_PAGE);

//     return (
//       <div style={{ maxWidth: 720 }}>
//         {/* Header */}
//         <div style={{
//           display: 'flex', justifyContent: 'space-between', alignItems: 'center',
//           marginBottom: 20, flexWrap: 'wrap', gap: 12
//         }}>
//           <div>
//             <h1 style={{ fontWeight: 900, fontSize: 22, marginBottom: 2 }}>
//               {cfg?.label} — {selTopic}
//             </h1>
//             <p style={{ color: '#7A7A9D', fontSize: 14 }}>
//               {questions.length} questions • Answer all before submitting
//             </p>
//           </div>
//           <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
//             {/* Timer */}
//             <div style={{
//               display: 'flex', alignItems: 'center', gap: 8,
//               background: timeLeft <= 60 ? 'rgba(255,107,107,0.15)' : timeLeft <= 120 ? 'rgba(255,217,61,0.15)' : 'rgba(6,214,160,0.15)',
//               border: `2px solid ${timerColor}44`,
//               borderRadius: 14, padding: '8px 18px',
//               fontWeight: 900, color: timerColor, fontSize: 18,
//               fontFamily: 'Space Grotesk, monospace',
//               boxShadow: timeLeft <= 60 ? `0 0 16px ${timerColor}55` : 'none',
//               animation: timeLeft <= 60 ? 'pulse 1s infinite' : 'none',
//               minWidth: 100, justifyContent: 'center'
//             }}>
//               <span style={{ fontSize: 16 }}>⏱️</span>
//               {fmtTime(timeLeft)}
//             </div>
//             {/* Answered count */}
//             <div style={{
//               background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.25)',
//               borderRadius: 12, padding: '8px 16px',
//               fontWeight: 800, color: '#A29BFE', fontSize: 14
//             }}>
//               {answered}/{questions.length} answered
//             </div>
//           </div>
//         </div>

//         {/* Progress bar */}
//         <div style={{ height: 6, background: '#E0E7FF', borderRadius: 6, marginBottom: 28 }}>
//           <div style={{
//             height: '100%', borderRadius: 6, background: '#6C63FF',
//             width: `${(answered / questions.length) * 100}%`, transition: 'width 0.3s'
//           }} />
//         </div>

//         {/* Questions */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
//           {visibleQuestions.map((q, idx) => {
//             const actualIndex = (currentPage * Q_PER_PAGE) + idx;
//             return (
//               <div key={q.id} style={{
//                 background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 24,
//                 border: answers[q.id] ? '2px solid rgba(108,99,255,0.5)' : '1px solid rgba(255,255,255,0.08)'
//               }}>
//                 <p style={{ fontWeight: 800, fontSize: 15, marginBottom: 16, lineHeight: 1.5 }}>
//                   <span style={{
//                     display: 'inline-block', background: '#6C63FF', color: '#fff',
//                     borderRadius: 8, padding: '2px 10px', fontSize: 13,
//                     fontWeight: 900, marginRight: 10
//                   }}>Q{actualIndex + 1}</span>
//                   {q.question}
//                 </p>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
//                   {q.options.map((opt, oi) => {
//                     const labels = ['A', 'B', 'C', 'D'];
//                     const chosen = answers[q.id] === opt;
//                     return (
//                       <button key={opt}
//                         onClick={() => setAnswers({ ...answers, [q.id]: opt })}
//                         style={{
//                           padding: '12px 14px', borderRadius: 12, border: '2px solid',
//                           borderColor: chosen ? '#6C63FF' : 'rgba(255,255,255,0.1)',
//                           background: chosen ? '#6C63FF' : 'rgba(255,255,255,0.03)',
//                           color: chosen ? '#fff' : '#F0F0FF',
//                           fontWeight: chosen ? 800 : 600,
//                           cursor: 'pointer', fontSize: 14,
//                           textAlign: 'left', fontFamily: 'Nunito,sans-serif',
//                           display: 'flex', alignItems: 'center', gap: 10,
//                           transition: 'all 0.15s'
//                         }}>
//                         <span style={{
//                           width: 24, height: 24, borderRadius: 6, flexShrink: 0,
//                           background: chosen ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           fontWeight: 900, fontSize: 12,
//                           color: chosen ? '#fff' : '#6C63FF'
//                         }}>{labels[oi]}</span>
//                         {opt}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Pagination & Submit */}
//         <div style={{ display: 'flex', gap: 12, marginTop: 28 }}>
//           {currentPage > 0 ? (
//             <button className="btn btn-outline" onClick={() => setCurrentPage(c => c - 1)} style={{ padding: '14px 20px', minWidth: 100 }}>
//               ← Previous
//             </button>
//           ) : (
//             <button className="btn btn-outline" onClick={() => setScreen('topics')} style={{ padding: '14px 20px', minWidth: 100 }}>
//               ← Quit
//             </button>
//           )}

//           {currentPage < totalPages - 1 ? (
//             <button className="btn btn-primary" onClick={() => setCurrentPage(c => c + 1)} style={{ flex: 1, justifyContent: 'center', fontSize: 16, padding: '14px 0' }}>
//               Next Page →
//             </button>
//           ) : (
//             <button className="btn btn-primary"
//               onClick={submit} disabled={loading}
//               style={{ flex: 1, justifyContent: 'center', fontSize: 16, padding: '14px 0', background: 'linear-gradient(135deg, #06D6A0, #04B486)' }}>
//               {loading ? '⏳ Submitting...' : `✅ Submit Assessment (${answered}/${questions.length})`}
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════
//   // SCREEN: TOPIC PICKER
//   // ═══════════════════════════════════════════════════════════
//   if (screen === 'topics' && section) {
//     const cfg = TOPIC_CONFIG[section];
//     return (
//       <div style={{ maxWidth: 900 }}>
//         {/* Back + Header */}
//         <button onClick={() => setScreen('home')} style={{
//           background: 'none', border: 'none', cursor: 'pointer',
//           color: '#6C63FF', fontWeight: 700, fontSize: 15, marginBottom: 16,
//           display: 'flex', alignItems: 'center', gap: 6
//         }}>← Back</button>

//         <h1 style={{ fontWeight: 900, fontSize: 26, marginBottom: 4 }}>{cfg.label}</h1>
//         <p style={{ color: '#7A7A9D', marginBottom: 28, fontSize: 15 }}>
//           Select a topic to start a focused 10-question test
//         </p>

//         {/* General test button */}
//         <div onClick={() => startGeneralTest(section)} style={{
//           background: `linear-gradient(135deg,${cfg.color},${cfg.color}BB)`,
//           borderRadius: 18, padding: '20px 28px', marginBottom: 24,
//           cursor: 'pointer', color: '#fff', display: 'flex',
//           alignItems: 'center', justifyContent: 'space-between',
//           boxShadow: `0 6px 24px ${cfg.color}44`, transition: 'all 0.2s'
//         }}
//           onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
//           onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
//           <div>
//             <div style={{ fontWeight: 900, fontSize: 18 }}>🎯 Full Mixed Test</div>
//             <div style={{ opacity: 0.85, fontSize: 14, marginTop: 4 }}>
//               20 random questions from all topics
//             </div>
//           </div>
//           <div style={{ fontSize: 28 }}>→</div>
//         </div>

//         {/* Topic list */}
//         <h3 style={{ fontWeight: 900, fontSize: 16, marginBottom: 16, color: '#F0F0FF' }}>
//           📚 Topic-wise Practice ({cfg.topics.length} topics)
//         </h3>
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
//           {cfg.topics.map((topic, i) => {
//             const count = topicCounts[topic] || 0;
//             const numTests = Math.max(1, count > 0 ? Math.ceil(count / 10) : 0);
//             const completedForTopic = completedTests.get(topic) || new Set();

//             return (
//               <div key={topic} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 16, padding: '20px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
//                 <div>
//                   <h3 style={{ fontWeight: 800, fontSize: 18, color: '#F0F0FF', margin: '0 0 6px 0' }}>{topic}</h3>
//                   <div style={{ fontSize: 13, color: '#7A7A9D', fontWeight: 600 }}>{count} questions • {numTests} tests</div>
//                 </div>

//                 <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
//                   {numTests === 0 ? (
//                     <span style={{ fontSize: 14, color: '#7A7A9D' }}>No questions available</span>
//                   ) : (
//                     Array.from({ length: numTests }).map((_, idx) => {
//                       const testIndex = idx + 1;
//                       const isCompleted = completedForTopic.has(testIndex);

//                       return (
//                         <div key={testIndex} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//                           {isCompleted ? (
//                             <button onClick={() => viewResult(topic, testIndex)} style={{ background: 'transparent', border: `1px solid ${cfg.color}`, color: cfg.color, borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = cfg.color + '22'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'} title="Completed! View Result">
//                               Test {testIndex} ✅
//                             </button>
//                           ) : (
//                             <button onClick={() => startTopicTest(topic, testIndex)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#F0F0FF', borderRadius: 8, padding: '8px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = cfg.color; e.currentTarget.style.color = cfg.color; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; e.currentTarget.style.color = '#F0F0FF'; }}>
//                               Test {testIndex}
//                             </button>
//                           )}
//                         </div>
//                       )
//                     })
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {loading && (
//           <div style={{ textAlign: 'center', padding: 40, color: '#7A7A9D', fontSize: 16 }}>
//             ⏳ Loading questions...
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ═══════════════════════════════════════════════════════════
//   // SCREEN: HOME — Section selector
//   // ═══════════════════════════════════════════════════════════
//   return (
//     <div style={{ maxWidth: 900 }}>
//       <h1 style={{ fontWeight: 900, fontSize: 28, marginBottom: 6 }}>📝 Assessment Center</h1>
//       <p style={{ color: '#7A7A9D', marginBottom: 32, fontSize: 15 }}>
//         Choose a category and practice topic-by-topic or take a full mixed test
//       </p>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 20 }}>
//         {Object.entries(TOPIC_CONFIG).map(([key, cfg]) => (
//           <div key={key}
//             onClick={() => { setSection(key); setScreen('topics'); }}
//             style={{
//               background: 'rgba(255,255,255,0.03)', borderRadius: 20, padding: 28,
//               cursor: 'pointer', border: `2px solid ${cfg.color}22`,
//               transition: 'all 0.2s'
//             }}
//             onMouseEnter={e => {
//               e.currentTarget.style.borderColor = cfg.color + '66';
//               e.currentTarget.style.transform = 'translateY(-5px)';
//               e.currentTarget.style.boxShadow = `0 12px 32px ${cfg.color}22`;
//             }}
//             onMouseLeave={e => {
//               e.currentTarget.style.borderColor = cfg.color + '22';
//               e.currentTarget.style.transform = 'none';
//               e.currentTarget.style.boxShadow = 'none';
//             }}>
//             <div style={{ fontSize: 36, marginBottom: 14 }}>
//               {cfg.label.split(' ')[0]}
//             </div>
//             <h3 style={{ fontWeight: 900, color: cfg.color, fontSize: 16, marginBottom: 8 }}>
//               {cfg.label.slice(3)}
//             </h3>
//             <p style={{ color: '#7A7A9D', fontSize: 13, marginBottom: 16 }}>
//               {cfg.topics.length} topics available
//             </p>
//             {/* Mini topic preview */}
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 20 }}>
//               {cfg.topics.slice(0, 4).map(t => (
//                 <span key={t} style={{
//                   background: cfg.color + '12', color: cfg.color,
//                   borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700
//                 }}>{t}</span>
//               ))}
//               {cfg.topics.length > 4 && (
//                 <span style={{
//                   background: '#F0F0F0', color: '#7A7A9D',
//                   borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700
//                 }}>+{cfg.topics.length - 4} more</span>
//               )}
//             </div>
//             <div style={{
//               background: cfg.color, color: '#fff',
//               borderRadius: 10, padding: '10px 0',
//               textAlign: 'center', fontWeight: 800, fontSize: 14
//             }}>
//               Select Topic →
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// // import React, { useState, useEffect } from 'react';
// // import { toast } from 'react-toastify';
// // import API from '../api';

// // // ── All topics hardcoded (matches your CSV questions) ─────────
// // const TOPIC_CONFIG = {
// //   aptitude: {
// //     label : '📐 Quantitative Aptitude',
// //     color : '#6C63FF',
// //     topics: [
// //       'Percentages','Profit & Loss','Time & Work','Speed, Distance & Time',
// //       'Simple & Compound Interest','Ratio & Proportion','Averages',
// //       'Mixtures & Alligations','Number System','HCF & LCM',
// //       'Permutation & Combination','Probability','Geometry & Mensuration',
// //       'Ages Problems','Calendar & Clocks','Pipes & Cisterns',
// //       'Partnership','Boats & Streams','Trains','Algebra',
// //     ]
// //   },
// //   logical: {
// //     label : '🧩 Logical Reasoning',
// //     color : '#FF6584',
// //     topics: [
// //       'Number Series','Letter Series','Syllogisms','Blood Relations',
// //       'Coding & Decoding','Direction Sense','Seating Arrangements',
// //       'Puzzles','Input & Output','Statements & Conclusions',
// //       'Analogies','Classification','Order & Ranking','Venn Diagrams',
// //     ]
// //   },
// //   verbal: {
// //     label : '📝 Verbal Ability',
// //     color : '#43E97B',
// //     topics: [
// //       'Synonyms & Antonyms','Sentence Correction','Fill in the Blanks',
// //       'Reading Comprehension','Idioms & Phrases','Para Jumbles',
// //       'Error Detection','One Word Substitution',
// //       'Active & Passive Voice','Vocabulary',
// //     ]
// //   },
// //   technical: {
// //     label : '💻 Technical',
// //     color : '#F9A825',
// //     topics: [
// //       'Python','Java','C++','Data Structures','Algorithms',
// //       'DBMS','Operating System','Networking','OOP Concepts',
// //       'Web Technologies','Software Engineering','Cloud Computing',
// //     ]
// //   },
// //   soft_skill: {
// //     label : '🤝 Soft Skills',
// //     color : '#29B6F6',
// //     topics: [
// //       'Communication','Leadership','Teamwork','Time Management',
// //       'Problem Solving','Critical Thinking','Emotional Intelligence',
// //       'Conflict Resolution','Presentation Skills','Work Ethics',
// //     ]
// //   }
// // };

// // // Map section → test_type for API
// // const SECTION_TO_TYPE = {
// //   aptitude   : 'aptitude',
// //   logical    : 'aptitude',
// //   verbal     : 'aptitude',
// //   technical  : 'technical',
// //   soft_skill : 'soft_skill',
// // };

// // const getGrade = (p) => {
// //   if (p >= 85) return { label:'Excellent 🏆', color:'#43E97B' };
// //   if (p >= 70) return { label:'Good 👍',       color:'#6C63FF' };
// //   if (p >= 55) return { label:'Average 📝',    color:'#F9A825' };
// //   if (p >= 40) return { label:'Poor ⚠️',       color:'#FF6584' };
// //   return             { label:'Very Poor ❌',   color:'#E53935' };
// // };

// // export default function Assessment() {
// //   const [screen, setScreen]       = useState('home');      // home | topics | quiz | result
// //   const [section, setSection]     = useState(null);        // aptitude/logical/verbal/technical/soft_skill
// //   const [selTopic, setSelTopic]   = useState(null);        // chosen topic
// //   const [questions, setQuestions] = useState([]);
// //   const [answers, setAnswers]     = useState({});
// //   const [result, setResult]       = useState(null);
// //   const [loading, setLoading]     = useState(false);
// //   const [answered, setAnswered]   = useState(0);

// //   // Count answered questions live
// //   useEffect(() => {
// //     setAnswered(Object.keys(answers).length);
// //   }, [answers]);

// //   // ── Start topic test ───────────────────────────────────────
// //   const startTopicTest = async (topic) => {
// //     setLoading(true);
// //     setSelTopic(topic);
// //     const testType = SECTION_TO_TYPE[section];
// //     try {
// //       const res = await API.get(`/assessment/questions/${testType}`, {
// //         params: { topic, count: 10 }
// //       });
// //       if (!res.data.questions?.length) {
// //         toast.warning(`No questions found for "${topic}". Please upload questions first.`);
// //         setLoading(false); return;
// //       }
// //       setQuestions(res.data.questions);
// //       setAnswers({});
// //       setResult(null);
// //       setScreen('quiz');
// //     } catch (err) {
// //       if (err.response?.status === 404) {
// //         toast.warning(`No questions uploaded yet for "${topic}". Ask admin to upload questions for this topic.`);
// //       } else {
// //         toast.error('Failed to load questions');
// //       }
// //     }
// //     finally { setLoading(false); }
// //   };

// //   // ── Start general test (all topics) ───────────────────────
// //   const startGeneralTest = async (sec) => {
// //     setLoading(true);
// //     setSelTopic('General');
// //     const testType = SECTION_TO_TYPE[sec];
// //     try {
// //       const res = await API.get(`/assessment/questions/${testType}`, {
// //         params: { count: 20 }
// //       });
// //       if (!res.data.questions?.length) {
// //         toast.warning('No questions found. Please upload questions first.');
// //         setLoading(false); return;
// //       }
// //       setQuestions(res.data.questions);
// //       setAnswers({});
// //       setResult(null);
// //       setScreen('quiz');
// //     } catch { toast.error('Failed to load questions'); }
// //     finally { setLoading(false); }
// //   };

// //   // ── Submit ─────────────────────────────────────────────────
// //   const submit = async () => {
// //     if (Object.keys(answers).length < questions.length) {
// //       toast.warning(`Please answer all ${questions.length} questions!`); return;
// //     }
// //     setLoading(true);
// //     try {
// //       const testType = SECTION_TO_TYPE[section];
// //       const res = await API.post('/assessment/submit', { type: testType, answers });
// //       setResult(res.data);
// //       setScreen('result');
// //       toast.success('Assessment submitted! 🎉');
// //     } catch { toast.error('Submission failed'); }
// //     finally { setLoading(false); }
// //   };

// //   // ── Reset ──────────────────────────────────────────────────
// //   const reset = () => {
// //     setScreen('home'); setSection(null); setSelTopic(null);
// //     setQuestions([]); setAnswers({}); setResult(null);
// //   };

// //   // ═══════════════════════════════════════════════════════════
// //   // SCREEN: RESULT
// //   // ═══════════════════════════════════════════════════════════
// //   if (screen === 'result' && result) {
// //     const grade = getGrade(result.percentage);
// //     return (
// //       <div style={{ maxWidth: 700 }}>
// //         <h1 style={{ fontWeight:900, fontSize:28, marginBottom:6 }}>🎉 Test Complete!</h1>
// //         <p style={{ color:'#7A7A9D', marginBottom:28 }}>
// //           {selTopic} — {TOPIC_CONFIG[section]?.label}
// //         </p>

// //         {/* Score card */}
// //         <div style={{
// //           background:`linear-gradient(135deg,${grade.color}22,${grade.color}08)`,
// //           border:`2px solid ${grade.color}44`,
// //           borderRadius:24, padding:36, textAlign:'center', marginBottom:24
// //         }}>
// //           <div style={{ fontSize:72, marginBottom:8 }}>
// //             {result.percentage>=85?'🏆':result.percentage>=70?'👍':result.percentage>=55?'📝':'📚'}
// //           </div>
// //           <div style={{ fontSize:56, fontWeight:900, color:grade.color }}>
// //             {result.percentage?.toFixed(1)}%
// //           </div>
// //           <div style={{ fontSize:20, fontWeight:800, color:grade.color, marginBottom:8 }}>
// //             {grade.label}
// //           </div>
// //           <p style={{ color:'#7A7A9D', fontSize:16 }}>
// //             {result.score} correct out of {result.total} questions
// //           </p>
// //           {/* Score bar */}
// //           <div style={{ marginTop:20, height:12, background:'#E0E7FF', borderRadius:10 }}>
// //             <div style={{
// //               height:'100%', borderRadius:10,
// //               width:`${result.percentage}%`,
// //               background:grade.color, transition:'width 1s'
// //             }}/>
// //           </div>
// //         </div>

// //         {/* Topic breakdown */}
// //         {Object.keys(result.topic_scores||{}).length > 0 && (
// //           <div style={{ background:'#fff', borderRadius:20, padding:24, marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
// //             <h3 style={{ fontWeight:900, marginBottom:16 }}>📊 Topic-wise Scores</h3>
// //             {Object.entries(result.topic_scores).map(([t, s]) => (
// //               <div key={t} style={{ marginBottom:12 }}>
// //                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
// //                   <span style={{ fontWeight:700, fontSize:14, textTransform:'capitalize' }}>{t}</span>
// //                   <span style={{ fontWeight:900, color:'#6C63FF' }}>{s}%</span>
// //                 </div>
// //                 <div style={{ height:8, background:'#F0EEFF', borderRadius:8 }}>
// //                   <div style={{ height:'100%', borderRadius:8, background:'#6C63FF', width:`${s}%` }}/>
// //                 </div>
// //               </div>
// //             ))}
// //           </div>
// //         )}

// //         <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
// //           <button className="btn btn-primary" onClick={() => setScreen('topics')} style={{ flex:1 }}>
// //             🔁 Try Another Topic
// //           </button>
// //           <button className="btn btn-outline" onClick={reset} style={{ flex:1 }}>
// //             🏠 Back to Home
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // SCREEN: QUIZ
// //   // ═══════════════════════════════════════════════════════════
// //   if (screen === 'quiz' && questions.length) {
// //     const cfg = TOPIC_CONFIG[section];
// //     return (
// //       <div style={{ maxWidth:720 }}>
// //         {/* Header */}
// //         <div style={{
// //           display:'flex', justifyContent:'space-between', alignItems:'center',
// //           marginBottom:20, flexWrap:'wrap', gap:12
// //         }}>
// //           <div>
// //             <h1 style={{ fontWeight:900, fontSize:22, marginBottom:2 }}>
// //               {cfg?.label} — {selTopic}
// //             </h1>
// //             <p style={{ color:'#7A7A9D', fontSize:14 }}>
// //               {questions.length} questions • Answer all before submitting
// //             </p>
// //           </div>
// //           <div style={{
// //             background:'#F0EEFF', borderRadius:12, padding:'8px 18px',
// //             fontWeight:900, color:'#6C63FF', fontSize:15
// //           }}>
// //             {answered}/{questions.length} answered
// //           </div>
// //         </div>

// //         {/* Progress bar */}
// //         <div style={{ height:6, background:'#E0E7FF', borderRadius:6, marginBottom:28 }}>
// //           <div style={{
// //             height:'100%', borderRadius:6, background:'#6C63FF',
// //             width:`${(answered/questions.length)*100}%`, transition:'width 0.3s'
// //           }}/>
// //         </div>

// //         {/* Questions */}
// //         <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
// //           {questions.map((q, i) => (
// //             <div key={q.id} style={{
// //               background:'#fff', borderRadius:20, padding:24,
// //               boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
// //               border: answers[q.id] ? '2px solid #6C63FF33' : '2px solid #E0E7FF'
// //             }}>
// //               <p style={{ fontWeight:800, fontSize:15, marginBottom:16, lineHeight:1.5 }}>
// //                 <span style={{
// //                   display:'inline-block', background:'#6C63FF', color:'#fff',
// //                   borderRadius:8, padding:'2px 10px', fontSize:13,
// //                   fontWeight:900, marginRight:10
// //                 }}>Q{i+1}</span>
// //                 {q.question}
// //               </p>
// //               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
// //                 {q.options.map((opt, oi) => {
// //                   const labels = ['A','B','C','D'];
// //                   const chosen = answers[q.id] === opt;
// //                   return (
// //                     <button key={opt}
// //                       onClick={() => setAnswers({...answers, [q.id]: opt})}
// //                       style={{
// //                         padding:'12px 14px', borderRadius:12, border:'2px solid',
// //                         borderColor: chosen ? '#6C63FF' : '#E0E7FF',
// //                         background:  chosen ? '#6C63FF' : '#F8F9FF',
// //                         color:       chosen ? '#fff'    : '#2D2D2D',
// //                         fontWeight:  chosen ? 800       : 600,
// //                         cursor:'pointer', fontSize:14,
// //                         textAlign:'left', fontFamily:'Nunito,sans-serif',
// //                         display:'flex', alignItems:'center', gap:10,
// //                         transition:'all 0.15s'
// //                       }}>
// //                       <span style={{
// //                         width:24, height:24, borderRadius:6, flexShrink:0,
// //                         background: chosen ? 'rgba(255,255,255,0.25)' : '#E0E7FF',
// //                         display:'flex', alignItems:'center', justifyContent:'center',
// //                         fontWeight:900, fontSize:12,
// //                         color: chosen ? '#fff' : '#6C63FF'
// //                       }}>{labels[oi]}</span>
// //                       {opt}
// //                     </button>
// //                   );
// //                 })}
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Submit */}
// //         <div style={{ display:'flex', gap:12, marginTop:28 }}>
// //           <button className="btn btn-outline" onClick={() => setScreen('topics')}>
// //             ← Back
// //           </button>
// //           <button className="btn btn-primary"
// //             onClick={submit} disabled={loading}
// //             style={{ flex:1, justifyContent:'center', fontSize:16, padding:'14px 0' }}>
// //             {loading ? '⏳ Submitting...' : `✅ Submit (${answered}/${questions.length} answered)`}
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // SCREEN: TOPIC PICKER
// //   // ═══════════════════════════════════════════════════════════
// //   if (screen === 'topics' && section) {
// //     const cfg = TOPIC_CONFIG[section];
// //     return (
// //       <div style={{ maxWidth:900 }}>
// //         {/* Back + Header */}
// //         <button onClick={() => setScreen('home')} style={{
// //           background:'none', border:'none', cursor:'pointer',
// //           color:'#6C63FF', fontWeight:700, fontSize:15, marginBottom:16,
// //           display:'flex', alignItems:'center', gap:6
// //         }}>← Back</button>

// //         <h1 style={{ fontWeight:900, fontSize:26, marginBottom:4 }}>{cfg.label}</h1>
// //         <p style={{ color:'#7A7A9D', marginBottom:28, fontSize:15 }}>
// //           Select a topic to start a focused 10-question test
// //         </p>

// //         {/* General test button */}
// //         <div onClick={() => startGeneralTest(section)} style={{
// //           background:`linear-gradient(135deg,${cfg.color},${cfg.color}BB)`,
// //           borderRadius:18, padding:'20px 28px', marginBottom:24,
// //           cursor:'pointer', color:'#fff', display:'flex',
// //           alignItems:'center', justifyContent:'space-between',
// //           boxShadow:`0 6px 24px ${cfg.color}44`, transition:'all 0.2s'
// //         }}
// //         onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
// //         onMouseLeave={e=>e.currentTarget.style.transform='none'}>
// //           <div>
// //             <div style={{ fontWeight:900, fontSize:18 }}>🎯 Full Mixed Test</div>
// //             <div style={{ opacity:0.85, fontSize:14, marginTop:4 }}>
// //               20 random questions from all topics
// //             </div>
// //           </div>
// //           <div style={{ fontSize:28 }}>→</div>
// //         </div>

// //         {/* Topic grid */}
// //         <h3 style={{ fontWeight:900, fontSize:16, marginBottom:16, color:'#2D2D2D' }}>
// //           📚 Topic-wise Practice ({cfg.topics.length} topics)
// //         </h3>
// //         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
// //           {cfg.topics.map((topic, i) => (
// //             <div key={topic}
// //               onClick={() => startTopicTest(topic)}
// //               style={{
// //                 background:'#fff', borderRadius:14, padding:'16px 18px',
// //                 cursor:'pointer', border:`2px solid ${cfg.color}22`,
// //                 boxShadow:'0 3px 12px rgba(0,0,0,0.06)',
// //                 transition:'all 0.2s', display:'flex',
// //                 alignItems:'center', gap:12
// //               }}
// //               onMouseEnter={e=>{
// //                 e.currentTarget.style.borderColor=cfg.color;
// //                 e.currentTarget.style.transform='translateY(-3px)';
// //                 e.currentTarget.style.boxShadow=`0 8px 24px ${cfg.color}22`;
// //               }}
// //               onMouseLeave={e=>{
// //                 e.currentTarget.style.borderColor=cfg.color+'22';
// //                 e.currentTarget.style.transform='none';
// //                 e.currentTarget.style.boxShadow='0 3px 12px rgba(0,0,0,0.06)';
// //               }}>
// //               <div style={{
// //                 width:36, height:36, borderRadius:10, flexShrink:0,
// //                 background:cfg.color+'18', display:'flex',
// //                 alignItems:'center', justifyContent:'center',
// //                 fontWeight:900, fontSize:14, color:cfg.color
// //               }}>{i+1}</div>
// //               <span style={{ fontWeight:700, fontSize:13, color:'#2D2D2D', lineHeight:1.3 }}>
// //                 {topic}
// //               </span>
// //             </div>
// //           ))}
// //         </div>

// //         {loading && (
// //           <div style={{ textAlign:'center', padding:40, color:'#7A7A9D', fontSize:16 }}>
// //             ⏳ Loading questions...
// //           </div>
// //         )}
// //       </div>
// //     );
// //   }

// //   // ═══════════════════════════════════════════════════════════
// //   // SCREEN: HOME — Section selector
// //   // ═══════════════════════════════════════════════════════════
// //   return (
// //     <div style={{ maxWidth:900 }}>
// //       <h1 style={{ fontWeight:900, fontSize:28, marginBottom:6 }}>📝 Assessment Center</h1>
// //       <p style={{ color:'#7A7A9D', marginBottom:32, fontSize:15 }}>
// //         Choose a category and practice topic-by-topic or take a full mixed test
// //       </p>

// //       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
// //         {Object.entries(TOPIC_CONFIG).map(([key, cfg]) => (
// //           <div key={key}
// //             onClick={() => { setSection(key); setScreen('topics'); }}
// //             style={{
// //               background:'#fff', borderRadius:20, padding:28,
// //               cursor:'pointer', border:`2px solid ${cfg.color}22`,
// //               boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
// //               transition:'all 0.2s'
// //             }}
// //             onMouseEnter={e=>{
// //               e.currentTarget.style.borderColor=cfg.color+'66';
// //               e.currentTarget.style.transform='translateY(-5px)';
// //               e.currentTarget.style.boxShadow=`0 12px 32px ${cfg.color}22`;
// //             }}
// //             onMouseLeave={e=>{
// //               e.currentTarget.style.borderColor=cfg.color+'22';
// //               e.currentTarget.style.transform='none';
// //               e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)';
// //             }}>
// //             <div style={{ fontSize:36, marginBottom:14 }}>
// //               {cfg.label.split(' ')[0]}
// //             </div>
// //             <h3 style={{ fontWeight:900, color:cfg.color, fontSize:16, marginBottom:8 }}>
// //               {cfg.label.slice(3)}
// //             </h3>
// //             <p style={{ color:'#7A7A9D', fontSize:13, marginBottom:16 }}>
// //               {cfg.topics.length} topics available
// //             </p>
// //             {/* Mini topic preview */}
// //             <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:20 }}>
// //               {cfg.topics.slice(0,4).map(t => (
// //                 <span key={t} style={{
// //                   background:cfg.color+'12', color:cfg.color,
// //                   borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700
// //                 }}>{t}</span>
// //               ))}
// //               {cfg.topics.length > 4 && (
// //                 <span style={{
// //                   background:'#F0F0F0', color:'#7A7A9D',
// //                   borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700
// //                 }}>+{cfg.topics.length - 4} more</span>
// //               )}
// //             </div>
// //             <div style={{
// //               background:cfg.color, color:'#fff',
// //               borderRadius:10, padding:'10px 0',
// //               textAlign:'center', fontWeight:800, fontSize:14
// //             }}>
// //               Select Topic →
// //             </div>
// //           </div>
// //         ))}
// //       </div>
// //     </div>
// //   );
// // }


// // // import React, { useState, useEffect } from 'react';
// // // import { toast } from 'react-toastify';
// // // import API from '../api';

// // // // ── All topics hardcoded (matches your CSV questions) ─────────
// // // const TOPIC_CONFIG = {
// // //   aptitude: {
// // //     label : '📐 Quantitative Aptitude',
// // //     color : '#6C63FF',
// // //     topics: [
// // //       'Percentages','Profit & Loss','Time & Work','Speed, Distance & Time',
// // //       'Simple & Compound Interest','Ratio & Proportion','Averages',
// // //       'Mixtures & Alligations','Number System','HCF & LCM',
// // //       'Permutation & Combination','Probability','Geometry & Mensuration',
// // //       'Ages Problems','Calendar & Clocks','Pipes & Cisterns',
// // //       'Partnership','Boats & Streams','Trains','Algebra',
// // //     ]
// // //   },
// // //   logical: {
// // //     label : '🧩 Logical Reasoning',
// // //     color : '#FF6584',
// // //     topics: [
// // //       'Number Series','Letter Series','Syllogisms','Blood Relations',
// // //       'Coding & Decoding','Direction Sense','Seating Arrangements',
// // //       'Puzzles','Input & Output','Statements & Conclusions',
// // //       'Analogies','Classification','Order & Ranking','Venn Diagrams',
// // //     ]
// // //   },
// // //   verbal: {
// // //     label : '📝 Verbal Ability',
// // //     color : '#43E97B',
// // //     topics: [
// // //       'Synonyms & Antonyms','Sentence Correction','Fill in the Blanks',
// // //       'Reading Comprehension','Idioms & Phrases','Para Jumbles',
// // //       'Error Detection','One Word Substitution',
// // //       'Active & Passive Voice','Vocabulary',
// // //     ]
// // //   },
// // //   technical: {
// // //     label : '💻 Technical',
// // //     color : '#F9A825',
// // //     topics: [
// // //       'Python','Java','C++','Data Structures','Algorithms',
// // //       'DBMS','Operating System','Networking','OOP Concepts',
// // //       'Web Technologies','Software Engineering','Cloud Computing',
// // //     ]
// // //   },
// // //   soft_skill: {
// // //     label : '🤝 Soft Skills',
// // //     color : '#29B6F6',
// // //     topics: [
// // //       'Communication','Leadership','Teamwork','Time Management',
// // //       'Problem Solving','Critical Thinking','Emotional Intelligence',
// // //       'Conflict Resolution','Presentation Skills','Work Ethics',
// // //     ]
// // //   }
// // // };

// // // // Map section → test_type for API
// // // const SECTION_TO_TYPE = {
// // //   aptitude   : 'aptitude',
// // //   logical    : 'aptitude',
// // //   verbal     : 'aptitude',
// // //   technical  : 'technical',
// // //   soft_skill : 'soft_skill',
// // // };

// // // const getGrade = (p) => {
// // //   if (p >= 85) return { label:'Excellent 🏆', color:'#43E97B' };
// // //   if (p >= 70) return { label:'Good 👍',       color:'#6C63FF' };
// // //   if (p >= 55) return { label:'Average 📝',    color:'#F9A825' };
// // //   if (p >= 40) return { label:'Poor ⚠️',       color:'#FF6584' };
// // //   return             { label:'Very Poor ❌',   color:'#E53935' };
// // // };

// // // export default function Assessment() {
// // //   const [screen, setScreen]       = useState('home');      // home | topics | quiz | result
// // //   const [section, setSection]     = useState(null);        // aptitude/logical/verbal/technical/soft_skill
// // //   const [selTopic, setSelTopic]   = useState(null);        // chosen topic
// // //   const [questions, setQuestions] = useState([]);
// // //   const [answers, setAnswers]     = useState({});
// // //   const [result, setResult]       = useState(null);
// // //   const [loading, setLoading]     = useState(false);
// // //   const [answered, setAnswered]   = useState(0);

// // //   // Count answered questions live
// // //   useEffect(() => {
// // //     setAnswered(Object.keys(answers).length);
// // //   }, [answers]);

// // //   // ── Start topic test ───────────────────────────────────────
// // //   const startTopicTest = async (topic) => {
// // //     setLoading(true);
// // //     setSelTopic(topic);
// // //     const testType = SECTION_TO_TYPE[section];
// // //     try {
// // //       const res = await API.get(`/assessment/questions/${testType}`, {
// // //         params: { topic, count: 10 }
// // //       });
// // //       if (!res.data.questions?.length) {
// // //         toast.warning(`No questions found for "${topic}". Please upload questions first.`);
// // //         setLoading(false); return;
// // //       }
// // //       setQuestions(res.data.questions);
// // //       setAnswers({});
// // //       setResult(null);
// // //       setScreen('quiz');
// // //     } catch { toast.error('Failed to load questions'); }
// // //     finally { setLoading(false); }
// // //   };

// // //   // ── Start general test (all topics) ───────────────────────
// // //   const startGeneralTest = async (sec) => {
// // //     setLoading(true);
// // //     setSelTopic('General');
// // //     const testType = SECTION_TO_TYPE[sec];
// // //     try {
// // //       const res = await API.get(`/assessment/questions/${testType}`, {
// // //         params: { count: 20 }
// // //       });
// // //       if (!res.data.questions?.length) {
// // //         toast.warning('No questions found. Please upload questions first.');
// // //         setLoading(false); return;
// // //       }
// // //       setQuestions(res.data.questions);
// // //       setAnswers({});
// // //       setResult(null);
// // //       setScreen('quiz');
// // //     } catch { toast.error('Failed to load questions'); }
// // //     finally { setLoading(false); }
// // //   };

// // //   // ── Submit ─────────────────────────────────────────────────
// // //   const submit = async () => {
// // //     if (Object.keys(answers).length < questions.length) {
// // //       toast.warning(`Please answer all ${questions.length} questions!`); return;
// // //     }
// // //     setLoading(true);
// // //     try {
// // //       const testType = SECTION_TO_TYPE[section];
// // //       const res = await API.post('/assessment/submit', { type: testType, answers });
// // //       setResult(res.data);
// // //       setScreen('result');
// // //       toast.success('Assessment submitted! 🎉');
// // //     } catch { toast.error('Submission failed'); }
// // //     finally { setLoading(false); }
// // //   };

// // //   // ── Reset ──────────────────────────────────────────────────
// // //   const reset = () => {
// // //     setScreen('home'); setSection(null); setSelTopic(null);
// // //     setQuestions([]); setAnswers({}); setResult(null);
// // //   };

// // //   // ═══════════════════════════════════════════════════════════
// // //   // SCREEN: RESULT
// // //   // ═══════════════════════════════════════════════════════════
// // //   if (screen === 'result' && result) {
// // //     const grade = getGrade(result.percentage);
// // //     return (
// // //       <div style={{ maxWidth: 700 }}>
// // //         <h1 style={{ fontWeight:900, fontSize:28, marginBottom:6 }}>🎉 Test Complete!</h1>
// // //         <p style={{ color:'#7A7A9D', marginBottom:28 }}>
// // //           {selTopic} — {TOPIC_CONFIG[section]?.label}
// // //         </p>

// // //         {/* Score card */}
// // //         <div style={{
// // //           background:`linear-gradient(135deg,${grade.color}22,${grade.color}08)`,
// // //           border:`2px solid ${grade.color}44`,
// // //           borderRadius:24, padding:36, textAlign:'center', marginBottom:24
// // //         }}>
// // //           <div style={{ fontSize:72, marginBottom:8 }}>
// // //             {result.percentage>=85?'🏆':result.percentage>=70?'👍':result.percentage>=55?'📝':'📚'}
// // //           </div>
// // //           <div style={{ fontSize:56, fontWeight:900, color:grade.color }}>
// // //             {result.percentage?.toFixed(1)}%
// // //           </div>
// // //           <div style={{ fontSize:20, fontWeight:800, color:grade.color, marginBottom:8 }}>
// // //             {grade.label}
// // //           </div>
// // //           <p style={{ color:'#7A7A9D', fontSize:16 }}>
// // //             {result.score} correct out of {result.total} questions
// // //           </p>
// // //           {/* Score bar */}
// // //           <div style={{ marginTop:20, height:12, background:'#E0E7FF', borderRadius:10 }}>
// // //             <div style={{
// // //               height:'100%', borderRadius:10,
// // //               width:`${result.percentage}%`,
// // //               background:grade.color, transition:'width 1s'
// // //             }}/>
// // //           </div>
// // //         </div>

// // //         {/* Topic breakdown */}
// // //         {Object.keys(result.topic_scores||{}).length > 0 && (
// // //           <div style={{ background:'#fff', borderRadius:20, padding:24, marginBottom:24, boxShadow:'0 4px 20px rgba(0,0,0,0.06)' }}>
// // //             <h3 style={{ fontWeight:900, marginBottom:16 }}>📊 Topic-wise Scores</h3>
// // //             {Object.entries(result.topic_scores).map(([t, s]) => (
// // //               <div key={t} style={{ marginBottom:12 }}>
// // //                 <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
// // //                   <span style={{ fontWeight:700, fontSize:14, textTransform:'capitalize' }}>{t}</span>
// // //                   <span style={{ fontWeight:900, color:'#6C63FF' }}>{s}%</span>
// // //                 </div>
// // //                 <div style={{ height:8, background:'#F0EEFF', borderRadius:8 }}>
// // //                   <div style={{ height:'100%', borderRadius:8, background:'#6C63FF', width:`${s}%` }}/>
// // //                 </div>
// // //               </div>
// // //             ))}
// // //           </div>
// // //         )}

// // //         <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
// // //           <button className="btn btn-primary" onClick={() => setScreen('topics')} style={{ flex:1 }}>
// // //             🔁 Try Another Topic
// // //           </button>
// // //           <button className="btn btn-outline" onClick={reset} style={{ flex:1 }}>
// // //             🏠 Back to Home
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════
// // //   // SCREEN: QUIZ
// // //   // ═══════════════════════════════════════════════════════════
// // //   if (screen === 'quiz' && questions.length) {
// // //     const cfg = TOPIC_CONFIG[section];
// // //     return (
// // //       <div style={{ maxWidth:720 }}>
// // //         {/* Header */}
// // //         <div style={{
// // //           display:'flex', justifyContent:'space-between', alignItems:'center',
// // //           marginBottom:20, flexWrap:'wrap', gap:12
// // //         }}>
// // //           <div>
// // //             <h1 style={{ fontWeight:900, fontSize:22, marginBottom:2 }}>
// // //               {cfg?.label} — {selTopic}
// // //             </h1>
// // //             <p style={{ color:'#7A7A9D', fontSize:14 }}>
// // //               {questions.length} questions • Answer all before submitting
// // //             </p>
// // //           </div>
// // //           <div style={{
// // //             background:'#F0EEFF', borderRadius:12, padding:'8px 18px',
// // //             fontWeight:900, color:'#6C63FF', fontSize:15
// // //           }}>
// // //             {answered}/{questions.length} answered
// // //           </div>
// // //         </div>

// // //         {/* Progress bar */}
// // //         <div style={{ height:6, background:'#E0E7FF', borderRadius:6, marginBottom:28 }}>
// // //           <div style={{
// // //             height:'100%', borderRadius:6, background:'#6C63FF',
// // //             width:`${(answered/questions.length)*100}%`, transition:'width 0.3s'
// // //           }}/>
// // //         </div>

// // //         {/* Questions */}
// // //         <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
// // //           {questions.map((q, i) => (
// // //             <div key={q.id} style={{
// // //               background:'#fff', borderRadius:20, padding:24,
// // //               boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
// // //               border: answers[q.id] ? '2px solid #6C63FF33' : '2px solid #E0E7FF'
// // //             }}>
// // //               <p style={{ fontWeight:800, fontSize:15, marginBottom:16, lineHeight:1.5 }}>
// // //                 <span style={{
// // //                   display:'inline-block', background:'#6C63FF', color:'#fff',
// // //                   borderRadius:8, padding:'2px 10px', fontSize:13,
// // //                   fontWeight:900, marginRight:10
// // //                 }}>Q{i+1}</span>
// // //                 {q.question}
// // //               </p>
// // //               <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
// // //                 {q.options.map((opt, oi) => {
// // //                   const labels = ['A','B','C','D'];
// // //                   const chosen = answers[q.id] === opt;
// // //                   return (
// // //                     <button key={opt}
// // //                       onClick={() => setAnswers({...answers, [q.id]: opt})}
// // //                       style={{
// // //                         padding:'12px 14px', borderRadius:12, border:'2px solid',
// // //                         borderColor: chosen ? '#6C63FF' : '#E0E7FF',
// // //                         background:  chosen ? '#6C63FF' : '#F8F9FF',
// // //                         color:       chosen ? '#fff'    : '#2D2D2D',
// // //                         fontWeight:  chosen ? 800       : 600,
// // //                         cursor:'pointer', fontSize:14,
// // //                         textAlign:'left', fontFamily:'Nunito,sans-serif',
// // //                         display:'flex', alignItems:'center', gap:10,
// // //                         transition:'all 0.15s'
// // //                       }}>
// // //                       <span style={{
// // //                         width:24, height:24, borderRadius:6, flexShrink:0,
// // //                         background: chosen ? 'rgba(255,255,255,0.25)' : '#E0E7FF',
// // //                         display:'flex', alignItems:'center', justifyContent:'center',
// // //                         fontWeight:900, fontSize:12,
// // //                         color: chosen ? '#fff' : '#6C63FF'
// // //                       }}>{labels[oi]}</span>
// // //                       {opt}
// // //                     </button>
// // //                   );
// // //                 })}
// // //               </div>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {/* Submit */}
// // //         <div style={{ display:'flex', gap:12, marginTop:28 }}>
// // //           <button className="btn btn-outline" onClick={() => setScreen('topics')}>
// // //             ← Back
// // //           </button>
// // //           <button className="btn btn-primary"
// // //             onClick={submit} disabled={loading}
// // //             style={{ flex:1, justifyContent:'center', fontSize:16, padding:'14px 0' }}>
// // //             {loading ? '⏳ Submitting...' : `✅ Submit (${answered}/${questions.length} answered)`}
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════
// // //   // SCREEN: TOPIC PICKER
// // //   // ═══════════════════════════════════════════════════════════
// // //   if (screen === 'topics' && section) {
// // //     const cfg = TOPIC_CONFIG[section];
// // //     return (
// // //       <div style={{ maxWidth:900 }}>
// // //         {/* Back + Header */}
// // //         <button onClick={() => setScreen('home')} style={{
// // //           background:'none', border:'none', cursor:'pointer',
// // //           color:'#6C63FF', fontWeight:700, fontSize:15, marginBottom:16,
// // //           display:'flex', alignItems:'center', gap:6
// // //         }}>← Back</button>

// // //         <h1 style={{ fontWeight:900, fontSize:26, marginBottom:4 }}>{cfg.label}</h1>
// // //         <p style={{ color:'#7A7A9D', marginBottom:28, fontSize:15 }}>
// // //           Select a topic to start a focused 10-question test
// // //         </p>

// // //         {/* General test button */}
// // //         <div onClick={() => startGeneralTest(section)} style={{
// // //           background:`linear-gradient(135deg,${cfg.color},${cfg.color}BB)`,
// // //           borderRadius:18, padding:'20px 28px', marginBottom:24,
// // //           cursor:'pointer', color:'#fff', display:'flex',
// // //           alignItems:'center', justifyContent:'space-between',
// // //           boxShadow:`0 6px 24px ${cfg.color}44`, transition:'all 0.2s'
// // //         }}
// // //         onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
// // //         onMouseLeave={e=>e.currentTarget.style.transform='none'}>
// // //           <div>
// // //             <div style={{ fontWeight:900, fontSize:18 }}>🎯 Full Mixed Test</div>
// // //             <div style={{ opacity:0.85, fontSize:14, marginTop:4 }}>
// // //               20 random questions from all topics
// // //             </div>
// // //           </div>
// // //           <div style={{ fontSize:28 }}>→</div>
// // //         </div>

// // //         {/* Topic grid */}
// // //         <h3 style={{ fontWeight:900, fontSize:16, marginBottom:16, color:'#2D2D2D' }}>
// // //           📚 Topic-wise Practice ({cfg.topics.length} topics)
// // //         </h3>
// // //         <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:12 }}>
// // //           {cfg.topics.map((topic, i) => (
// // //             <div key={topic}
// // //               onClick={() => startTopicTest(topic)}
// // //               style={{
// // //                 background:'#fff', borderRadius:14, padding:'16px 18px',
// // //                 cursor:'pointer', border:`2px solid ${cfg.color}22`,
// // //                 boxShadow:'0 3px 12px rgba(0,0,0,0.06)',
// // //                 transition:'all 0.2s', display:'flex',
// // //                 alignItems:'center', gap:12
// // //               }}
// // //               onMouseEnter={e=>{
// // //                 e.currentTarget.style.borderColor=cfg.color;
// // //                 e.currentTarget.style.transform='translateY(-3px)';
// // //                 e.currentTarget.style.boxShadow=`0 8px 24px ${cfg.color}22`;
// // //               }}
// // //               onMouseLeave={e=>{
// // //                 e.currentTarget.style.borderColor=cfg.color+'22';
// // //                 e.currentTarget.style.transform='none';
// // //                 e.currentTarget.style.boxShadow='0 3px 12px rgba(0,0,0,0.06)';
// // //               }}>
// // //               <div style={{
// // //                 width:36, height:36, borderRadius:10, flexShrink:0,
// // //                 background:cfg.color+'18', display:'flex',
// // //                 alignItems:'center', justifyContent:'center',
// // //                 fontWeight:900, fontSize:14, color:cfg.color
// // //               }}>{i+1}</div>
// // //               <span style={{ fontWeight:700, fontSize:13, color:'#2D2D2D', lineHeight:1.3 }}>
// // //                 {topic}
// // //               </span>
// // //             </div>
// // //           ))}
// // //         </div>

// // //         {loading && (
// // //           <div style={{ textAlign:'center', padding:40, color:'#7A7A9D', fontSize:16 }}>
// // //             ⏳ Loading questions...
// // //           </div>
// // //         )}
// // //       </div>
// // //     );
// // //   }

// // //   // ═══════════════════════════════════════════════════════════
// // //   // SCREEN: HOME — Section selector
// // //   // ═══════════════════════════════════════════════════════════
// // //   return (
// // //     <div style={{ maxWidth:900 }}>
// // //       <h1 style={{ fontWeight:900, fontSize:28, marginBottom:6 }}>📝 Assessment Center</h1>
// // //       <p style={{ color:'#7A7A9D', marginBottom:32, fontSize:15 }}>
// // //         Choose a category and practice topic-by-topic or take a full mixed test
// // //       </p>

// // //       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
// // //         {Object.entries(TOPIC_CONFIG).map(([key, cfg]) => (
// // //           <div key={key}
// // //             onClick={() => { setSection(key); setScreen('topics'); }}
// // //             style={{
// // //               background:'#fff', borderRadius:20, padding:28,
// // //               cursor:'pointer', border:`2px solid ${cfg.color}22`,
// // //               boxShadow:'0 4px 20px rgba(0,0,0,0.06)',
// // //               transition:'all 0.2s'
// // //             }}
// // //             onMouseEnter={e=>{
// // //               e.currentTarget.style.borderColor=cfg.color+'66';
// // //               e.currentTarget.style.transform='translateY(-5px)';
// // //               e.currentTarget.style.boxShadow=`0 12px 32px ${cfg.color}22`;
// // //             }}
// // //             onMouseLeave={e=>{
// // //               e.currentTarget.style.borderColor=cfg.color+'22';
// // //               e.currentTarget.style.transform='none';
// // //               e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.06)';
// // //             }}>
// // //             <div style={{ fontSize:36, marginBottom:14 }}>
// // //               {cfg.label.split(' ')[0]}
// // //             </div>
// // //             <h3 style={{ fontWeight:900, color:cfg.color, fontSize:16, marginBottom:8 }}>
// // //               {cfg.label.slice(3)}
// // //             </h3>
// // //             <p style={{ color:'#7A7A9D', fontSize:13, marginBottom:16 }}>
// // //               {cfg.topics.length} topics available
// // //             </p>
// // //             {/* Mini topic preview */}
// // //             <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginBottom:20 }}>
// // //               {cfg.topics.slice(0,4).map(t => (
// // //                 <span key={t} style={{
// // //                   background:cfg.color+'12', color:cfg.color,
// // //                   borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700
// // //                 }}>{t}</span>
// // //               ))}
// // //               {cfg.topics.length > 4 && (
// // //                 <span style={{
// // //                   background:'#F0F0F0', color:'#7A7A9D',
// // //                   borderRadius:6, padding:'2px 8px', fontSize:11, fontWeight:700
// // //                 }}>+{cfg.topics.length - 4} more</span>
// // //               )}
// // //             </div>
// // //             <div style={{
// // //               background:cfg.color, color:'#fff',
// // //               borderRadius:10, padding:'10px 0',
// // //               textAlign:'center', fontWeight:800, fontSize:14
// // //             }}>
// // //               Select Topic →
// // //             </div>
// // //           </div>
// // //         ))}
// // //       </div>
// // //     </div>
// // //   );
// // // }


// // // // import React, { useState, useEffect } from 'react';
// // // // import { toast } from 'react-toastify';
// // // // import API from '../api';

// // // // // ── Test type config ──────────────────────────────────────────
// // // // const TEST_TYPES = [
// // // //   {
// // // //     key: 'aptitude', label: 'Aptitude', icon: '📊', color: '#6C63FF',
// // // //     bg: 'linear-gradient(135deg,#6C63FF,#a78bfa)',
// // // //     topics: [
// // // //       'Percentages','Profit & Loss','Time & Work','Speed & Distance',
// // // //       'Simple Interest','Compound Interest','Number Series',
// // // //       'Logical Reasoning','Blood Relations','Coding & Decoding','Verbal Ability'
// // // //     ]
// // // //   },
// // // //   {
// // // //     key: 'technical', label: 'Technical', icon: '💻', color: '#FF6584',
// // // //     bg: 'linear-gradient(135deg,#FF6584,#ff8fab)',
// // // //     topics: [
// // // //       'Python','Data Structures','Algorithms','DBMS',
// // // //       'Networking','OOP','Operating Systems','Web Development'
// // // //     ]
// // // //   },
// // // //   {
// // // //     key: 'soft_skill', label: 'Soft Skills', icon: '🤝', color: '#43E97B',
// // // //     bg: 'linear-gradient(135deg,#43E97B,#38f9d7)',
// // // //     topics: [
// // // //       'Communication','Time Management','Leadership','Teamwork',
// // // //       'Problem Solving','Interview Skills','Emotional Intelligence'
// // // //     ]
// // // //   }
// // // // ];

// // // // const QUESTIONS_PER_TEST = 10;

// // // // export default function Assessment() {
// // // //   // screen: 'home' | 'type' | 'topic' | 'quiz' | 'result'
// // // //   const [screen,    setScreen]    = useState('home');
// // // //   const [testType,  setTestType]  = useState(null);
// // // //   const [topic,     setTopic]     = useState(null);  // null = general
// // // //   const [testNum,   setTestNum]   = useState(1);     // which test set
// // // //   const [questions, setQuestions] = useState([]);
// // // //   const [answers,   setAnswers]   = useState({});
// // // //   const [result,    setResult]    = useState(null);
// // // //   const [loading,   setLoading]   = useState(false);
// // // //   const [history,   setHistory]   = useState([]);
// // // //   const [topicCounts, setTopicCounts] = useState({});

// // // //   useEffect(() => {
// // // //     API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => {});
// // // //   }, []);

// // // //   // Load question counts per topic when type is selected
// // // //   const loadTopicCounts = async (type) => {
// // // //     try {
// // // //       const res = await API.get(`/assessment/topic-counts/${type.key}`);
// // // //       setTopicCounts(res.data);
// // // //     } catch {
// // // //       // fallback: assume 40 per topic
// // // //       const counts = {};
// // // //       type.topics.forEach(t => counts[t] = 40);
// // // //       setTopicCounts(counts);
// // // //     }
// // // //   };

// // // //   const selectType = async (type) => {
// // // //     setTestType(type);
// // // //     await loadTopicCounts(type);
// // // //     setScreen('type');
// // // //   };

// // // //   // Start general test (random questions from all topics)
// // // //   const startGeneralTest = async () => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const res = await API.get(
// // // //         `/assessment/questions/${testType.key}?level=all&topic=all&count=10`
// // // //       );
// // // //       if (!res.data.questions?.length) {
// // // //         toast.warning('No questions found! Please ask admin to upload questions.');
// // // //         return;
// // // //       }
// // // //       setTopic(null);
// // // //       setTestNum(0);
// // // //       setQuestions(res.data.questions);
// // // //       setAnswers({});
// // // //       setResult(null);
// // // //       setScreen('quiz');
// // // //     } catch { toast.error('Failed to load questions'); }
// // // //     finally { setLoading(false); }
// // // //   };

// // // //   // Start specific topic test (test 1, 2, 3...)
// // // //   const startTopicTest = async (topicName, testNumber) => {
// // // //     setLoading(true);
// // // //     try {
// // // //       const skip = (testNumber - 1) * QUESTIONS_PER_TEST;
// // // //       const res  = await API.get(
// // // //         `/assessment/questions/${testType.key}?topic=${encodeURIComponent(topicName)}&count=10&skip=${skip}&level=all`
// // // //       );
// // // //       if (!res.data.questions?.length) {
// // // //         toast.warning(`No questions for Test ${testNumber}. Try a lower test number.`);
// // // //         return;
// // // //       }
// // // //       setTopic(topicName);
// // // //       setTestNum(testNumber);
// // // //       setQuestions(res.data.questions);
// // // //       setAnswers({});
// // // //       setResult(null);
// // // //       setScreen('quiz');
// // // //     } catch { toast.error('Failed to load questions'); }
// // // //     finally { setLoading(false); }
// // // //   };

// // // //   const submitTest = async () => {
// // // //     if (Object.keys(answers).length < questions.length) {
// // // //       toast.warning(`Please answer all ${questions.length} questions!`);
// // // //       return;
// // // //     }
// // // //     setLoading(true);
// // // //     try {
// // // //       const res = await API.post('/assessment/submit', {
// // // //         type: testType.key, answers
// // // //       });
// // // //       setResult(res.data);
// // // //       setHistory(prev => [{
// // // //         type: testType.key,
// // // //         percentage: res.data.percentage,
// // // //         taken_at: new Date().toISOString()
// // // //       }, ...prev]);
// // // //       setScreen('result');
// // // //       toast.success('Submitted! 🎉');
// // // //     } catch { toast.error('Submission failed'); }
// // // //     finally { setLoading(false); }
// // // //   };

// // // //   const goHome  = () => { setScreen('home'); setTestType(null); setQuestions([]); setAnswers({}); setResult(null); };
// // // //   const goType  = () => { setScreen('type'); setQuestions([]); setAnswers({}); setResult(null); };

// // // //   // How many tests available for a topic
// // // //   const testCount = (topicName) => {
// // // //     const count = topicCounts[topicName] || 40;
// // // //     return Math.max(1, Math.floor(count / QUESTIONS_PER_TEST));
// // // //   };

// // // //   // ── HOME ─────────────────────────────────────────────────────
// // // //   if (screen === 'home') return (
// // // //     <div>
// // // //       <div style={{ marginBottom: 32 }}>
// // // //         <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2D2D2D', marginBottom: 6 }}>
// // // //           📝 Placement Assessment Center
// // // //         </h1>
// // // //         <p style={{ color: '#7A7A9D', fontSize: 15 }}>
// // // //           Topic-wise tests just like IndiaBix — General Test + Topic Practice Sets
// // // //         </p>
// // // //       </div>

// // // //       {/* 3 Test Type Cards */}
// // // //       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 24, marginBottom: 36 }}>
// // // //         {TEST_TYPES.map(t => (
// // // //           <div key={t.key} onClick={() => selectType(t)}
// // // //             style={{
// // // //               background: t.bg, borderRadius: 20, padding: 28, cursor: 'pointer',
// // // //               boxShadow: `0 8px 32px ${t.color}33`,
// // // //               transition: 'all 0.25s', color: '#fff'
// // // //             }}
// // // //             onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-6px)'}
// // // //             onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
// // // //             <div style={{ fontSize: 44, marginBottom: 12 }}>{t.icon}</div>
// // // //             <h2 style={{ fontWeight: 900, fontSize: 20, marginBottom: 8 }}>{t.label} Test</h2>
// // // //             <p style={{ opacity: 0.85, fontSize: 14, marginBottom: 16 }}>
// // // //               {t.topics.length} topics • General + Topic-wise tests
// // // //             </p>
// // // //             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
// // // //               {t.topics.slice(0, 4).map(top => (
// // // //                 <span key={top} style={{
// // // //                   background: 'rgba(255,255,255,0.25)', borderRadius: 10,
// // // //                   padding: '3px 10px', fontSize: 12, fontWeight: 700
// // // //                 }}>{top}</span>
// // // //               ))}
// // // //               {t.topics.length > 4 && (
// // // //                 <span style={{
// // // //                   background: 'rgba(255,255,255,0.25)', borderRadius: 10,
// // // //                   padding: '3px 10px', fontSize: 12, fontWeight: 700
// // // //                 }}>+{t.topics.length - 4} more</span>
// // // //               )}
// // // //             </div>
// // // //             <div style={{
// // // //               marginTop: 20, background: 'rgba(255,255,255,0.2)',
// // // //               borderRadius: 12, padding: '10px 16px',
// // // //               fontWeight: 800, fontSize: 14, textAlign: 'center'
// // // //             }}>
// // // //               Start {t.label} Test →
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Recent History */}
// // // //       {history.length > 0 && (
// // // //         <div className="card">
// // // //           <h3 style={{ fontWeight: 800, marginBottom: 14 }}>📋 Recent Tests</h3>
// // // //           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
// // // //             {history.slice(0, 5).map((h, i) => (
// // // //               <div key={i} style={{
// // // //                 display: 'flex', justifyContent: 'space-between', alignItems: 'center',
// // // //                 padding: '10px 14px', background: '#F8F9FF', borderRadius: 10
// // // //               }}>
// // // //                 <span style={{ fontWeight: 700, textTransform: 'capitalize' }}>
// // // //                   {h.type.replace('_', ' ')}
// // // //                 </span>
// // // //                 <span style={{
// // // //                   fontWeight: 900,
// // // //                   color: h.percentage >= 70 ? '#43E97B' : h.percentage >= 50 ? '#F9A825' : '#FF6584'
// // // //                 }}>{h.percentage?.toFixed(1)}%</span>
// // // //                 <span style={{ color: '#7A7A9D', fontSize: 13 }}>
// // // //                   {new Date(h.taken_at).toLocaleDateString()}
// // // //                 </span>
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );

// // // //   // ── TYPE PAGE (General + Topics) ─────────────────────────────
// // // //   if (screen === 'type' && testType) return (
// // // //     <div>
// // // //       <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
// // // //         <button onClick={goHome} style={{
// // // //           background: 'none', border: '2px solid #E0E7FF', borderRadius: 10,
// // // //           padding: '8px 14px', cursor: 'pointer', fontWeight: 700, color: '#6C63FF'
// // // //         }}>← Back</button>
// // // //         <div>
// // // //           <h1 style={{ fontSize: 24, fontWeight: 900, color: '#2D2D2D', margin: 0 }}>
// // // //             {testType.icon} {testType.label} Test
// // // //           </h1>
// // // //           <p style={{ color: '#7A7A9D', margin: 0, fontSize: 14 }}>
// // // //             Choose General Test or practice topic-wise
// // // //           </p>
// // // //         </div>
// // // //       </div>

// // // //       {/* General Test Card */}
// // // //       <div style={{
// // // //         background: testType.bg, borderRadius: 20, padding: 28,
// // // //         marginBottom: 32, color: '#fff',
// // // //         boxShadow: `0 8px 32px ${testType.color}44`
// // // //       }}>
// // // //         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
// // // //           <div>
// // // //             <h2 style={{ fontWeight: 900, fontSize: 20, marginBottom: 6 }}>
// // // //               🎯 General Test
// // // //             </h2>
// // // //             <p style={{ opacity: 0.85, fontSize: 14, margin: 0 }}>
// // // //               10 random questions from all {testType.label.toLowerCase()} topics mixed together
// // // //             </p>
// // // //           </div>
// // // //           <button onClick={startGeneralTest} disabled={loading} style={{
// // // //             background: '#fff', color: testType.color,
// // // //             border: 'none', borderRadius: 14, padding: '14px 24px',
// // // //             fontWeight: 900, fontSize: 15, cursor: 'pointer',
// // // //             boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
// // // //             whiteSpace: 'nowrap', fontFamily: 'Nunito, sans-serif'
// // // //           }}>
// // // //             {loading ? '⏳ Loading...' : '🚀 Start Now'}
// // // //           </button>
// // // //         </div>
// // // //       </div>

// // // //       {/* Topic-wise Tests */}
// // // //       <h2 style={{ fontWeight: 900, fontSize: 18, color: '#2D2D2D', marginBottom: 16 }}>
// // // //         📚 Topic-wise Practice
// // // //       </h2>
// // // //       <p style={{ color: '#7A7A9D', fontSize: 14, marginBottom: 20, marginTop: -10 }}>
// // // //         Each test has 10 questions. Complete all tests to master each topic!
// // // //       </p>

// // // //       <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
// // // //         {testType.topics.map(topicName => {
// // // //           const numTests = testCount(topicName);
// // // //           return (
// // // //             <div key={topicName} className="card" style={{ padding: '20px 24px' }}>
// // // //               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
// // // //                 {/* Topic name */}
// // // //                 <div style={{ minWidth: 160 }}>
// // // //                   <h3 style={{ fontWeight: 800, fontSize: 16, color: '#2D2D2D', margin: 0 }}>
// // // //                     {topicName}
// // // //                   </h3>
// // // //                   <p style={{ color: '#7A7A9D', fontSize: 13, margin: '3px 0 0' }}>
// // // //                     {numTests * QUESTIONS_PER_TEST} questions • {numTests} tests
// // // //                   </p>
// // // //                 </div>

// // // //                 {/* Test buttons */}
// // // //                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
// // // //                   {Array.from({ length: numTests }, (_, i) => i + 1).map(testN => (
// // // //                     <button
// // // //                       key={testN}
// // // //                       onClick={() => startTopicTest(topicName, testN)}
// // // //                       disabled={loading}
// // // //                       style={{
// // // //                         padding: '8px 16px', borderRadius: 10,
// // // //                         border: `2px solid ${testType.color}`,
// // // //                         background: '#fff', color: testType.color,
// // // //                         fontWeight: 800, fontSize: 13, cursor: 'pointer',
// // // //                         fontFamily: 'Nunito, sans-serif',
// // // //                         transition: 'all 0.15s'
// // // //                       }}
// // // //                       onMouseEnter={e => {
// // // //                         e.currentTarget.style.background = testType.color;
// // // //                         e.currentTarget.style.color = '#fff';
// // // //                       }}
// // // //                       onMouseLeave={e => {
// // // //                         e.currentTarget.style.background = '#fff';
// // // //                         e.currentTarget.style.color = testType.color;
// // // //                       }}>
// // // //                       Test {testN}
// // // //                     </button>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>
// // // //             </div>
// // // //           );
// // // //         })}
// // // //       </div>
// // // //     </div>
// // // //   );

// // // //   // ── QUIZ SCREEN ───────────────────────────────────────────────
// // // //   if (screen === 'quiz') return (
// // // //     <div style={{ maxWidth: 720 }}>
// // // //       {/* Header */}
// // // //       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
// // // //         <div>
// // // //           <h1 style={{ fontSize: 22, fontWeight: 900, color: '#2D2D2D', margin: 0 }}>
// // // //             {testType.icon} {topic ? `${topic} — Test ${testNum}` : `${testType.label} General Test`}
// // // //           </h1>
// // // //           <p style={{ color: '#7A7A9D', fontSize: 13, margin: '4px 0 0' }}>
// // // //             {questions.length} Questions
// // // //           </p>
// // // //         </div>
// // // //         <div style={{
// // // //           background: '#F0EEFF', borderRadius: 12, padding: '8px 16px',
// // // //           fontWeight: 800, color: testType.color, fontSize: 14
// // // //         }}>
// // // //           {Object.keys(answers).length}/{questions.length} answered
// // // //         </div>
// // // //       </div>

// // // //       {/* Progress bar */}
// // // //       <div style={{
// // // //         height: 8, background: '#E0E7FF', borderRadius: 8, marginBottom: 24, overflow: 'hidden'
// // // //       }}>
// // // //         <div style={{
// // // //           height: '100%', borderRadius: 8,
// // // //           background: testType.bg,
// // // //           width: `${(Object.keys(answers).length / questions.length) * 100}%`,
// // // //           transition: 'width 0.3s'
// // // //         }} />
// // // //       </div>

// // // //       {/* Questions */}
// // // //       <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
// // // //         {questions.map((q, i) => (
// // // //           <div key={q.id} className="card" style={{
// // // //             border: `2px solid ${answers[q.id] ? testType.color + '66' : '#E0E7FF'}`,
// // // //             transition: 'border 0.2s'
// // // //           }}>
// // // //             {/* Question header */}
// // // //             <div style={{ display: 'flex', gap: 10, marginBottom: 14, alignItems: 'center' }}>
// // // //               <span style={{
// // // //                 background: testType.color, color: '#fff',
// // // //                 borderRadius: 8, padding: '3px 11px',
// // // //                 fontWeight: 800, fontSize: 13, flexShrink: 0
// // // //               }}>Q{i + 1}</span>
// // // //               <span style={{
// // // //                 fontSize: 11, fontWeight: 700, color: testType.color,
// // // //                 background: testType.color + '18', borderRadius: 6, padding: '2px 8px'
// // // //               }}>{q.topic}</span>
// // // //               <span style={{
// // // //                 fontSize: 11, fontWeight: 700, color: '#7A7A9D',
// // // //                 background: '#F0F4FF', borderRadius: 6, padding: '2px 8px',
// // // //                 textTransform: 'capitalize'
// // // //               }}>{q.level}</span>
// // // //             </div>

// // // //             <p style={{ fontWeight: 700, fontSize: 16, marginBottom: 16, lineHeight: 1.5, color: '#2D2D2D' }}>
// // // //               {q.question}
// // // //             </p>

// // // //             {/* Options */}
// // // //             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
// // // //               {q.options.map((opt, oi) => (
// // // //                 <button key={oi} onClick={() => setAnswers({ ...answers, [q.id]: opt })}
// // // //                   style={{
// // // //                     padding: '12px 16px', borderRadius: 10, border: '2px solid',
// // // //                     borderColor: answers[q.id] === opt ? testType.color : '#E0E7FF',
// // // //                     background: answers[q.id] === opt ? testType.color + '18' : '#fff',
// // // //                     color: answers[q.id] === opt ? testType.color : '#2D2D2D',
// // // //                     fontWeight: answers[q.id] === opt ? 800 : 600,
// // // //                     cursor: 'pointer', fontSize: 14, textAlign: 'left',
// // // //                     fontFamily: 'Nunito, sans-serif', transition: 'all 0.15s'
// // // //                   }}>
// // // //                   <span style={{ fontWeight: 900, marginRight: 6 }}>
// // // //                     {['A', 'B', 'C', 'D'][oi]}.
// // // //                   </span>
// // // //                   {opt}
// // // //                 </button>
// // // //               ))}
// // // //             </div>
// // // //           </div>
// // // //         ))}
// // // //       </div>

// // // //       {/* Submit */}
// // // //       <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
// // // //         <button onClick={goType} style={{
// // // //           padding: '13px 20px', borderRadius: 12, border: '2px solid #E0E7FF',
// // // //           background: '#fff', color: '#7A7A9D', fontWeight: 700,
// // // //           cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
// // // //         }}>← Back</button>
// // // //         <button onClick={submitTest} disabled={loading} style={{
// // // //           flex: 1, padding: '13px', borderRadius: 12, border: 'none',
// // // //           background: testType.bg, color: '#fff',
// // // //           fontWeight: 900, fontSize: 16, cursor: 'pointer',
// // // //           fontFamily: 'Nunito, sans-serif',
// // // //           boxShadow: `0 4px 16px ${testType.color}44`
// // // //         }}>
// // // //           {loading ? '⏳ Submitting...' : '✅ Submit Test'}
// // // //         </button>
// // // //       </div>
// // // //     </div>
// // // //   );

// // // //   // ── RESULT SCREEN ─────────────────────────────────────────────
// // // //   if (screen === 'result' && result) return (
// // // //     <div style={{ maxWidth: 700 }}>
// // // //       <h1 style={{ fontSize: 26, fontWeight: 900, color: '#2D2D2D', marginBottom: 24 }}>
// // // //         🎉 Test Results
// // // //       </h1>

// // // //       {/* Score card */}
// // // //       <div className="card" style={{
// // // //         textAlign: 'center', padding: 36, marginBottom: 24,
// // // //         background: testType.bg, color: '#fff',
// // // //         boxShadow: `0 8px 32px ${testType.color}44`
// // // //       }}>
// // // //         <div style={{ fontSize: 56, marginBottom: 8 }}>
// // // //           {result.percentage >= 80 ? '🏆' : result.percentage >= 60 ? '🎯' : result.percentage >= 40 ? '📚' : '💪'}
// // // //         </div>
// // // //         <div style={{ fontSize: 52, fontWeight: 900, marginBottom: 6 }}>
// // // //           {result.percentage}%
// // // //         </div>
// // // //         <p style={{ opacity: 0.85, fontSize: 16 }}>
// // // //           {result.score} correct out of {result.total} questions
// // // //         </p>
// // // //         {topic && (
// // // //           <p style={{ opacity: 0.75, fontSize: 14, marginTop: 4 }}>
// // // //             {topic} — Test {testNum}
// // // //           </p>
// // // //         )}
// // // //         <div style={{
// // // //           marginTop: 16, background: 'rgba(255,255,255,0.2)',
// // // //           borderRadius: 14, padding: '10px 20px', display: 'inline-block',
// // // //           fontWeight: 800, fontSize: 15
// // // //         }}>
// // // //           {result.percentage >= 70 ? '🚀 Excellent! Ready for placement!'
// // // //             : result.percentage >= 50 ? '💪 Good! Keep practising!'
// // // //             : '📖 Needs more practice!'}
// // // //         </div>
// // // //       </div>

// // // //       {/* Topic breakdown */}
// // // //       {Object.keys(result.topic_scores || {}).length > 0 && (
// // // //         <div className="card" style={{ marginBottom: 20 }}>
// // // //           <h3 style={{ fontWeight: 800, marginBottom: 16 }}>📊 Topic-wise Score</h3>
// // // //           {Object.entries(result.topic_scores).map(([t, pct]) => (
// // // //             <div key={t} style={{ marginBottom: 14 }}>
// // // //               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
// // // //                 <span style={{ fontWeight: 700, fontSize: 14 }}>{t}</span>
// // // //                 <span style={{
// // // //                   fontWeight: 900,
// // // //                   color: pct >= 70 ? '#43E97B' : pct >= 50 ? '#F9A825' : '#FF6584'
// // // //                 }}>{pct}%</span>
// // // //               </div>
// // // //               <div style={{ height: 8, background: '#E0E7FF', borderRadius: 8, overflow: 'hidden' }}>
// // // //                 <div style={{
// // // //                   height: '100%', borderRadius: 8, width: `${pct}%`,
// // // //                   background: pct >= 70 ? '#43E97B' : pct >= 50 ? '#F9A825' : '#FF6584',
// // // //                   transition: 'width 0.5s'
// // // //                 }} />
// // // //               </div>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       )}

// // // //       {/* Weak topics */}
// // // //       {Object.entries(result.topic_scores || {}).some(([, v]) => v < 50) && (
// // // //         <div className="card" style={{
// // // //           background: '#FFF5F5', border: '2px solid #FF658433', marginBottom: 20
// // // //         }}>
// // // //           <h3 style={{ fontWeight: 800, color: '#FF6584', marginBottom: 10 }}>
// // // //             ⚠️ Topics to Improve
// // // //           </h3>
// // // //           {Object.entries(result.topic_scores).filter(([, v]) => v < 50).map(([t]) => (
// // // //             <div key={t} style={{
// // // //               padding: '8px 12px', background: '#fff', borderRadius: 8,
// // // //               marginBottom: 6, fontWeight: 700, fontSize: 14
// // // //             }}>
// // // //               📌 Practise more: <span style={{ color: '#FF6584' }}>{t}</span>
// // // //             </div>
// // // //           ))}
// // // //         </div>
// // // //       )}

// // // //       {/* Buttons */}
// // // //       <div style={{ display: 'flex', gap: 12 }}>
// // // //         {topic && (
// // // //           <button onClick={() => startTopicTest(topic, testNum)} style={{
// // // //             flex: 1, padding: '13px', borderRadius: 12, border: 'none',
// // // //             background: testType.bg, color: '#fff',
// // // //             fontWeight: 900, cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
// // // //           }}>🔄 Retry This Test</button>
// // // //         )}
// // // //         {topic && testNum < testCount(topic) && (
// // // //           <button onClick={() => startTopicTest(topic, testNum + 1)} style={{
// // // //             flex: 1, padding: '13px', borderRadius: 12, border: 'none',
// // // //             background: 'linear-gradient(135deg,#43E97B,#38f9d7)', color: '#fff',
// // // //             fontWeight: 900, cursor: 'pointer', fontFamily: 'Nunito, sans-serif'
// // // //           }}>➡️ Next Test ({testNum + 1})</button>
// // // //         )}
// // // //         <button onClick={goType} style={{
// // // //           flex: 1, padding: '13px', borderRadius: 12,
// // // //           border: '2px solid #E0E7FF', background: '#fff',
// // // //           color: '#7A7A9D', fontWeight: 700, cursor: 'pointer',
// // // //           fontFamily: 'Nunito, sans-serif'
// // // //         }}>📚 All Topics</button>
// // // //         <button onClick={goHome} style={{
// // // //           padding: '13px 18px', borderRadius: 12,
// // // //           border: '2px solid #E0E7FF', background: '#fff',
// // // //           color: '#7A7A9D', fontWeight: 700, cursor: 'pointer',
// // // //           fontFamily: 'Nunito, sans-serif'
// // // //         }}>🏠</button>
// // // //       </div>
// // // //     </div>
// // // //   );

// // // //   return null;
// // // // }


// // // // // import React, { useState } from 'react';
// // // // // import { toast } from 'react-toastify';
// // // // // import API from '../api';

// // // // // const TYPES = [
// // // // //   { key:'aptitude',   label:'📊 Aptitude Test',       color:'#6C63FF', desc:'Quantitative, Logical & Verbal' },
// // // // //   { key:'technical',  label:'💻 Technical Test',       color:'#FF6584', desc:'Python, DSA, DBMS, Networking' },
// // // // //   { key:'soft_skill', label:'🤝 Soft Skills Test',     color:'#43E97B', desc:'Communication, Leadership, Time Mgmt' },
// // // // // ];

// // // // // export default function Assessment() {
// // // // //   const [type, setType]         = useState(null);
// // // // //   const [questions, setQuestions] = useState([]);
// // // // //   const [answers, setAnswers]   = useState({});
// // // // //   const [result, setResult]     = useState(null);
// // // // //   const [loading, setLoading]   = useState(false);

// // // // //   const startTest = async (t) => {
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const res = await API.get(`/assessment/questions/${t}`);
// // // // //       setQuestions(res.data.questions);
// // // // //       setType(t);
// // // // //       setAnswers({});
// // // // //       setResult(null);
// // // // //     } catch { toast.error('Failed to load questions'); }
// // // // //     finally { setLoading(false); }
// // // // //   };

// // // // //   const submit = async () => {
// // // // //     if (Object.keys(answers).length < questions.length) {
// // // // //       toast.warning('Please answer all questions!'); return;
// // // // //     }
// // // // //     setLoading(true);
// // // // //     try {
// // // // //       const res = await API.post('/assessment/submit', { type, answers });
// // // // //       setResult(res.data);
// // // // //       toast.success('Assessment submitted! 🎉');
// // // // //     } catch { toast.error('Submission failed'); }
// // // // //     finally { setLoading(false); }
// // // // //   };

// // // // //   // Results screen
// // // // //   if (result) return (
// // // // //     <div>
// // // // //       <h1 className="page-title">🎉 Assessment Complete!</h1>
// // // // //       <div className="card" style={{ maxWidth:500, textAlign:'center', padding:40 }}>
// // // // //         <div style={{ fontSize:64, marginBottom:16 }}>
// // // // //           {result.percentage >= 70 ? '🏆' : result.percentage >= 50 ? '👍' : '📚'}
// // // // //         </div>
// // // // //         <h2 style={{ fontSize:22, fontWeight:900, marginBottom:8 }}>Your Score</h2>
// // // // //         <div style={{ fontSize:48, fontWeight:900, color:'#6C63FF', marginBottom:4 }}>
// // // // //           {result.percentage}%
// // // // //         </div>
// // // // //         <p style={{ color:'#7A7A9D', marginBottom:24 }}>{result.score} out of {result.total} correct</p>
// // // // //         <div style={{ textAlign:'left', marginBottom:24 }}>
// // // // //           <h3 style={{ fontWeight:800, marginBottom:12 }}>Topic-wise Scores:</h3>
// // // // //           {Object.entries(result.topic_scores || {}).map(([topic, score]) => (
// // // // //             <div key={topic} style={{ marginBottom:10 }}>
// // // // //               <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
// // // // //                 <span style={{ fontWeight:700, textTransform:'capitalize' }}>{topic}</span>
// // // // //                 <span style={{ fontWeight:700, color:'#6C63FF' }}>{score}</span>
// // // // //               </div>
// // // // //               <div className="progress-bar-wrap">
// // // // //                 <div className="progress-bar-fill" style={{ width:`${(score/3)*100}%` }} />
// // // // //               </div>
// // // // //             </div>
// // // // //           ))}
// // // // //         </div>
// // // // //         <button className="btn btn-primary" onClick={() => { setType(null); setResult(null); setQuestions([]); }}>
// // // // //           🔄 Take Another Test
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );

// // // // //   // Quiz screen
// // // // //   if (type && questions.length) return (
// // // // //     <div>
// // // // //       <h1 className="page-title">📝 {TYPES.find(t=>t.key===type)?.label}</h1>
// // // // //       <p className="page-sub">{questions.length} questions • Answer all before submitting</p>
// // // // //       <div style={{ display:'flex', flexDirection:'column', gap:20, maxWidth:700 }}>
// // // // //         {questions.map((q, i) => (
// // // // //           <div key={q.id} className="card">
// // // // //             <p style={{ fontWeight:800, fontSize:16, marginBottom:16 }}>
// // // // //               <span style={{ color:'#6C63FF' }}>Q{i+1}.</span> {q.question}
// // // // //             </p>
// // // // //             <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
// // // // //               {q.options.map(opt => (
// // // // //                 <button key={opt} onClick={() => setAnswers({...answers, [q.id]: opt})}
// // // // //                   style={{
// // // // //                     padding:'12px 16px', borderRadius:10, border:'2px solid',
// // // // //                     borderColor: answers[q.id] === opt ? '#6C63FF' : '#E0E7FF',
// // // // //                     background: answers[q.id] === opt ? '#F0EEFF' : '#fff',
// // // // //                     color: answers[q.id] === opt ? '#6C63FF' : '#2D2D2D',
// // // // //                     fontWeight: answers[q.id] === opt ? 800 : 600,
// // // // //                     cursor:'pointer', fontSize:14, textAlign:'left', fontFamily:'Nunito,sans-serif'
// // // // //                   }}>
// // // // //                   {opt}
// // // // //                 </button>
// // // // //               ))}
// // // // //             </div>
// // // // //           </div>
// // // // //         ))}
// // // // //         <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ alignSelf:'flex-start', fontSize:16, padding:'14px 32px' }}>
// // // // //           {loading ? '⏳ Submitting...' : '✅ Submit Assessment'}
// // // // //         </button>
// // // // //       </div>
// // // // //     </div>
// // // // //   );

// // // // //   // Test selection screen
// // // // //   return (
// // // // //     <div>
// // // // //       <h1 className="page-title">📝 Assessments</h1>
// // // // //       <p className="page-sub">Choose a test to evaluate your skills</p>
// // // // //       <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:20 }}>
// // // // //         {TYPES.map(t => (
// // // // //           <div key={t.key} className="card" style={{ cursor:'pointer', padding:32, textAlign:'center', border:`2px solid ${t.color}33` }}
// // // // //             onClick={() => startTest(t.key)}>
// // // // //             <div style={{ fontSize:40, marginBottom:16 }}>{t.label.split(' ')[0]}</div>
// // // // //             <h3 style={{ fontWeight:800, color:t.color, marginBottom:8 }}>{t.label.slice(3)}</h3>
// // // // //             <p style={{ color:'#7A7A9D', fontSize:14, marginBottom:20 }}>{t.desc}</p>
// // // // //             <button className="btn" style={{ background:t.color, color:'#fff', width:'100%', justifyContent:'center' }}>
// // // // //               {loading ? 'Loading...' : 'Start Test →'}
// // // // //             </button>
// // // // //           </div>
// // // // //         ))}
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }
