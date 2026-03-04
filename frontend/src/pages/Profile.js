import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

const INTERESTS = ['Web Development', 'Data Science', 'Machine Learning', 'Cybersecurity', 'Cloud Computing', 'Mobile Development', 'Game Development', 'IoT/Embedded', 'DevOps', 'Blockchain'];
const SKILLS = ['Python', 'Java', 'C++', 'JavaScript', 'React', 'Node.js', 'Machine Learning', 'SQL', 'Docker', 'AWS'];

export default function Profile() {
  const [profile, setProfile] = useState({ interests: [], skills: {}, personality: '', career_goal: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/profile/').then(r => setProfile({
      interests: r.data.interests || [],
      skills: r.data.skills || {},
      personality: r.data.personality || '',
      career_goal: r.data.career_goal || ''
    })).catch(() => { });
  }, []);

  const toggleInterest = i => setProfile(p => ({
    ...p, interests: p.interests.includes(i) ? p.interests.filter(x => x !== i) : [...p.interests, i]
  }));

  const setSkill = (s, v) => setProfile(p => ({ ...p, skills: { ...p.skills, [s]: parseInt(v) } }));

  const save = async () => {
    setLoading(true);
    try { await API.put('/profile/', profile); toast.success('Profile saved ✅'); }
    catch { toast.error('Failed to save'); }
    finally { setLoading(false); }
  };

  const SKILL_COLORS = ['#7C5CFC', '#FF6B6B', '#06D6A0', '#FFD93D', '#4ECDC4', '#A29BFE', '#FD79A8', '#74B9FF', '#55EFC4', '#FDCB6E'];

  return (
    <div style={{ maxWidth: 820, fontFamily: 'Inter,sans-serif' }}>
      <h1 className="page-title">Profile Setup</h1>
      <p className="page-sub">Tell us about yourself for accurate AI career predictions</p>

      {/* ── Interests ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
          ❤️ Your Interests
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {INTERESTS.map(i => {
            const on = profile.interests.includes(i);
            return (
              <button key={i} onClick={() => toggleInterest(i)} style={{
                padding: '9px 18px', borderRadius: 20,
                border: `1px solid ${on ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
                background: on ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)',
                color: on ? '#A29BFE' : 'rgba(255,255,255,0.4)',
                fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif',
                transition: 'all 0.2s'
              }}>{on ? '✓ ' : ''}{i}</button>
            );
          })}
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
          💡 Skill Ratings (0 – 10)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {SKILLS.map((s, i) => {
            const val = profile.skills[s] || 0;
            const col = SKILL_COLORS[i];
            return (
              <div key={s}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>{s}</span>
                  <span style={{ fontSize: 14, fontWeight: 900, color: col }}>{val}/10</span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[...Array(10)].map((_, n) => (
                    <div key={n} onClick={() => setSkill(s, n + 1)} style={{
                      flex: 1, height: 8, borderRadius: 6,
                      background: n < val ? col : 'rgba(255,255,255,0.06)',
                      cursor: 'pointer', transition: 'all 0.15s',
                      boxShadow: n < val ? `0 0 6px ${col}55` : 'none'
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Career goal & personality ── */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 18 }}>
          🎯 Career Details
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Career Goal</label>
            <input value={profile.career_goal}
              onChange={e => setProfile({ ...profile, career_goal: e.target.value })}
              placeholder="e.g. Become a Data Scientist at a top MNC" />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>Personality Type</label>
            <select value={profile.personality}
              onChange={e => setProfile({ ...profile, personality: e.target.value })}>
              <option value="">Select your personality type</option>
              {['Analytical', 'Creative', 'Leader', 'Team Player', 'Detail-oriented', 'Innovative', 'Communicator'].map(p => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={save} disabled={loading}
        style={{ fontSize: 15, padding: '13px 32px' }}>
        {loading ? '⏳ Saving...' : '💾 Save Profile'}
      </button>
    </div>
  );
}
