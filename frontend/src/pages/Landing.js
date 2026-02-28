import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './index.css';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100vh',
            background: '#0a0a0f',
            color: '#fff',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>

            {/* Background Glows */}
            <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: 500, height: 500, background: 'rgba(124,92,252,0.15)', filter: 'blur(120px)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: 600, height: 600, background: 'rgba(6,214,160,0.1)', filter: 'blur(150px)', borderRadius: '50%' }} />

            <div style={{
                maxWidth: 1200,
                width: '100%',
                padding: '0 40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 60,
                zIndex: 1,
                flexWrap: 'wrap'
            }}>

                {/* Left Content */}
                <div style={{ flex: 1, minWidth: 400 }}>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', background: 'rgba(124,92,252,0.1)',
                        border: '1px solid rgba(124,92,252,0.2)', borderRadius: 20,
                        color: '#A29BFE', fontWeight: 700, fontSize: 13, marginBottom: 24
                    }}>
                        <span style={{ fontSize: 16 }}>✨</span> AI-Powered Career Guidance
                    </div>

                    <h1 style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontSize: '3.5rem',
                        fontWeight: 900,
                        lineHeight: 1.1,
                        marginBottom: 24,
                        color: '#F0F0FF'
                    }}>
                        Discover Your <br />
                        <span style={{
                            background: 'linear-gradient(135deg, #7C5CFC, #06D6A0)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>Perfect Career Path</span>
                    </h1>

                    <p style={{
                        fontSize: '1.1rem',
                        color: 'rgba(255,255,255,0.6)',
                        lineHeight: 1.6,
                        marginBottom: 40,
                        maxWidth: 500
                    }}>
                        Navigate your professional journey with personalized AI insights, roadmap generation, skill gap analysis, and interview preparation tailored just for you.
                    </p>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/login')}
                            style={{
                                background: 'linear-gradient(135deg, #7C5CFC, #5A35F0)',
                                color: '#fff',
                                border: 'none',
                                padding: '16px 32px',
                                borderRadius: 14,
                                fontSize: '1.1rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 8px 32px rgba(124,92,252,0.4)',
                                transition: 'all 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.transform = 'translateY(-3px)';
                                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,92,252,0.6)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.transform = 'none';
                                e.currentTarget.style.boxShadow = '0 8px 32px rgba(124,92,252,0.4)';
                            }}
                        >
                            Get Started <span>→</span>
                        </button>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, fontWeight: 600 }}>
                            Join 10,000+ students navigating their careers.
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div style={{ flex: 1, minWidth: 400, display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        position: 'relative',
                        width: '100%',
                        maxWidth: 550,
                        aspectRatio: '1',
                        borderRadius: 30,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        backdropFilter: 'blur(20px)',
                        padding: 24,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.4)'
                    }}>
                        <img
                            src="/career_guidance_hero.png"
                            alt="AI Career Guidance Illustration"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: 20
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentNode.innerHTML = `
                  <div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; flex-direction:column; color:rgba(255,255,255,0.3); font-weight:700;">
                    <div style="font-size:48px; margin-bottom:16px;">🚀</div>
                    Illustration Placeholder
                  </div>
                `;
                            }}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}
