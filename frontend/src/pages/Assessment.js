


import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

// ─────────────────────────────────────────────────────────────
// TOPIC CONFIG — 5 sections with colors, icons, topic lists
// ─────────────────────────────────────────────────────────────
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
    ],
  },
  logical: {
    label: 'Logical Reasoning', icon: '🧩', color: '#FF6B6B',
    gradient: 'linear-gradient(135deg,#FF6B6B,#ff8fab)',
    topics: [
      'Number Series', 'Letter Series', 'Syllogisms', 'Blood Relations',
      'Coding & Decoding', 'Direction Sense', 'Seating Arrangements',
      'Puzzles', 'Input & Output', 'Statements & Conclusions',
      'Analogies', 'Classification', 'Order & Ranking', 'Venn Diagrams',
    ],
  },
  verbal: {
    label: 'Verbal Ability', icon: '📝', color: '#06D6A0',
    gradient: 'linear-gradient(135deg,#06D6A0,#38f9d7)',
    topics: [
      'Synonyms & Antonyms', 'Sentence Correction', 'Fill in the Blanks',
      'Reading Comprehension', 'Idioms & Phrases', 'Para Jumbles',
      'Error Detection', 'One Word Substitution', 'Active & Passive Voice', 'Vocabulary',
    ],
  },
  technical: {
    label: 'Technical', icon: '💻', color: '#FFB347',
    gradient: 'linear-gradient(135deg,#FFB347,#ffcc02)',
    topics: [
      'Python', 'Java', 'C++', 'Data Structures', 'Algorithms',
      'DBMS', 'Operating System', 'Networking', 'OOP Concepts',
      'Web Technologies', 'Software Engineering', 'Cloud Computing',
    ],
  },
  soft_skill: {
    label: 'Soft Skills', icon: '🤝', color: '#4ECDC4',
    gradient: 'linear-gradient(135deg,#4ECDC4,#06D6A0)',
    topics: [
      'Communication', 'Leadership', 'Teamwork', 'Time Management',
      'Problem Solving', 'Critical Thinking', 'Emotional Intelligence',
      'Conflict Resolution', 'Presentation Skills', 'Work Ethics',
    ],
  },
};

// All three aptitude sections map to backend type 'aptitude'
const SECTION_TO_TYPE = {
  aptitude: 'aptitude',
  logical: 'aptitude',
  verbal: 'aptitude',
  technical: 'technical',
  soft_skill: 'soft_skill',
};

// ── FIX: topic name → aptitude sub-type for breakdown display ─
// Handles both "Synonyms & Antonyms" and "synonyms antonyms" formats
const TOPIC_APTITUDE_SUBTYPE = {
  // Quantitative
  'percentages': 'quantitative',
  'profit & loss': 'quantitative',
  'profit and loss': 'quantitative',
  'time & work': 'quantitative',
  'time and work': 'quantitative',
  'speed, distance & time': 'quantitative',
  'speed and distance': 'quantitative',
  'simple & compound interest': 'quantitative',
  'simple interest': 'quantitative',
  'compound interest': 'quantitative',
  'ratio & proportion': 'quantitative',
  'ratio and proportion': 'quantitative',
  'averages': 'quantitative',
  'mixtures & alligations': 'quantitative',
  'number system': 'quantitative',
  'hcf & lcm': 'quantitative',
  'permutation & combination': 'quantitative',
  'permutation': 'quantitative',
  'probability': 'quantitative',
  'geometry & mensuration': 'quantitative',
  'ages problems': 'quantitative',
  'calendar & clocks': 'quantitative',
  'pipes & cisterns': 'quantitative',
  'partnership': 'quantitative',
  'boats & streams': 'quantitative',
  'trains': 'quantitative',
  'algebra': 'quantitative',
  'number series': 'quantitative',

  // Logical
  'letter series': 'logical',
  'syllogisms': 'logical',
  'blood relations': 'logical',
  'coding & decoding': 'logical',
  'coding decoding': 'logical',
  'direction sense': 'logical',
  'seating arrangements': 'logical',
  'seating arrangement': 'logical',
  'puzzles': 'logical',
  'input & output': 'logical',
  'input output': 'logical',
  'statements & conclusions': 'logical',
  'analogies': 'logical',
  'classification': 'logical',
  'order & ranking': 'logical',
  'ranking': 'logical',
  'venn diagrams': 'logical',
  'data interpretation': 'logical',

  // Verbal
  'synonyms & antonyms': 'verbal',
  'synonyms antonyms': 'verbal',
  'sentence correction': 'verbal',
  'fill in the blanks': 'verbal',
  'reading comprehension': 'verbal',
  'idioms & phrases': 'verbal',
  'para jumbles': 'verbal',
  'error detection': 'verbal',
  'one word substitution': 'verbal',
  'active & passive voice': 'verbal',
  'vocabulary': 'verbal',
  'grammar': 'verbal',
};

const getTopicSubtype = (topic) =>
  TOPIC_APTITUDE_SUBTYPE[topic?.toLowerCase()?.trim()] || null;

// ── Grade helper ───────────────────────────────────────────────
const getGrade = (p) => {
  if (p >= 85) return { label: 'Excellent', emoji: '🏆', color: '#06D6A0' };
  if (p >= 70) return { label: 'Good', emoji: '👍', color: '#7C5CFC' };
  if (p >= 55) return { label: 'Average', emoji: '📝', color: '#FFB347' };
  if (p >= 40) return { label: 'Poor', emoji: '⚠️', color: '#FF6B6B' };
  return { label: 'Very Poor', emoji: '❌', color: '#e53935' };
};

// ─────────────────────────────────────────────────────────────
// TopicAccordion — one collapsible row per topic
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

      {/* Header row */}
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

        {/* Topic name + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontWeight: 700, fontSize: 14,
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

        {/* Badges */}
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

      {/* Expanded: test buttons */}
      {open && numTests > 0 && (
        <div style={{
          padding: '0 18px 16px 33px',
          borderTop: `1px dashed ${cfg.color}25`,
          paddingTop: 12,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 10,
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
                  onClick={e => {
                    e.stopPropagation();
                    isDone ? onViewResult(topic, idx) : onStart(topic, idx);
                  }}
                  style={{
                    padding: '7px 18px', borderRadius: 8,
                    border: `1.5px solid ${isDone ? 'rgba(6,214,160,0.45)' : `${cfg.color}45`}`,
                    background: isDone ? 'rgba(6,214,160,0.1)' : `${cfg.color}10`,
                    color: isDone ? '#06D6A0' : cfg.color,
                    fontWeight: 700, fontSize: 13,
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
// AptitudeBreakdown — NEW component, shows quant/logical/verbal
// ─────────────────────────────────────────────────────────────
function AptitudeBreakdown({ breakdown }) {
  if (!breakdown) return null;
  const hasAny = breakdown.quantitative != null || breakdown.logical != null || breakdown.verbal != null;
  if (!hasAny) return null;

  const rows = [
    { label: 'Quantitative', key: 'quantitative', color: '#7C5CFC', icon: '📐' },
    { label: 'Logical', key: 'logical', color: '#FF6B6B', icon: '🧩' },
    { label: 'Verbal', key: 'verbal', color: '#06D6A0', icon: '📝' },
  ];

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14, padding: '16px 18px', marginBottom: 14,
    }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
        textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14,
      }}>
        🎯 Aptitude Breakdown
      </div>
      {rows.map(({ label, key, color, icon }) => {
        const val = breakdown[key];
        if (val == null) return null;
        const grade = getGrade(val);
        return (
          <div key={key} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>{icon}</span>
                <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, color: grade.color,
                  background: `${grade.color}15`, border: `1px solid ${grade.color}30`,
                  borderRadius: 10, padding: '2px 8px',
                }}>
                  {grade.label}
                </span>
                <span style={{ fontWeight: 900, fontSize: 15, color }}>{val.toFixed(0)}%</span>
              </div>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5 }}>
              <div style={{
                height: '100%', borderRadius: 5,
                background: color,
                width: `${val}%`,
                transition: 'width 1s ease',
              }} />
            </div>
          </div>
        );
      })}

      {/* Domain tip based on weakest area */}
      {(() => {
        const filled = rows.filter(r => breakdown[r.key] != null);
        if (filled.length < 2) return null;
        const weakest = filled.reduce((a, b) => breakdown[a.key] < breakdown[b.key] ? a : b);
        const tips = {
          quantitative: 'Practice Percentages, Profit & Loss, and Time & Work daily on IndiaBix.',
          logical: 'Solve Puzzles, Syllogisms, and Blood Relations — 15 min/day improves logical score fast.',
          verbal: 'Read 1 article/day and practice Sentence Correction to boost verbal ability.',
        };
        return (
          <div style={{
            marginTop: 10, padding: '10px 12px',
            background: `${weakest.color}10`,
            border: `1px solid ${weakest.color}25`,
            borderRadius: 8,
            fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5,
          }}>
            💡 <strong style={{ color: weakest.color }}>Weakest area: {weakest.label}</strong>
            {' — '}{tips[weakest.key]}
          </div>
        );
      })()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Main Assessment Component
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

  // Track answered count
  useEffect(() => { setAnswered(Object.keys(answers).length); }, [answers]);

  // Load history on mount
  useEffect(() => {
    API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
  }, []);

  // Load topic counts when section changes
  useEffect(() => {
    if (section) {
      API.get(`/assessment/topic-counts/${SECTION_TO_TYPE[section]}`)
        .then(r => setTopicCounts(r.data))
        .catch(() => { });
    }
  }, [section]);

  // Build completed tests map from history
  const completedTests = React.useMemo(() => {
    const map = new Map();
    history.forEach(h => {
      if (h.scores?._topic) {
        const t = h.scores._topic;
        const idx = h.scores._test_index;
        if (!map.has(t)) map.set(t, new Set());
        if (idx !== undefined) map.get(t).add(idx);
      }
    });
    return map;
  }, [history]);

  // ── Timer ──────────────────────────────────────────────────
  useEffect(() => {
    if (!timerOn) return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setTimerOn(false);
          toast.warning("⏰ Time's up! Auto-submitting...");
          handleAutoSubmit();
          return 0;
        }
        if (t === 120) toast.warning('⚠️ 2 minutes remaining!');
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [timerOn]);

  const startTimer = (n) => { setTimeLeft(Math.min(Math.max(n * 60, 300), 900)); setTimerOn(true); };
  const stopTimer = () => { clearInterval(timerRef.current); setTimerOn(false); };
  const fmtTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  const timerColor = timeLeft <= 60 ? '#FF6B6B' : timeLeft <= 120 ? '#FFD93D' : '#06D6A0';

  // ── Auto-submit when timer ends ───────────────────────────
  const handleAutoSubmit = async () => {
    setLoading(true);
    try {
      const payload = { type: SECTION_TO_TYPE[section] || 'aptitude', answers };
      if (selTopic !== 'General') { payload.topic = selTopic; payload.test_index = currentTestIndex; }
      const res = await API.post('/assessment/submit', payload);
      setResult(res.data);
      setScreen('result');
      toast.success('Auto-submitted! 🎉');
      API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
    } catch { toast.error('Submission failed'); }
    finally { setLoading(false); }
  };

  // ── Start topic-specific test ─────────────────────────────
  const startTopicTest = async (topic, tIndex = 1) => {
    setLoading(true);
    setSelTopic(topic);
    setCurrentTestIndex(tIndex);
    try {
      const res = await API.get(`/assessment/questions/${SECTION_TO_TYPE[section]}`, {
        params: { topic, count: 10, skip: (tIndex - 1) * 10 },
      });
      if (!res.data.questions?.length) {
        toast.warning(`No questions for "${topic}".`);
        setLoading(false);
        return;
      }
      setQuestions(res.data.questions);
      setAnswers({});
      setResult(null);
      setCurrentPage(0);
      setScreen('quiz');
      startTimer(res.data.questions.length);
    } catch (err) {
      toast.warning(
        err.response?.status === 404
          ? `No questions uploaded for "${topic}" yet.`
          : 'Failed to load questions'
      );
    } finally { setLoading(false); }
  };

  // ── Start general mixed test ──────────────────────────────
  const startGeneralTest = async (sec) => {
    setLoading(true);
    setSelTopic('General');
    setCurrentTestIndex(null);
    try {
      const res = await API.get(`/assessment/questions/${SECTION_TO_TYPE[sec]}`, {
        params: { count: 20 },
      });
      if (!res.data.questions?.length) {
        toast.warning('No questions found.');
        setLoading(false);
        return;
      }
      setQuestions(res.data.questions);
      setAnswers({});
      setResult(null);
      setCurrentPage(0);
      setScreen('quiz');
      startTimer(res.data.questions.length);
    } catch { toast.error('Failed to load questions'); }
    finally { setLoading(false); }
  };

  // ── Submit answers ────────────────────────────────────────
  const submit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.warning(`Answer all ${questions.length} questions!`);
      return;
    }
    stopTimer();
    setLoading(true);
    try {
      const payload = { type: SECTION_TO_TYPE[section], answers };
      if (selTopic !== 'General') { payload.topic = selTopic; payload.test_index = currentTestIndex; }
      const res = await API.post('/assessment/submit', payload);
      setResult(res.data);
      setScreen('result');
      toast.success('Submitted! 🎉');
      API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
    } catch { toast.error('Submission failed'); }
    finally { setLoading(false); }
  };

  // ── View a previously completed test result ───────────────
  const viewResult = (topic, testIndex) => {
    const match = history.find(
      h => h.scores?._topic === topic && h.scores?._test_index === testIndex
    );
    if (match) {
      setResult({
        percentage: match.percentage,
        // FIX: use actual score fields instead of hardcoded 10
        score: match.total_score ?? Math.round((match.percentage / 100) * 10),
        total: match.max_score ?? 10,
        topic_scores: match.scores || {},
        review: [],   // review not stored in history — retake to see
        aptitude_breakdown: match.aptitude_breakdown || null,
      });
      setSelTopic(topic);
      setScreen('result');
    } else {
      toast.error('Result not found');
    }
  };

  // ── Reset everything back to home ─────────────────────────
  const reset = () => {
    stopTimer();
    setTimeLeft(0);
    setSearchQuery('');
    setScreen('home');
    setSection(null);
    setSelTopic(null);
    setCurrentTestIndex(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setCurrentPage(0);
  };

  // ══════════════════════════════════════════════════════════
  // RESULT SCREEN
  // ══════════════════════════════════════════════════════════
  if (screen === 'result' && result) {
    const grade = getGrade(result.percentage);
    const cfg = TOPIC_CONFIG[section] || TOPIC_CONFIG.aptitude;

    // Determine if this section produces aptitude breakdown
    const isAptitudeType = ['aptitude', 'logical', 'verbal'].includes(section);

    // Build breakdown from result or infer from topic if viewing history
    let breakdown = result.aptitude_breakdown || null;
    if (!breakdown && isAptitudeType && selTopic && selTopic !== 'General') {
      const subtype = getTopicSubtype(selTopic);
      if (subtype) {
        breakdown = { [subtype]: result.percentage };
      }
    }

    return (
      <div style={{ width: '100%', maxWidth: 800 }}>

        {/* Back button */}
        <button
          onClick={() => setScreen('topics')}
          style={{
            background: 'none', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, padding: '6px 14px',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
            fontSize: 13, fontWeight: 600, marginBottom: 20, fontFamily: 'inherit',
          }}
        >← Back to Topics</button>

        {/* Score card */}
        <div style={{
          background: `${grade.color}10`,
          border: `1.5px solid ${grade.color}35`,
          borderRadius: 20, padding: '32px 28px',
          textAlign: 'center', marginBottom: 16,
        }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>{grade.emoji}</div>
          <div style={{ fontSize: 56, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
            {result.percentage?.toFixed(0)}%
          </div>
          <div style={{ fontWeight: 700, color: grade.color, margin: '6px 0 4px', fontSize: 16 }}>
            {grade.label}
          </div>
          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>
            {result.score} / {result.total} correct
          </div>
          {selTopic && selTopic !== 'General' && (
            <div style={{
              marginTop: 8, fontSize: 12, color: 'rgba(255,255,255,0.3)',
              fontWeight: 600,
            }}>
              {selTopic}{currentTestIndex ? ` · Test ${currentTestIndex}` : ''}
            </div>
          )}
          {/* Progress bar */}
          <div style={{
            marginTop: 16, height: 6,
            background: 'rgba(255,255,255,0.07)', borderRadius: 6, overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', width: `${result.percentage}%`,
              background: grade.color, borderRadius: 6, transition: 'width 1s',
            }} />
          </div>
        </div>

        {/* Reliability badge */}
        {result.reliability && (
          <div style={{
            padding: '10px 14px', borderRadius: 10, marginBottom: 14,
            background: `${result.reliability.color}12`,
            border: `1px solid ${result.reliability.color}30`,
            fontSize: 13, color: result.reliability.color, fontWeight: 600,
          }}>
            {result.reliability.level === 'high' ? '✅' :
              result.reliability.level === 'medium' ? '📈' : '⚠️'}{' '}
            {result.reliability.message}
          </div>
        )}

        {/* ── NEW: Aptitude breakdown ─────────────────────── */}
        {isAptitudeType && <AptitudeBreakdown breakdown={breakdown} />}

        {/* Topic breakdown */}
        {Object.entries(result.topic_scores || {}).filter(([k]) => !k.startsWith('_')).length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: '16px 18px', marginBottom: 14,
          }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12,
            }}>Topic Breakdown</div>
            {Object.entries(result.topic_scores)
              .filter(([k]) => !k.startsWith('_'))
              .map(([t, s]) => (
                <div key={t} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{t}</span>
                    <span style={{ fontWeight: 800, fontSize: 13, color: cfg.color }}>{s}%</span>
                  </div>
                  <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
                    <div style={{
                      height: '100%', borderRadius: 4,
                      background: cfg.color, width: `${s}%`, transition: 'width 0.8s',
                    }} />
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Answer review */}
        {result.review?.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)',
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
            }}>Review</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.review.map((r, i) => {
                const correct = r.chosen?.trim() === r.correct?.trim();
                return (
                  <div key={i} style={{
                    background: correct ? 'rgba(6,214,160,0.05)' : 'rgba(255,107,107,0.05)',
                    border: `1px solid ${correct ? 'rgba(6,214,160,0.2)' : 'rgba(255,107,107,0.2)'}`,
                    borderRadius: 10, padding: '12px 14px',
                  }}>
                    <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.4, color: '#EEEEFF' }}>
                      Q{i + 1}: {r.question}
                    </p>
                    <div style={{ fontSize: 12, color: correct ? '#06D6A0' : '#FF6B6B' }}>
                      Your answer: <strong>{r.chosen}</strong>
                    </div>
                    {!correct && (
                      <div style={{ fontSize: 12, color: '#06D6A0', marginTop: 3 }}>
                        Correct: <strong>{r.correct}</strong>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* History note when viewing old result */}
        {(!result.review || result.review.length === 0) && (
          <div style={{
            padding: '12px 14px', borderRadius: 10, marginBottom: 14,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
            fontSize: 13, color: 'rgba(255,255,255,0.3)', textAlign: 'center',
          }}>
            💡 Retake this test to see the full question-by-question review
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => startTopicTest(selTopic, currentTestIndex || 1)}
            className="btn btn-primary"
            style={{ flex: 1, justifyContent: 'center' }}
          >🔁 Retake</button>
          <button
            onClick={() => setScreen('topics')}
            className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
          >📚 Topics</button>
          <button
            onClick={reset}
            className="btn btn-outline"
            style={{ flex: 1, justifyContent: 'center' }}
          >🏠 Home</button>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // QUIZ SCREEN
  // ══════════════════════════════════════════════════════════
  if (screen === 'quiz' && questions.length) {
    const cfg = TOPIC_CONFIG[section] || TOPIC_CONFIG.aptitude;
    const totalPages = Math.ceil(questions.length / Q_PER_PAGE);
    const visible = questions.slice(currentPage * Q_PER_PAGE, (currentPage + 1) * Q_PER_PAGE);

    return (
      <div style={{ width: '100%', maxWidth: 860 }}>

        {/* Quiz header */}
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'flex-start', marginBottom: 18,
          flexWrap: 'wrap', gap: 10,
        }}>
          <div>
            <div style={{
              fontSize: 11, fontWeight: 700, color: cfg.color,
              textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3,
            }}>
              {cfg.icon} {cfg.label}
            </div>
            <h2 style={{ fontWeight: 800, fontSize: 19, color: '#EEEEFF', margin: 0 }}>
              {selTopic}
            </h2>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
              {questions.length} questions{currentTestIndex ? ` · Test ${currentTestIndex}` : ''}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {/* Timer */}
            <div style={{
              padding: '7px 14px', borderRadius: 10,
              background: `${timerColor}15`,
              border: `1.5px solid ${timerColor}40`,
              color: timerColor, fontWeight: 900, fontSize: 16,
              fontFamily: 'monospace',
              boxShadow: timeLeft <= 60 ? `0 0 12px ${timerColor}40` : 'none',
            }}>
              ⏱ {fmtTime(timeLeft)}
            </div>
            {/* Answered counter */}
            <div style={{
              padding: '7px 12px', borderRadius: 10,
              background: 'rgba(124,92,252,0.1)',
              border: '1px solid rgba(124,92,252,0.2)',
              color: '#A29BFE', fontWeight: 800, fontSize: 13,
            }}>
              {answered}/{questions.length}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 20 }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: cfg.color,
            width: `${(answered / questions.length) * 100}%`,
            transition: 'width 0.3s',
          }} />
        </div>

        {/* Page navigation dots */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i)}
                style={{
                  width: 26, height: 26, borderRadius: 6,
                  border: 'none', cursor: 'pointer',
                  fontWeight: 700, fontSize: 11, fontFamily: 'inherit',
                  background: i === currentPage ? cfg.color : 'rgba(255,255,255,0.07)',
                  color: i === currentPage ? '#fff' : 'rgba(255,255,255,0.3)',
                }}
              >{i + 1}</button>
            ))}
          </div>
        )}

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {visible.map((q, idx) => {
            const absIdx = currentPage * Q_PER_PAGE + idx;
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
                    background: cfg.color, color: '#fff',
                    fontSize: 11, fontWeight: 900, flexShrink: 0,
                  }}>{absIdx + 1}</span>
                  {q.question}
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
                  {q.options.map((opt, oi) => {
                    const chosen = answers[q.id] === opt;
                    return (
                      <button
                        key={opt}
                        onClick={() => setAnswers({ ...answers, [q.id]: opt })}
                        style={{
                          padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                          border: `1.5px solid ${chosen ? cfg.color : 'rgba(255,255,255,0.08)'}`,
                          background: chosen ? `${cfg.color}18` : 'rgba(255,255,255,0.02)',
                          color: chosen ? cfg.color : 'rgba(255,255,255,0.6)',
                          fontWeight: chosen ? 700 : 500, fontSize: 13,
                          textAlign: 'left', fontFamily: 'inherit',
                          display: 'flex', alignItems: 'center', gap: 7,
                          transition: 'all 0.12s',
                        }}
                      >
                        <span style={{
                          width: 20, height: 20, borderRadius: 4, flexShrink: 0,
                          background: chosen ? cfg.color : 'rgba(255,255,255,0.06)',
                          color: chosen ? '#fff' : 'rgba(255,255,255,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, fontWeight: 800,
                        }}>
                          {['A', 'B', 'C', 'D'][oi]}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom navigation */}
        <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
          {currentPage > 0 ? (
            <button
              className="btn btn-outline"
              onClick={() => setCurrentPage(c => c - 1)}
              style={{ padding: '12px 18px' }}
            >← Prev</button>
          ) : (
            <button
              className="btn btn-outline"
              onClick={() => { stopTimer(); setScreen('topics'); }}
              style={{ padding: '12px 18px' }}
            >← Quit</button>
          )}
          {currentPage < totalPages - 1 ? (
            <button
              className="btn btn-primary"
              onClick={() => setCurrentPage(c => c + 1)}
              style={{ flex: 1, justifyContent: 'center' }}
            >Next →</button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={submit}
              disabled={loading}
              style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg,#06D6A0,#04B486)' }}
            >
              {loading ? '⏳ Submitting...' : `✅ Submit (${answered}/${questions.length})`}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // TOPIC PICKER SCREEN
  // ══════════════════════════════════════════════════════════
  if (screen === 'topics' && section) {
    const cfg = TOPIC_CONFIG[section];
    const filtered = cfg.topics.filter(t =>
      t.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const totalQs = Object.values(topicCounts).reduce((a, b) => a + b, 0);

    return (
      <div style={{ width: '100%', maxWidth: 1000 }}>

        {/* Breadcrumb */}
        <button
          onClick={reset}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600,
            padding: 0, fontFamily: 'inherit', marginBottom: 18,
            display: 'flex', alignItems: 'center', gap: 5,
          }}
        >← Assessment Center</button>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{cfg.icon}</div>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: 21, color: '#EEEEFF', margin: 0 }}>
              {cfg.label}
            </h1>
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
            borderRadius: 14, padding: '16px 22px', margin: '18px 0',
            cursor: loading ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            boxShadow: `0 4px 18px ${cfg.color}30`,
            transition: 'transform 0.18s, box-shadow 0.18s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}45`;
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = `0 4px 18px ${cfg.color}30`;
          }}
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

        {/* Search box */}
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
          fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.22)',
          textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8,
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
            <div style={{
              textAlign: 'center', padding: 32,
              color: 'rgba(255,255,255,0.25)', fontSize: 14,
            }}>
              No topics match "{searchQuery}"
            </div>
          )}
        </div>

        {loading && (
          <div style={{
            textAlign: 'center', padding: 32,
            color: 'rgba(255,255,255,0.3)', fontSize: 13,
          }}>
            ⏳ Loading questions...
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════
  // HOME SCREEN — section cards
  // ══════════════════════════════════════════════════════════
  return (
    <div style={{ width: '100%', maxWidth: 1200 }}>
      <h1 style={{ fontWeight: 800, fontSize: 24, color: '#EEEEFF', marginBottom: 6 }}>
        📝 Assessment Center
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 28, fontSize: 14 }}>
        Choose a category, then pick a topic to start practising
      </p>

      {/* Section cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
        gap: 12,
      }}>
        {Object.entries(TOPIC_CONFIG).map(([key, cfg]) => (
          <div
            key={key}
            onClick={() => { setSection(key); setScreen('topics'); setTopicCounts({}); setSearchQuery(''); }}
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: `1.5px solid ${cfg.color}20`,
              borderRadius: 16, padding: '22px 20px',
              cursor: 'pointer', transition: 'all 0.18s',
              position: 'relative', overflow: 'hidden',
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
            {/* Background glow */}
            <div style={{
              position: 'absolute', top: -16, right: -16,
              width: 70, height: 70, borderRadius: '50%',
              background: `${cfg.color}10`, filter: 'blur(18px)', pointerEvents: 'none',
            }} />

            <div style={{ fontSize: 28, marginBottom: 12 }}>{cfg.icon}</div>
            <h3 style={{ fontWeight: 800, color: cfg.color, fontSize: 14, marginBottom: 5 }}>
              {cfg.label}
            </h3>
            <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginBottom: 14 }}>
              {cfg.topics.length} topics
            </p>

            {/* Sample topic pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
              {cfg.topics.slice(0, 3).map(t => (
                <span key={t} style={{
                  background: `${cfg.color}10`, color: cfg.color,
                  border: `1px solid ${cfg.color}20`,
                  borderRadius: 5, padding: '2px 7px',
                  fontSize: 10, fontWeight: 600,
                }}>{t}</span>
              ))}
              <span style={{
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.25)',
                borderRadius: 5, padding: '2px 7px',
                fontSize: 10, fontWeight: 600,
              }}>+{cfg.topics.length - 3}</span>
            </div>

            {/* Open button */}
            <div style={{
              background: cfg.gradient, borderRadius: 8, padding: '9px 0',
              textAlign: 'center', fontWeight: 800, fontSize: 12, color: '#fff',
            }}>
              Open →
            </div>
          </div>
        ))}
      </div>

      {/* Recent test history */}
      {history.length > 0 && (
        <div style={{ marginTop: 28 }}>
          <div style={{
            fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.22)',
            textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10,
          }}>
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
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{
                    fontWeight: 600, fontSize: 13,
                    color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize',
                  }}>
                    {h.type?.replace('_', ' ')}
                    {h.scores?._topic ? ` · ${h.scores._topic}` : ''}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 800, color: col, fontSize: 14 }}>
                      {pct.toFixed(0)}%
                    </span>
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

// const TOPIC_CONFIG = {
//   aptitude: {
//     label: 'Quantitative Aptitude', icon: '📐', color: '#7C5CFC',
//     gradient: 'linear-gradient(135deg,#7C5CFC,#a78bfa)',
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
//     label: 'Logical Reasoning', icon: '🧩', color: '#FF6B6B',
//     gradient: 'linear-gradient(135deg,#FF6B6B,#ff8fab)',
//     topics: [
//       'Number Series', 'Letter Series', 'Syllogisms', 'Blood Relations',
//       'Coding & Decoding', 'Direction Sense', 'Seating Arrangements',
//       'Puzzles', 'Input & Output', 'Statements & Conclusions',
//       'Analogies', 'Classification', 'Order & Ranking', 'Venn Diagrams',
//     ]
//   },
//   verbal: {
//     label: 'Verbal Ability', icon: '📝', color: '#06D6A0',
//     gradient: 'linear-gradient(135deg,#06D6A0,#38f9d7)',
//     topics: [
//       'Synonyms & Antonyms', 'Sentence Correction', 'Fill in the Blanks',
//       'Reading Comprehension', 'Idioms & Phrases', 'Para Jumbles',
//       'Error Detection', 'One Word Substitution', 'Active & Passive Voice', 'Vocabulary',
//     ]
//   },
//   technical: {
//     label: 'Technical', icon: '💻', color: '#FFB347',
//     gradient: 'linear-gradient(135deg,#FFB347,#ffcc02)',
//     topics: [
//       'Python', 'Java', 'C++', 'Data Structures', 'Algorithms',
//       'DBMS', 'Operating System', 'Networking', 'OOP Concepts',
//       'Web Technologies', 'Software Engineering', 'Cloud Computing',
//     ]
//   },
//   soft_skill: {
//     label: 'Soft Skills', icon: '🤝', color: '#4ECDC4',
//     gradient: 'linear-gradient(135deg,#4ECDC4,#06D6A0)',
//     topics: [
//       'Communication', 'Leadership', 'Teamwork', 'Time Management',
//       'Problem Solving', 'Critical Thinking', 'Emotional Intelligence',
//       'Conflict Resolution', 'Presentation Skills', 'Work Ethics',
//     ]
//   }
// };

// const SECTION_TO_TYPE = {
//   aptitude: 'aptitude', logical: 'aptitude', verbal: 'aptitude',
//   technical: 'technical', soft_skill: 'soft_skill',
// };

// const getGrade = (p) => {
//   if (p >= 85) return { label: 'Excellent', emoji: '🏆', color: '#06D6A0' };
//   if (p >= 70) return { label: 'Good', emoji: '👍', color: '#7C5CFC' };
//   if (p >= 55) return { label: 'Average', emoji: '📝', color: '#FFB347' };
//   if (p >= 40) return { label: 'Poor', emoji: '⚠️', color: '#FF6B6B' };
//   return { label: 'Very Poor', emoji: '❌', color: '#e53935' };
// };

// // ─────────────────────────────────────────────────────────────
// // TopicAccordion — one row per topic, expand to show tests
// // ─────────────────────────────────────────────────────────────
// function TopicAccordion({ topic, count, cfg, completedTests, onStart, onViewResult, loading }) {
//   const [open, setOpen] = useState(false);
//   const numTests = count > 0 ? Math.ceil(count / 10) : 0;
//   const done = completedTests.get(topic) || new Set();
//   const doneCount = done.size;
//   const allDone = numTests > 0 && doneCount >= numTests;

//   return (
//     <div style={{
//       borderRadius: 12,
//       border: `1.5px solid ${open ? cfg.color + '55' : 'rgba(255,255,255,0.07)'}`,
//       overflow: 'hidden',
//       background: open ? `${cfg.color}09` : 'transparent',
//       transition: 'all 0.2s',
//     }}>

//       {/* ── Header row — always visible ── */}
//       <div
//         onClick={() => numTests > 0 && setOpen(o => !o)}
//         style={{
//           display: 'flex',
//           alignItems: 'center',
//           padding: '14px 18px',
//           cursor: numTests > 0 ? 'pointer' : 'default',
//           gap: 12,
//           userSelect: 'none',
//         }}
//       >
//         {/* Accent bar */}
//         <div style={{
//           width: 3, height: 36, borderRadius: 3, flexShrink: 0,
//           background: numTests > 0 ? cfg.color : 'rgba(255,255,255,0.1)',
//         }} />

//         {/* Topic info */}
//         <div style={{ flex: 1, minWidth: 0 }}>
//           <div style={{
//             fontWeight: 700,
//             fontSize: 14,
//             color: numTests > 0 ? '#EEEEFF' : 'rgba(255,255,255,0.25)',
//             whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
//           }}>
//             {topic}
//           </div>
//           <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
//             {numTests > 0
//               ? `${count} questions · ${numTests} test${numTests > 1 ? 's' : ''}`
//               : 'No questions uploaded yet'}
//           </div>
//         </div>

//         {/* Right side badges */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
//           {numTests > 0 && doneCount > 0 && (
//             <div style={{
//               fontSize: 11, fontWeight: 700,
//               color: allDone ? '#06D6A0' : cfg.color,
//               background: allDone ? 'rgba(6,214,160,0.12)' : `${cfg.color}15`,
//               border: `1px solid ${allDone ? 'rgba(6,214,160,0.3)' : `${cfg.color}30`}`,
//               borderRadius: 20, padding: '3px 10px',
//             }}>
//               {allDone ? '✓ Complete' : `${doneCount}/${numTests} done`}
//             </div>
//           )}
//           {numTests > 0 && (
//             <div style={{
//               fontSize: 11,
//               color: open ? cfg.color : 'rgba(255,255,255,0.2)',
//               transition: 'transform 0.2s, color 0.2s',
//               transform: open ? 'rotate(180deg)' : 'none',
//               fontWeight: 800,
//             }}>▼</div>
//           )}
//         </div>
//       </div>

//       {/* ── Expanded: test buttons ── */}
//       {open && numTests > 0 && (
//         <div style={{
//           padding: '0 18px 16px 33px',
//           borderTop: `1px dashed ${cfg.color}25`,
//           paddingTop: 12,
//         }}>
//           <div style={{
//             fontSize: 11, fontWeight: 600,
//             color: 'rgba(255,255,255,0.22)',
//             textTransform: 'uppercase', letterSpacing: '0.8px',
//             marginBottom: 10,
//           }}>
//             Choose a test
//           </div>
//           <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
//             {Array.from({ length: numTests }, (_, i) => i + 1).map(idx => {
//               const isDone = done.has(idx);
//               return (
//                 <button
//                   key={idx}
//                   disabled={loading}
//                   onClick={e => { e.stopPropagation(); isDone ? onViewResult(topic, idx) : onStart(topic, idx); }}
//                   style={{
//                     padding: '7px 18px',
//                     borderRadius: 8,
//                     border: `1.5px solid ${isDone ? 'rgba(6,214,160,0.45)' : `${cfg.color}45`}`,
//                     background: isDone ? 'rgba(6,214,160,0.1)' : `${cfg.color}10`,
//                     color: isDone ? '#06D6A0' : cfg.color,
//                     fontWeight: 700,
//                     fontSize: 13,
//                     cursor: loading ? 'wait' : 'pointer',
//                     fontFamily: 'inherit',
//                     transition: 'all 0.15s',
//                     display: 'flex', alignItems: 'center', gap: 5,
//                   }}
//                   onMouseEnter={e => {
//                     if (!loading) {
//                       e.currentTarget.style.background = isDone ? 'rgba(6,214,160,0.2)' : `${cfg.color}25`;
//                       e.currentTarget.style.transform = 'translateY(-1px)';
//                     }
//                   }}
//                   onMouseLeave={e => {
//                     e.currentTarget.style.background = isDone ? 'rgba(6,214,160,0.1)' : `${cfg.color}10`;
//                     e.currentTarget.style.transform = 'none';
//                   }}
//                 >
//                   {isDone && <span style={{ fontSize: 10 }}>✓</span>}
//                   Test {idx}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ─────────────────────────────────────────────────────────────
// // Main Assessment component
// // ─────────────────────────────────────────────────────────────
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
//   const [currentPage, setCurrentPage] = useState(0);
//   const [searchQuery, setSearchQuery] = useState('');
//   const Q_PER_PAGE = 10;

//   const [timeLeft, setTimeLeft] = useState(0);
//   const [timerOn, setTimerOn] = useState(false);
//   const timerRef = React.useRef(null);

//   useEffect(() => { setAnswered(Object.keys(answers).length); }, [answers]);
//   useEffect(() => {
//     API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
//   }, []);
//   useEffect(() => {
//     if (section) {
//       API.get(`/assessment/topic-counts/${SECTION_TO_TYPE[section]}`)
//         .then(r => setTopicCounts(r.data)).catch(() => { });
//     }
//   }, [section]);

//   const completedTests = React.useMemo(() => {
//     const map = new Map();
//     history.forEach(h => {
//       if (h.scores?._topic) {
//         const t = h.scores._topic, idx = h.scores._test_index;
//         if (!map.has(t)) map.set(t, new Set());
//         if (idx !== undefined) map.get(t).add(idx);
//       }
//     });
//     return map;
//   }, [history]);

//   // Timer
//   useEffect(() => {
//     if (!timerOn) return;
//     timerRef.current = setInterval(() => {
//       setTimeLeft(t => {
//         if (t <= 1) {
//           clearInterval(timerRef.current); setTimerOn(false);
//           toast.warning('⏰ Time\'s up! Auto-submitting...');
//           handleAutoSubmit(); return 0;
//         }
//         if (t === 120) toast.warning('⚠️ 2 minutes remaining!');
//         return t - 1;
//       });
//     }, 1000);
//     return () => clearInterval(timerRef.current);
//   }, [timerOn]);

//   const startTimer = n => { setTimeLeft(Math.min(Math.max(n * 60, 300), 900)); setTimerOn(true); };
//   const stopTimer = () => { clearInterval(timerRef.current); setTimerOn(false); };
//   const fmtTime = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
//   const timerColor = timeLeft <= 60 ? '#FF6B6B' : timeLeft <= 120 ? '#FFD93D' : '#06D6A0';

//   const handleAutoSubmit = async () => {
//     setLoading(true);
//     try {
//       const payload = { type: SECTION_TO_TYPE[section] || 'aptitude', answers };
//       if (selTopic !== 'General') { payload.topic = selTopic; payload.test_index = currentTestIndex; }
//       const res = await API.post('/assessment/submit', payload);
//       setResult(res.data); setScreen('result');
//       toast.success('Auto-submitted! 🎉');
//       API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
//     } catch { toast.error('Submission failed'); }
//     finally { setLoading(false); }
//   };

//   const startTopicTest = async (topic, tIndex = 1) => {
//     setLoading(true); setSelTopic(topic); setCurrentTestIndex(tIndex);
//     try {
//       const res = await API.get(`/assessment/questions/${SECTION_TO_TYPE[section]}`, {
//         params: { topic, count: 10, skip: (tIndex - 1) * 10 }
//       });
//       if (!res.data.questions?.length) { toast.warning(`No questions for "${topic}".`); setLoading(false); return; }
//       setQuestions(res.data.questions); setAnswers({}); setResult(null);
//       setCurrentPage(0); setScreen('quiz'); startTimer(res.data.questions.length);
//     } catch (err) {
//       toast.warning(err.response?.status === 404 ? `No questions uploaded for "${topic}" yet.` : 'Failed to load questions');
//     }
//     finally { setLoading(false); }
//   };

//   const startGeneralTest = async sec => {
//     setLoading(true); setSelTopic('General'); setCurrentTestIndex(null);
//     try {
//       const res = await API.get(`/assessment/questions/${SECTION_TO_TYPE[sec]}`, { params: { count: 20 } });
//       if (!res.data.questions?.length) { toast.warning('No questions found.'); setLoading(false); return; }
//       setQuestions(res.data.questions); setAnswers({}); setResult(null);
//       setCurrentPage(0); setScreen('quiz'); startTimer(res.data.questions.length);
//     } catch { toast.error('Failed to load questions'); }
//     finally { setLoading(false); }
//   };

//   const submit = async () => {
//     if (Object.keys(answers).length < questions.length) {
//       toast.warning(`Answer all ${questions.length} questions!`); return;
//     }
//     stopTimer(); setLoading(true);
//     try {
//       const payload = { type: SECTION_TO_TYPE[section], answers };
//       if (selTopic !== 'General') { payload.topic = selTopic; payload.test_index = currentTestIndex; }
//       const res = await API.post('/assessment/submit', payload);
//       setResult(res.data); setScreen('result');
//       toast.success('Submitted! 🎉');
//       API.get('/assessment/history').then(r => setHistory(r.data)).catch(() => { });
//     } catch { toast.error('Submission failed'); }
//     finally { setLoading(false); }
//   };

//   const viewResult = (topic, testIndex) => {
//     const match = history.find(h => h.scores?._topic === topic && h.scores?._test_index === testIndex);
//     if (match) {
//       setResult({ percentage: match.percentage, score: Math.round((match.percentage / 100) * 10), total: 10, topic_scores: { [topic]: match.percentage }, ...match });
//       setSelTopic(topic); setScreen('result');
//     } else toast.error('Result not found');
//   };

//   const reset = () => {
//     stopTimer(); setTimeLeft(0); setSearchQuery('');
//     setScreen('home'); setSection(null); setSelTopic(null); setCurrentTestIndex(null);
//     setQuestions([]); setAnswers({}); setResult(null); setCurrentPage(0);
//   };

//   // ══════════════════════════════════════════════════════
//   // RESULT SCREEN
//   // ══════════════════════════════════════════════════════
//   if (screen === 'result' && result) {
//     const grade = getGrade(result.percentage);
//     const cfg = TOPIC_CONFIG[section] || TOPIC_CONFIG.aptitude;
//     return (
//       <div style={{ maxWidth: 660 }}>
//         <button onClick={() => setScreen('topics')} style={{
//           background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
//           padding: '6px 14px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
//           fontSize: 13, fontWeight: 600, marginBottom: 20, fontFamily: 'inherit',
//         }}>← Back to Topics</button>

//         <div style={{
//           background: `${grade.color}10`,
//           border: `1.5px solid ${grade.color}35`,
//           borderRadius: 20, padding: '32px 28px', textAlign: 'center', marginBottom: 16,
//         }}>
//           <div style={{ fontSize: 52, marginBottom: 10 }}>{grade.emoji}</div>
//           <div style={{ fontSize: 56, fontWeight: 900, color: grade.color, lineHeight: 1 }}>
//             {result.percentage?.toFixed(0)}%
//           </div>
//           <div style={{ fontWeight: 700, color: grade.color, margin: '6px 0 4px', fontSize: 16 }}>{grade.label}</div>
//           <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 13 }}>{result.score} / {result.total} correct</div>
//           <div style={{ marginTop: 16, height: 6, background: 'rgba(255,255,255,0.07)', borderRadius: 6, overflow: 'hidden' }}>
//             <div style={{ height: '100%', width: `${result.percentage}%`, background: grade.color, borderRadius: 6, transition: 'width 1s' }} />
//           </div>
//         </div>

//         {Object.entries(result.topic_scores || {}).filter(([k]) => !k.startsWith('_')).length > 0 && (
//           <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', marginBottom: 14 }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Topic Breakdown</div>
//             {Object.entries(result.topic_scores).filter(([k]) => !k.startsWith('_')).map(([t, s]) => (
//               <div key={t} style={{ marginBottom: 10 }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
//                   <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{t}</span>
//                   <span style={{ fontWeight: 800, fontSize: 13, color: cfg.color }}>{s}%</span>
//                 </div>
//                 <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4 }}>
//                   <div style={{ height: '100%', borderRadius: 4, background: cfg.color, width: `${s}%`, transition: 'width 0.8s' }} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {result.review?.length > 0 && (
//           <div style={{ marginBottom: 20 }}>
//             <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Review</div>
//             <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//               {result.review.map((r, i) => {
//                 const correct = r.chosen?.trim() === r.correct?.trim();
//                 return (
//                   <div key={i} style={{
//                     background: correct ? 'rgba(6,214,160,0.05)' : 'rgba(255,107,107,0.05)',
//                     border: `1px solid ${correct ? 'rgba(6,214,160,0.2)' : 'rgba(255,107,107,0.2)'}`,
//                     borderRadius: 10, padding: '12px 14px',
//                   }}>
//                     <p style={{ fontWeight: 700, fontSize: 13, marginBottom: 6, lineHeight: 1.4, color: '#EEEEFF' }}>Q{i + 1}: {r.question}</p>
//                     <div style={{ fontSize: 12, color: correct ? '#06D6A0' : '#FF6B6B' }}>Your answer: <strong>{r.chosen}</strong></div>
//                     {!correct && <div style={{ fontSize: 12, color: '#06D6A0', marginTop: 3 }}>Correct: <strong>{r.correct}</strong></div>}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
//           <button onClick={() => startTopicTest(selTopic, currentTestIndex || 1)} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>🔁 Retake</button>
//           <button onClick={() => setScreen('topics')} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>📚 Topics</button>
//           <button onClick={reset} className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}>🏠 Home</button>
//         </div>
//       </div>
//     );
//   }

//   // ══════════════════════════════════════════════════════
//   // QUIZ SCREEN
//   // ══════════════════════════════════════════════════════
//   if (screen === 'quiz' && questions.length) {
//     const cfg = TOPIC_CONFIG[section] || TOPIC_CONFIG.aptitude;
//     const totalPages = Math.ceil(questions.length / Q_PER_PAGE);
//     const visible = questions.slice(currentPage * Q_PER_PAGE, (currentPage + 1) * Q_PER_PAGE);

//     return (
//       <div style={{ maxWidth: 720 }}>
//         {/* Quiz header */}
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18, flexWrap: 'wrap', gap: 10 }}>
//           <div>
//             <div style={{ fontSize: 11, fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 3 }}>
//               {cfg.icon} {cfg.label}
//             </div>
//             <h2 style={{ fontWeight: 800, fontSize: 19, color: '#EEEEFF', margin: 0 }}>{selTopic}</h2>
//             <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
//               {questions.length} questions{currentTestIndex ? ` · Test ${currentTestIndex}` : ''}
//             </div>
//           </div>
//           <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
//             <div style={{
//               padding: '7px 14px', borderRadius: 10,
//               background: `${timerColor}15`, border: `1.5px solid ${timerColor}40`,
//               color: timerColor, fontWeight: 900, fontSize: 16,
//               fontFamily: 'monospace',
//               boxShadow: timeLeft <= 60 ? `0 0 12px ${timerColor}40` : 'none',
//             }}>
//               ⏱ {fmtTime(timeLeft)}
//             </div>
//             <div style={{
//               padding: '7px 12px', borderRadius: 10,
//               background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)',
//               color: '#A29BFE', fontWeight: 800, fontSize: 13,
//             }}>
//               {answered}/{questions.length}
//             </div>
//           </div>
//         </div>

//         {/* Progress */}
//         <div style={{ height: 4, background: 'rgba(255,255,255,0.06)', borderRadius: 4, marginBottom: 20 }}>
//           <div style={{ height: '100%', borderRadius: 4, background: cfg.color, width: `${(answered / questions.length) * 100}%`, transition: 'width 0.3s' }} />
//         </div>

//         {/* Page dots */}
//         {totalPages > 1 && (
//           <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button key={i} onClick={() => setCurrentPage(i)} style={{
//                 width: 26, height: 26, borderRadius: 6, border: 'none', cursor: 'pointer',
//                 fontWeight: 700, fontSize: 11, fontFamily: 'inherit',
//                 background: i === currentPage ? cfg.color : 'rgba(255,255,255,0.07)',
//                 color: i === currentPage ? '#fff' : 'rgba(255,255,255,0.3)',
//               }}>{i + 1}</button>
//             ))}
//           </div>
//         )}

//         {/* Questions */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
//           {visible.map((q, idx) => {
//             const ai = currentPage * Q_PER_PAGE + idx;
//             return (
//               <div key={q.id} style={{
//                 background: answers[q.id] ? `${cfg.color}08` : 'rgba(255,255,255,0.02)',
//                 border: `1.5px solid ${answers[q.id] ? `${cfg.color}40` : 'rgba(255,255,255,0.07)'}`,
//                 borderRadius: 14, padding: '18px 18px', transition: 'all 0.15s',
//               }}>
//                 <p style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, lineHeight: 1.6, color: '#EEEEFF' }}>
//                   <span style={{
//                     display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
//                     width: 22, height: 22, borderRadius: 5, marginRight: 8,
//                     background: cfg.color, color: '#fff', fontSize: 11, fontWeight: 900, flexShrink: 0,
//                   }}>{ai + 1}</span>
//                   {q.question}
//                 </p>
//                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
//                   {q.options.map((opt, oi) => {
//                     const chosen = answers[q.id] === opt;
//                     return (
//                       <button key={opt} onClick={() => setAnswers({ ...answers, [q.id]: opt })} style={{
//                         padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
//                         border: `1.5px solid ${chosen ? cfg.color : 'rgba(255,255,255,0.08)'}`,
//                         background: chosen ? `${cfg.color}18` : 'rgba(255,255,255,0.02)',
//                         color: chosen ? cfg.color : 'rgba(255,255,255,0.6)',
//                         fontWeight: chosen ? 700 : 500, fontSize: 13,
//                         textAlign: 'left', fontFamily: 'inherit',
//                         display: 'flex', alignItems: 'center', gap: 7,
//                         transition: 'all 0.12s',
//                       }}>
//                         <span style={{
//                           width: 20, height: 20, borderRadius: 4, flexShrink: 0,
//                           background: chosen ? cfg.color : 'rgba(255,255,255,0.06)',
//                           color: chosen ? '#fff' : 'rgba(255,255,255,0.3)',
//                           display: 'flex', alignItems: 'center', justifyContent: 'center',
//                           fontSize: 10, fontWeight: 800,
//                         }}>{['A', 'B', 'C', 'D'][oi]}</span>
//                         {opt}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div style={{ display: 'flex', gap: 8, marginTop: 20 }}>
//           {currentPage > 0
//             ? <button className="btn btn-outline" onClick={() => setCurrentPage(c => c - 1)} style={{ padding: '12px 18px' }}>← Prev</button>
//             : <button className="btn btn-outline" onClick={() => { stopTimer(); setScreen('topics'); }} style={{ padding: '12px 18px' }}>← Quit</button>
//           }
//           {currentPage < totalPages - 1
//             ? <button className="btn btn-primary" onClick={() => setCurrentPage(c => c + 1)} style={{ flex: 1, justifyContent: 'center' }}>Next →</button>
//             : <button className="btn btn-primary" onClick={submit} disabled={loading} style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg,#06D6A0,#04B486)' }}>
//               {loading ? '⏳ Submitting...' : `✅ Submit (${answered}/${questions.length})`}
//             </button>
//           }
//         </div>
//       </div>
//     );
//   }

//   // ══════════════════════════════════════════════════════
//   // TOPIC PICKER — accordion list
//   // ══════════════════════════════════════════════════════
//   if (screen === 'topics' && section) {
//     const cfg = TOPIC_CONFIG[section];
//     const filtered = cfg.topics.filter(t =>
//       t.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//     const totalQs = Object.values(topicCounts).reduce((a, b) => a + b, 0);

//     return (
//       <div style={{ maxWidth: 820 }}>

//         {/* Breadcrumb */}
//         <button onClick={reset} style={{
//           background: 'none', border: 'none', cursor: 'pointer',
//           color: 'rgba(255,255,255,0.3)', fontSize: 12, fontWeight: 600,
//           padding: 0, fontFamily: 'inherit', marginBottom: 18,
//           display: 'flex', alignItems: 'center', gap: 5,
//         }}>
//           ← Assessment Center
//         </button>

//         {/* Section header */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
//           <div style={{
//             width: 46, height: 46, borderRadius: 12, flexShrink: 0,
//             background: `${cfg.color}15`, border: `1px solid ${cfg.color}30`,
//             display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
//           }}>{cfg.icon}</div>
//           <div>
//             <h1 style={{ fontWeight: 800, fontSize: 21, color: '#EEEEFF', margin: 0 }}>{cfg.label}</h1>
//             <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>
//               {cfg.topics.length} topics · {totalQs} total questions
//             </div>
//           </div>
//         </div>

//         {/* Mixed test banner */}
//         <div
//           onClick={() => !loading && startGeneralTest(section)}
//           style={{
//             background: cfg.gradient,
//             borderRadius: 14, padding: '16px 22px',
//             margin: '18px 0',
//             cursor: loading ? 'wait' : 'pointer',
//             display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//             boxShadow: `0 4px 18px ${cfg.color}30`,
//             transition: 'transform 0.18s, box-shadow 0.18s',
//           }}
//           onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 8px 24px ${cfg.color}45`; }}
//           onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = `0 4px 18px ${cfg.color}30`; }}
//         >
//           <div>
//             <div style={{ fontWeight: 800, fontSize: 15, color: '#fff' }}>🎯 Full Mixed Test</div>
//             <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>
//               20 random questions from all {cfg.topics.length} topics
//             </div>
//           </div>
//           <div style={{
//             background: 'rgba(255,255,255,0.22)', borderRadius: 8,
//             padding: '6px 14px', color: '#fff', fontWeight: 800, fontSize: 13,
//           }}>
//             {loading ? '...' : 'Start →'}
//           </div>
//         </div>

//         {/* Search */}
//         <div style={{ position: 'relative', marginBottom: 14 }}>
//           <span style={{
//             position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)',
//             fontSize: 14, color: 'rgba(255,255,255,0.25)',
//           }}>🔍</span>
//           <input
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             placeholder="Search topics..."
//             style={{
//               width: '100%', padding: '9px 12px 9px 34px',
//               borderRadius: 9, border: '1.5px solid rgba(255,255,255,0.09)',
//               background: 'rgba(255,255,255,0.04)', color: '#EEEEFF',
//               fontSize: 13, fontFamily: 'inherit', outline: 'none',
//               boxSizing: 'border-box',
//             }}
//           />
//         </div>

//         {/* Topics label */}
//         <div style={{
//           fontSize: 11, fontWeight: 700,
//           color: 'rgba(255,255,255,0.22)',
//           textTransform: 'uppercase', letterSpacing: '0.8px',
//           marginBottom: 8,
//         }}>
//           📚 Topic-wise Practice — {filtered.length} topics
//         </div>

//         {/* Accordion list */}
//         <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//           {filtered.map(topic => (
//             <TopicAccordion
//               key={topic}
//               topic={topic}
//               count={topicCounts[topic] || 0}
//               cfg={cfg}
//               completedTests={completedTests}
//               onStart={startTopicTest}
//               onViewResult={viewResult}
//               loading={loading}
//             />
//           ))}
//           {filtered.length === 0 && (
//             <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.25)', fontSize: 14 }}>
//               No topics match "{searchQuery}"
//             </div>
//           )}
//         </div>

//         {loading && (
//           <div style={{ textAlign: 'center', padding: 32, color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>
//             ⏳ Loading questions...
//           </div>
//         )}
//       </div>
//     );
//   }

//   // ══════════════════════════════════════════════════════
//   // HOME — section cards
//   // ══════════════════════════════════════════════════════
//   return (
//     <div style={{ maxWidth: 920 }}>
//       <h1 style={{ fontWeight: 800, fontSize: 24, color: '#EEEEFF', marginBottom: 6 }}>
//         📝 Assessment Center
//       </h1>
//       <p style={{ color: 'rgba(255,255,255,0.3)', marginBottom: 28, fontSize: 14 }}>
//         Choose a category, then pick a topic to start practicing
//       </p>

//       <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
//         {Object.entries(TOPIC_CONFIG).map(([key, cfg]) => (
//           <div key={key}
//             onClick={() => { setSection(key); setScreen('topics'); setTopicCounts({}); setSearchQuery(''); }}
//             style={{
//               background: 'rgba(255,255,255,0.03)',
//               border: `1.5px solid ${cfg.color}20`,
//               borderRadius: 16, padding: '22px 20px', cursor: 'pointer',
//               transition: 'all 0.18s', position: 'relative', overflow: 'hidden',
//             }}
//             onMouseEnter={e => {
//               e.currentTarget.style.borderColor = `${cfg.color}50`;
//               e.currentTarget.style.background = `${cfg.color}08`;
//               e.currentTarget.style.transform = 'translateY(-3px)';
//               e.currentTarget.style.boxShadow = `0 10px 28px ${cfg.color}15`;
//             }}
//             onMouseLeave={e => {
//               e.currentTarget.style.borderColor = `${cfg.color}20`;
//               e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
//               e.currentTarget.style.transform = 'none';
//               e.currentTarget.style.boxShadow = 'none';
//             }}
//           >
//             {/* Glow */}
//             <div style={{
//               position: 'absolute', top: -16, right: -16, width: 70, height: 70,
//               borderRadius: '50%', background: `${cfg.color}10`, filter: 'blur(18px)', pointerEvents: 'none',
//             }} />

//             <div style={{ fontSize: 28, marginBottom: 12 }}>{cfg.icon}</div>
//             <h3 style={{ fontWeight: 800, color: cfg.color, fontSize: 14, marginBottom: 5 }}>{cfg.label}</h3>
//             <p style={{ color: 'rgba(255,255,255,0.28)', fontSize: 12, marginBottom: 14 }}>
//               {cfg.topics.length} topics
//             </p>
//             <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
//               {cfg.topics.slice(0, 3).map(t => (
//                 <span key={t} style={{
//                   background: `${cfg.color}10`, color: cfg.color,
//                   border: `1px solid ${cfg.color}20`,
//                   borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 600,
//                 }}>{t}</span>
//               ))}
//               <span style={{
//                 background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.25)',
//                 borderRadius: 5, padding: '2px 7px', fontSize: 10, fontWeight: 600,
//               }}>+{cfg.topics.length - 3}</span>
//             </div>
//             <div style={{
//               background: cfg.gradient, borderRadius: 8, padding: '9px 0',
//               textAlign: 'center', fontWeight: 800, fontSize: 12, color: '#fff',
//             }}>
//               Open →
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Recent history */}
//       {history.length > 0 && (
//         <div style={{ marginTop: 28 }}>
//           <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
//             Recent Tests
//           </div>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
//             {history.slice(0, 5).map((h, i) => {
//               const pct = h.percentage || 0;
//               const col = pct >= 70 ? '#06D6A0' : pct >= 50 ? '#FFD93D' : '#FF6B6B';
//               return (
//                 <div key={i} style={{
//                   display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                   padding: '10px 14px', borderRadius: 9,
//                   background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)',
//                 }}>
//                   <span style={{ fontWeight: 600, fontSize: 13, color: 'rgba(255,255,255,0.5)', textTransform: 'capitalize' }}>
//                     {h.type?.replace('_', ' ')}{h.scores?._topic ? ` · ${h.scores._topic}` : ''}
//                   </span>
//                   <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
//                     <span style={{ fontWeight: 800, color: col, fontSize: 14 }}>{pct.toFixed(0)}%</span>
//                     <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
//                       {new Date(h.taken_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
//                     </span>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

