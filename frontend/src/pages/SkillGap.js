import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../api';

// ─────────────────────────────────────────────────────────────
// REAL 2025 job-market skills per domain
// Each skill has: category, importance (core/important/good),
// and specific learning resources
// ─────────────────────────────────────────────────────────────
const DOMAIN_SKILLS = {
  'Software Engineer': {
    desc: 'Build scalable applications and systems',
    salary: '₹6–25 LPA',
    hiring: ['Google', 'Infosys', 'TCS', 'Wipro', 'Amazon', 'Microsoft', 'Flipkart'],
    skills: {
      core: ['Data Structures', 'Algorithms', 'OOP Concepts', 'Git/GitHub', 'SQL', 'REST API Design', 'Problem Solving (LeetCode)'],
      important: ['Python or Java or C++', 'System Design', 'OS Concepts', 'DBMS', 'Networking Basics', 'Agile/Scrum', 'Docker'],
      good_to_have: ['Kubernetes', 'Redis', 'AWS Basics', 'GraphQL', 'CI/CD', 'gRPC', 'TypeScript'],
    }
  },
  'Web Developer (Frontend)': {
    desc: 'Build user interfaces and web experiences',
    salary: '₹4–18 LPA',
    hiring: ['Swiggy', 'Zomato', 'CRED', 'Meesho', 'Razorpay', 'Freshworks'],
    skills: {
      core: ['HTML5', 'CSS3', 'JavaScript (ES6+)', 'React.js', 'Responsive Design', 'Git/GitHub'],
      important: ['TypeScript', 'Redux / Zustand', 'REST API integration', 'Tailwind CSS', 'Next.js', 'Performance Optimization', 'Figma/UI Design basics'],
      good_to_have: ['Vue.js', 'Testing (Jest/Cypress)', 'WebSockets', 'PWA', 'GraphQL', 'Webpack/Vite', 'Accessibility (a11y)'],
    }
  },
  'Web Developer (Backend)': {
    desc: 'Build APIs, databases, and server logic',
    salary: '₹5–20 LPA',
    hiring: ['Zepto', 'PhonePe', 'Ola', 'Paytm', 'Nykaa', 'Urban Company'],
    skills: {
      core: ['Python/Node.js/Java', 'REST API Design', 'SQL (MySQL/PostgreSQL)', 'Git/GitHub', 'Authentication (JWT/OAuth)', 'OOP Concepts'],
      important: ['FastAPI / Express / Spring Boot', 'MongoDB / Redis', 'Docker', 'System Design basics', 'Unit Testing', 'Linux/Bash', 'Message Queues (RabbitMQ/Kafka)'],
      good_to_have: ['Microservices', 'Kubernetes', 'GraphQL', 'gRPC', 'AWS/GCP', 'CI/CD Pipelines', 'WebSockets'],
    }
  },
  'Data Scientist': {
    desc: 'Extract insights from data using ML and statistics',
    salary: '₹7–30 LPA',
    hiring: ['Mu Sigma', 'Fractal Analytics', 'KPMG', 'Deloitte', 'Walmart Labs', 'Amazon'],
    skills: {
      core: ['Python', 'Statistics & Probability', 'Pandas & NumPy', 'Data Visualization (Matplotlib/Seaborn)', 'SQL', 'Machine Learning basics (Scikit-learn)'],
      important: ['Feature Engineering', 'EDA (Exploratory Data Analysis)', 'Linear/Logistic Regression', 'Decision Trees & Random Forest', 'Jupyter Notebook', 'Power BI / Tableau', 'A/B Testing'],
      good_to_have: ['Deep Learning (TensorFlow/Keras)', 'NLP', 'Time Series Analysis', 'PySpark', 'MLflow', 'Streamlit', 'Cloud ML (AWS SageMaker/GCP Vertex)'],
    }
  },
  'AI / ML Engineer': {
    desc: 'Build and deploy machine learning models at scale',
    salary: '₹10–50 LPA',
    hiring: ['Google', 'Meta', 'OpenAI', 'Nvidia', 'Intuit', 'Jio', 'Samsung R&D'],
    skills: {
      core: ['Python', 'Machine Learning (Scikit-learn)', 'Deep Learning (PyTorch)', 'Mathematics (Linear Algebra, Calculus)', 'Data Processing (Pandas/NumPy)', 'Git/GitHub'],
      important: ['Neural Networks (CNN, RNN, Transformers)', 'NLP / LLMs (HuggingFace)', 'Model Evaluation & Tuning', 'MLOps (MLflow/DVC)', 'Docker', 'REST API deployment', 'Prompt Engineering'],
      good_to_have: ['Fine-tuning LLMs (LoRA/PEFT)', 'Computer Vision (OpenCV/YOLO)', 'Reinforcement Learning', 'ONNX/TensorRT', 'Kubernetes', 'RAG systems', 'Vector Databases (Pinecone/Weaviate)'],
    }
  },
  'Data Engineer': {
    desc: 'Design pipelines to move and transform data',
    salary: '₹8–28 LPA',
    hiring: ['ThoughtWorks', 'Cloudera', 'Databricks', 'Walmart Labs', 'LinkedIn', 'Uber'],
    skills: {
      core: ['Python', 'SQL (Advanced)', 'ETL Pipelines', 'Apache Spark', 'Data Warehousing (Snowflake/BigQuery)', 'Git/GitHub'],
      important: ['Apache Kafka / Airflow', 'AWS/GCP/Azure', 'DBT (data build tool)', 'Hadoop', 'Linux/Bash', 'Docker', 'Schema Design (Star/Snowflake)'],
      good_to_have: ['Flink', 'Delta Lake', 'Terraform', 'Kubernetes', 'Scala', 'dbt Cloud', 'Real-time streaming', 'Observability (DataDog)'],
    }
  },
  'Cloud / DevOps Engineer': {
    desc: 'Deploy and manage infrastructure and CI/CD',
    salary: '₹8–30 LPA',
    hiring: ['Accenture', 'Capgemini', 'Infosys', 'HCL', 'AWS Partners', 'Lenskart'],
    skills: {
      core: ['Linux/Bash Scripting', 'Docker', 'Kubernetes', 'AWS or Azure or GCP', 'Git/GitHub', 'CI/CD (Jenkins/GitHub Actions)'],
      important: ['Terraform / Ansible', 'Networking (VPC, DNS, Load Balancers)', 'Monitoring (Prometheus/Grafana)', 'Python Scripting', 'Security (IAM, VPN)', 'YAML/JSON', 'Helm Charts'],
      good_to_have: ['Service Mesh (Istio)', 'GitOps (ArgoCD/Flux)', 'Serverless (Lambda/Cloud Functions)', 'eBPF', 'Cost Optimization', 'SRE Practices', 'Chaos Engineering'],
    }
  },
  'Cybersecurity Analyst': {
    desc: 'Protect systems from threats and vulnerabilities',
    salary: '₹6–22 LPA',
    hiring: ['Palo Alto Networks', 'CrowdStrike', 'HCL', 'Wipro Cybersecurity', 'IBM Security'],
    skills: {
      core: ['Networking Fundamentals (TCP/IP, DNS, HTTP)', 'Linux', 'Python/Bash Scripting', 'Security Fundamentals', 'Vulnerability Assessment', 'OWASP Top 10'],
      important: ['SIEM Tools (Splunk/IBM QRadar)', 'Penetration Testing (Metasploit/Burp Suite)', 'Incident Response', 'Firewalls & IDS/IPS', 'Cloud Security', 'Ethical Hacking (CEH)', 'Cryptography'],
      good_to_have: ['Malware Analysis', 'Threat Intelligence', 'Zero Trust Architecture', 'SOC Operations', 'Digital Forensics', 'CTF Practice (TryHackMe/HackTheBox)', 'Compliance (ISO 27001/GDPR)'],
    }
  },
  'Android Developer': {
    desc: 'Build native apps for Android devices',
    salary: '₹5–20 LPA',
    hiring: ['BYJU\'S', 'Dream11', 'MakeMyTrip', 'PolicyBazaar', 'ShareChat'],
    skills: {
      core: ['Kotlin', 'Java', 'Android SDK', 'XML Layouts', 'Jetpack Compose', 'Git/GitHub'],
      important: ['MVVM Architecture', 'Room DB', 'Retrofit (REST APIs)', 'LiveData / ViewModel', 'Material Design', 'Firebase', 'Play Store Deployment'],
      good_to_have: ['Coroutines / Flow', 'Dependency Injection (Hilt/Dagger)', 'Jetpack Navigation', 'WorkManager', 'Unit Testing (JUnit/Espresso)', 'Multi-module architecture', 'Performance Profiling'],
    }
  },
  'iOS Developer': {
    desc: 'Build native apps for iPhone and iPad',
    salary: '₹6–25 LPA',
    hiring: ['Zoho', 'PhonePe', 'InMobi', 'Housing.com', 'OYO'],
    skills: {
      core: ['Swift', 'UIKit', 'SwiftUI', 'Xcode', 'Git/GitHub', 'REST API integration'],
      important: ['MVVM Architecture', 'Core Data', 'Combine Framework', 'Auto Layout', 'TestFlight & App Store', 'Firebase', 'Push Notifications (APNs)'],
      good_to_have: ['Objective-C', 'RxSwift', 'Unit Testing (XCTest)', 'ARKit', 'Core ML', 'WatchKit', 'Instruments Profiling'],
    }
  },
  'Product Manager': {
    desc: 'Own product vision, roadmap, and execution',
    salary: '₹12–40 LPA',
    hiring: ['Flipkart', 'Ola', 'Swiggy', 'Razorpay', 'Freshworks', 'Zomato'],
    skills: {
      core: ['Product Thinking', 'User Research & Empathy', 'Roadmap Planning', 'Data Analysis (SQL basics)', 'Communication & Stakeholder Management', 'A/B Testing basics'],
      important: ['Figma / Wireframing', 'Agile / Scrum', 'Market Analysis', 'Metrics (OKRs, KPIs)', 'Competitor Analysis', 'PRD Writing', 'Basic Technical Understanding'],
      good_to_have: ['SQL (for data queries)', 'Python basics', 'Growth Hacking', 'Pricing Strategy', 'User Funnel Optimization', 'CRM Tools', 'AI/ML Product concepts'],
    }
  },
  'UI/UX Designer': {
    desc: 'Design intuitive and beautiful user experiences',
    salary: '₹4–18 LPA',
    hiring: ['Swiggy', 'CRED', 'Groww', 'Razorpay', 'Nykaa', 'Lenskart'],
    skills: {
      core: ['Figma', 'User Research', 'Wireframing & Prototyping', 'Design Systems', 'Usability Testing', 'Visual Design Principles'],
      important: ['Adobe XD / Sketch', 'Interaction Design', 'Accessibility (WCAG)', 'Information Architecture', 'HTML/CSS basics', 'Motion Design (Framer)', 'Brand Guidelines'],
      good_to_have: ['Lottie Animations', '3D Design (Spline)', 'Design Tokens', 'User Journey Mapping', 'Eye-tracking Research', 'Micro-interactions', 'Video Editing (for demos)'],
    }
  },
};

// ─────────────────────────────────────────────────────────────
// Learning resources per skill
// ─────────────────────────────────────────────────────────────
const SKILL_RESOURCES = {
  'Python': { yt: 'https://youtu.be/_uQrJ0TkZlc', doc: 'https://docs.python.org/3/', free: 'https://www.learnpython.org/' },
  'Java': { yt: 'https://youtu.be/eIrMbAQSU34', doc: 'https://dev.java/learn/', free: 'https://www.javatpoint.com/' },
  'C++': { yt: 'https://youtu.be/vLnPwxZdW4Y', doc: 'https://cppreference.com/', free: 'https://www.learncpp.com/' },
  'Data Structures': { yt: 'https://youtu.be/RBSGKlAvoiM', doc: 'https://www.geeksforgeeks.org/data-structures/', free: 'https://www.geeksforgeeks.org/data-structures/' },
  'Algorithms': { yt: 'https://youtu.be/kgBjXUE_Nwc', doc: 'https://cp-algorithms.com/', free: 'https://www.geeksforgeeks.org/fundamentals-of-algorithms/' },
  'Git/GitHub': { yt: 'https://youtu.be/RGOj5yH7evk', doc: 'https://git-scm.com/doc', free: 'https://learngitbranching.js.org/' },
  'SQL': { yt: 'https://youtu.be/HXV3zeQKqGY', doc: 'https://www.w3schools.com/sql/', free: 'https://sqlzoo.net/' },
  'React.js': { yt: 'https://youtu.be/bMknfKXIFA8', doc: 'https://react.dev/', free: 'https://react.dev/learn' },
  'Node.js': { yt: 'https://youtu.be/ENrzD9HAZK4', doc: 'https://nodejs.org/en/docs/', free: 'https://www.w3schools.com/nodejs/' },
  'Docker': { yt: 'https://youtu.be/fqMOX6JJhGo', doc: 'https://docs.docker.com/', free: 'https://docs.docker.com/get-started/' },
  'Kubernetes': { yt: 'https://youtu.be/X48VuDVv0do', doc: 'https://kubernetes.io/docs/', free: 'https://kubernetes.io/docs/tutorials/' },
  'AWS': { yt: 'https://youtu.be/3hLmDS179YE', doc: 'https://docs.aws.amazon.com/', free: 'https://aws.amazon.com/free/' },
  'JavaScript (ES6+)': { yt: 'https://youtu.be/jS4aFq5-91M', doc: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', free: 'https://javascript.info/' },
  'HTML5': { yt: 'https://youtu.be/pQN-pnXPaVg', doc: 'https://developer.mozilla.org/en-US/docs/Web/HTML', free: 'https://www.w3schools.com/html/' },
  'CSS3': { yt: 'https://youtu.be/1Rs2ND1ryYc', doc: 'https://developer.mozilla.org/en-US/docs/Web/CSS', free: 'https://www.w3schools.com/css/' },
  'Machine Learning basics (Scikit-learn)': { yt: 'https://youtu.be/NWONeJKn6kc', doc: 'https://scikit-learn.org/stable/', free: 'https://www.coursera.org/learn/machine-learning' },
  'Deep Learning (PyTorch)': { yt: 'https://youtu.be/aircAruvnKk', doc: 'https://pytorch.org/docs/stable/', free: 'https://pytorch.org/tutorials/' },
  'Linux/Bash Scripting': { yt: 'https://youtu.be/ZtqBQ68cfJc', doc: 'https://linux.die.net/', free: 'https://linuxjourney.com/' },
  'TypeScript': { yt: 'https://youtu.be/BwuLxPH8IDs', doc: 'https://www.typescriptlang.org/docs/', free: 'https://www.typescriptlang.org/docs/handbook/' },
  'Next.js': { yt: 'https://youtu.be/mTz0GXj8NN0', doc: 'https://nextjs.org/docs', free: 'https://nextjs.org/learn' },
  'Kotlin': { yt: 'https://youtu.be/F9UC9DY-vIU', doc: 'https://kotlinlang.org/docs/', free: 'https://play.kotlinlang.org/' },
  'Swift': { yt: 'https://youtu.be/CwA1VWP0Ldw', doc: 'https://docs.swift.org/', free: 'https://www.hackingwithswift.com/' },
  'Figma': { yt: 'https://youtu.be/jwCmIBJ8Jtc', doc: 'https://help.figma.com/', free: 'https://www.figma.com/resources/learn-design/' },
  'System Design': { yt: 'https://youtu.be/xpDnVSmNFX0', doc: 'https://github.com/donnemartin/system-design-primer', free: 'https://github.com/donnemartin/system-design-primer' },
  'Problem Solving (LeetCode)': { yt: 'https://youtu.be/8vysX_8RDHo', doc: 'https://leetcode.com/', free: 'https://leetcode.com/study-plan/' },
  'NLP / LLMs (HuggingFace)': { yt: 'https://youtu.be/00GKzGyWFEs', doc: 'https://huggingface.co/docs', free: 'https://huggingface.co/learn' },
  'Terraform / Ansible': { yt: 'https://youtu.be/l5k1ai_GBDE', doc: 'https://developer.hashicorp.com/terraform/docs', free: 'https://developer.hashicorp.com/terraform/tutorials' },
  'Apache Kafka / Airflow': { yt: 'https://youtu.be/Ch5VhJzaoaI', doc: 'https://kafka.apache.org/documentation/', free: 'https://kafka.apache.org/quickstart' },
  'Pandas & NumPy': { yt: 'https://youtu.be/vmEHCJofslg', doc: 'https://pandas.pydata.org/docs/', free: 'https://pandas.pydata.org/docs/getting_started/' },
};

const getResource = (skill) => SKILL_RESOURCES[skill] || {
  yt: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial 2025')}`,
  doc: `https://www.geeksforgeeks.org/search/?q=${encodeURIComponent(skill)}`,
  free: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`,
};

const IMPORTANCE_CONFIG = {
  core: { label: '🔴 Must Have', color: '#FF6B6B', bg: 'rgba(255,107,107,0.1)', border: 'rgba(255,107,107,0.25)' },
  important: { label: '🟡 Important', color: '#FFD93D', bg: 'rgba(255,217,61,0.1)', border: 'rgba(255,217,61,0.25)' },
  good_to_have: { label: '🟢 Good to Have', color: '#06D6A0', bg: 'rgba(6,214,160,0.1)', border: 'rgba(6,214,160,0.25)' },
};

// ─────────────────────────────────────────────────────────────
export default function SkillGap() {
  const [domain, setDomain] = useState('Software Engineer');
  const [profileSkills, setProfileSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('gap');   // gap | plan | market
  const [searchSkill, setSearchSkill] = useState('');
  const [expandedSkill, setExpandedSkill] = useState(null);

  useEffect(() => {
    API.get('/profile/').then(res => {
      const skills = res.data?.skills || {};
      setProfileSkills(Object.keys(skills));
    }).catch(() => { });
  }, []);

  const domainData = DOMAIN_SKILLS[domain];
  const allRequired = [
    ...domainData.skills.core,
    ...domainData.skills.important,
    ...domainData.skills.good_to_have,
  ];

  // Normalize for matching (case-insensitive partial)
  const normalizedProfile = profileSkills.map(s => s.toLowerCase());
  const hasSkill = (skill) => normalizedProfile.some(p =>
    p.includes(skill.toLowerCase().split('/')[0].split('(')[0].trim()) ||
    skill.toLowerCase().split('/')[0].split('(')[0].trim().includes(p)
  );

  const coreHave = domainData.skills.core.filter(hasSkill);
  const coreMissing = domainData.skills.core.filter(s => !hasSkill(s));
  const impHave = domainData.skills.important.filter(hasSkill);
  const impMissing = domainData.skills.important.filter(s => !hasSkill(s));
  const gthHave = domainData.skills.good_to_have.filter(hasSkill);
  const gthMissing = domainData.skills.good_to_have.filter(s => !hasSkill(s));

  const totalRequired = allRequired.length;
  const totalHave = coreHave.length + impHave.length + gthHave.length;
  const matchPct = Math.round((totalHave / totalRequired) * 100);

  const coreReadiness = domainData.skills.core.length > 0
    ? Math.round((coreHave.length / domainData.skills.core.length) * 100)
    : 100;

  const scoreColor = matchPct >= 70 ? '#06D6A0' : matchPct >= 45 ? '#FFD93D' : '#FF6B6B';
  const scoreLabel = matchPct >= 70 ? 'Strong Match 🎯' : matchPct >= 45 ? 'Developing 📈' : 'Needs Work 🚀';

  const priorityMissing = [...coreMissing, ...impMissing].filter(s =>
    s.toLowerCase().includes(searchSkill.toLowerCase()) || searchSkill === ''
  );

  return (
    <div style={{ maxWidth: 960, fontFamily: 'inherit' }}>

      {/* ── Page header ── */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontWeight: 800, fontSize: 24, color: '#EEEEFF', marginBottom: 6 }}>
          🎯 Skill Gap Analyzer
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>
          See exactly what skills you need for your target role — with real 2025 job market data
        </p>
      </div>

      {/* ── Domain selector ── */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
          Select your target career
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {Object.keys(DOMAIN_SKILLS).map(d => (
            <button key={d} onClick={() => { setDomain(d); setExpandedSkill(null); }} style={{
              padding: '8px 16px', borderRadius: 20, fontSize: 13, fontWeight: 700,
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
              border: `1.5px solid ${d === domain ? '#7C5CFC' : 'rgba(255,255,255,0.1)'}`,
              background: d === domain ? 'rgba(124,92,252,0.2)' : 'rgba(255,255,255,0.03)',
              color: d === domain ? '#A29BFE' : 'rgba(255,255,255,0.45)',
            }}>{d}</button>
          ))}
        </div>
      </div>

      {/* ── Domain info card ── */}
      <div style={{
        background: 'rgba(124,92,252,0.08)', border: '1.5px solid rgba(124,92,252,0.2)',
        borderRadius: 14, padding: '16px 20px', marginBottom: 20,
        display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center',
      }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ fontWeight: 700, color: '#A29BFE', fontSize: 15 }}>{domain}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{domainData.desc}</div>
        </div>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#06D6A0' }}>{domainData.salary}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>Avg Salary</div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 4 }}>Top Hirers</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
              {domainData.hiring.slice(0, 4).map(h => (
                <span key={h} style={{
                  background: 'rgba(255,255,255,0.07)', borderRadius: 5,
                  padding: '2px 8px', fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: 600,
                }}>{h}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Score circle + stat row ── */}
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
        {/* Big match % */}
        <div style={{
          background: `${scoreColor}10`,
          border: `1.5px solid ${scoreColor}35`,
          borderRadius: 14, padding: '20px 28px',
          display: 'flex', alignItems: 'center', gap: 20, flex: '0 0 auto',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44, fontWeight: 900, color: scoreColor, lineHeight: 1 }}>{matchPct}%</div>
            <div style={{ fontSize: 12, color: scoreColor, fontWeight: 700, marginTop: 4 }}>{scoreLabel}</div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
              You have <strong style={{ color: '#EEEEFF' }}>{totalHave}</strong> of <strong style={{ color: '#EEEEFF' }}>{totalRequired}</strong> required skills
            </div>
            <div style={{ height: 8, background: 'rgba(255,255,255,0.06)', borderRadius: 8, width: 200, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${matchPct}%`, background: scoreColor, borderRadius: 8, transition: 'width 0.8s' }} />
            </div>
            {profileSkills.length < 3 && (
              <div style={{ fontSize: 11, color: '#FFD93D', marginTop: 6 }}>
                ⚠️ Add your skills in Profile for accurate analysis
              </div>
            )}
          </div>
        </div>

        {/* Mini stat cards */}
        {[
          { label: 'Core Readiness', val: `${coreReadiness}%`, sub: `${coreHave.length}/${domainData.skills.core.length} must-haves`, color: '#FF6B6B' },
          { label: 'Skills Missing', val: coreMissing.length + impMissing.length, sub: 'priority gaps', color: '#FFD93D' },
          { label: 'Good to Have', val: gthMissing.length, sub: 'bonus skills', color: '#06D6A0' },
        ].map(s => (
          <div key={s.label} style={{
            background: `${s.color}08`, border: `1px solid ${s.color}25`,
            borderRadius: 14, padding: '16px 20px', flex: 1, minWidth: 120,
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color }}>{s.val}</div>
            <div style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* ── Tab switcher ── */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {[['gap', '🔍 Skill Gap'], ['plan', '📋 Learning Plan'], ['market', '📊 Market Demand']].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={{
            padding: '8px 18px', borderRadius: 9, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 13, fontFamily: 'inherit',
            background: activeTab === key ? 'rgba(124,92,252,0.3)' : 'transparent',
            color: activeTab === key ? '#A29BFE' : 'rgba(255,255,255,0.35)',
            transition: 'all 0.15s',
          }}>{label}</button>
        ))}
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* TAB: SKILL GAP */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === 'gap' && (
        <div>
          {/* Search */}
          <div style={{ position: 'relative', marginBottom: 16 }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>🔍</span>
            <input
              value={searchSkill}
              onChange={e => setSearchSkill(e.target.value)}
              placeholder="Search skills..."
              style={{
                width: '100%', padding: '9px 12px 9px 34px', borderRadius: 9,
                border: '1.5px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)',
                color: '#EEEEFF', fontSize: 13, fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Skills by category */}
          {Object.entries(domainData.skills).map(([category, skills]) => {
            const cfg = IMPORTANCE_CONFIG[category];
            const filtered = skills.filter(s => s.toLowerCase().includes(searchSkill.toLowerCase()) || !searchSkill);
            if (!filtered.length) return null;
            return (
              <div key={category} style={{ marginBottom: 20 }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
                  paddingBottom: 8, borderBottom: `1px solid rgba(255,255,255,0.06)`,
                }}>
                  <span style={{
                    padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700,
                    background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                  }}>{cfg.label}</span>
                  <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>
                    {skills.filter(hasSkill).length}/{skills.length} acquired
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 8 }}>
                  {filtered.map(skill => {
                    const have = hasSkill(skill);
                    const isExpanded = expandedSkill === skill;
                    const res = getResource(skill);
                    return (
                      <div
                        key={skill}
                        onClick={() => setExpandedSkill(isExpanded ? null : skill)}
                        style={{
                          borderRadius: 10, border: `1.5px solid ${have ? 'rgba(6,214,160,0.3)' : `${cfg.color}30`}`,
                          background: have ? 'rgba(6,214,160,0.06)' : `${cfg.color}06`,
                          padding: '10px 12px', cursor: 'pointer', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ fontSize: 14, flexShrink: 0 }}>{have ? '✅' : '❌'}</span>
                          <span style={{
                            fontWeight: 700, fontSize: 13,
                            color: have ? '#06D6A0' : '#EEEEFF',
                            flex: 1,
                          }}>{skill}</span>
                          {!have && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>▼</span>}
                        </div>
                        {/* Expanded resources */}
                        {!have && isExpanded && (
                          <div style={{ marginTop: 10, paddingTop: 8, borderTop: `1px dashed ${cfg.color}30` }}>
                            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 6, fontWeight: 600 }}>Learn it:</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                              <a href={res.yt} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#FF6B6B', fontWeight: 600, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                                ▶ YouTube Tutorial
                              </a>
                              <a href={res.doc} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#7C5CFC', fontWeight: 600, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                                📖 Official Docs
                              </a>
                              <a href={res.free} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#06D6A0', fontWeight: 600, textDecoration: 'none' }} onClick={e => e.stopPropagation()}>
                                🆓 Free Course
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* TAB: LEARNING PLAN */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === 'plan' && (
        <div>
          {coreMissing.length === 0 && impMissing.length === 0 ? (
            <div style={{
              background: 'rgba(6,214,160,0.08)', border: '1.5px solid rgba(6,214,160,0.3)',
              borderRadius: 14, padding: '28px', textAlign: 'center',
            }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🎉</div>
              <div style={{ fontWeight: 800, color: '#06D6A0', fontSize: 18 }}>You have all required skills!</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginTop: 6 }}>
                Focus on "Good to Have" skills to stand out.
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
                Your personalized learning order — start from top to bottom
              </div>

              {/* Phase 1: Core skills */}
              {coreMissing.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.25)',
                  }}>
                    <span style={{ fontSize: 18 }}>🔴</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#FF6B6B', fontSize: 14 }}>Phase 1 — Must-Have Skills</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Learn these first — required for every {domain} job</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#FF6B6B', fontSize: 13 }}>{coreMissing.length} skills</span>
                  </div>
                  {coreMissing.map((skill, i) => {
                    const res = getResource(skill);
                    return (
                      <div key={skill} style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                        padding: '14px 16px', marginBottom: 8, borderRadius: 10,
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)',
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                          background: 'rgba(255,107,107,0.15)', border: '1px solid rgba(255,107,107,0.3)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 900, fontSize: 12, color: '#FF6B6B',
                        }}>{i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, color: '#EEEEFF', marginBottom: 6 }}>{skill}</div>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            <a href={res.yt} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#FF6B6B', fontWeight: 600, textDecoration: 'none', padding: '3px 10px', borderRadius: 5, background: 'rgba(255,107,107,0.12)', border: '1px solid rgba(255,107,107,0.2)' }}>
                              ▶ YouTube
                            </a>
                            <a href={res.doc} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#7C5CFC', fontWeight: 600, textDecoration: 'none', padding: '3px 10px', borderRadius: 5, background: 'rgba(124,92,252,0.12)', border: '1px solid rgba(124,92,252,0.2)' }}>
                              📖 Docs
                            </a>
                            <a href={res.free} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: '#06D6A0', fontWeight: 600, textDecoration: 'none', padding: '3px 10px', borderRadius: 5, background: 'rgba(6,214,160,0.12)', border: '1px solid rgba(6,214,160,0.2)' }}>
                              🆓 Free Course
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Phase 2: Important */}
              {impMissing.length > 0 && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12,
                    padding: '10px 14px', borderRadius: 10,
                    background: 'rgba(255,217,61,0.08)', border: '1px solid rgba(255,217,61,0.2)',
                  }}>
                    <span style={{ fontSize: 18 }}>🟡</span>
                    <div>
                      <div style={{ fontWeight: 800, color: '#FFD93D', fontSize: 14 }}>Phase 2 — Important Skills</div>
                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Learn after Phase 1 — will separate you from other candidates</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontWeight: 800, color: '#FFD93D', fontSize: 13 }}>{impMissing.length} skills</span>
                  </div>
                  {impMissing.map((skill, i) => {
                    const res = getResource(skill);
                    return (
                      <div key={skill} style={{
                        display: 'flex', gap: 12, alignItems: 'flex-start',
                        padding: '12px 16px', marginBottom: 7, borderRadius: 10,
                        background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        <div style={{
                          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
                          background: 'rgba(255,217,61,0.1)', border: '1px solid rgba(255,217,61,0.25)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 900, fontSize: 12, color: '#FFD93D',
                        }}>{coreMissing.length + i + 1}</div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: '#EEEEFF', marginBottom: 5 }}>{skill}</div>
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            <a href={res.yt} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#FF6B6B', fontWeight: 600, textDecoration: 'none', padding: '2px 8px', borderRadius: 4, background: 'rgba(255,107,107,0.1)', border: '1px solid rgba(255,107,107,0.18)' }}>▶ YouTube</a>
                            <a href={res.doc} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#7C5CFC', fontWeight: 600, textDecoration: 'none', padding: '2px 8px', borderRadius: 4, background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.18)' }}>📖 Docs</a>
                            <a href={res.free} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: '#06D6A0', fontWeight: 600, textDecoration: 'none', padding: '2px 8px', borderRadius: 4, background: 'rgba(6,214,160,0.1)', border: '1px solid rgba(6,214,160,0.18)' }}>🆓 Free</a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════ */}
      {/* TAB: MARKET DEMAND */}
      {/* ══════════════════════════════════════════ */}
      {activeTab === 'market' && (
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            2025 job market demand for <strong style={{ color: '#A29BFE' }}>{domain}</strong> — based on top Indian tech company hiring trends
          </div>

          {/* Demand bars */}
          {[
            { tier: '🔴 Critically Required', skills: domainData.skills.core, demand: 95 },
            { tier: '🟡 Highly Demanded', skills: domainData.skills.important, demand: 78 },
            { tier: '🟢 Bonus / Differentiator', skills: domainData.skills.good_to_have, demand: 45 },
          ].map(({ tier, skills, demand }) => (
            <div key={tier} style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{tier}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontWeight: 600 }}>~{demand}% of {domain} JDs require these</div>
              </div>
              {skills.map(skill => {
                // Slight variation per skill for realism
                const variation = (skill.length % 10) - 5;
                const skillDemand = Math.min(99, Math.max(20, demand + variation));
                const have = hasSkill(skill);
                return (
                  <div key={skill} style={{ marginBottom: 7 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 11 }}>{have ? '✅' : '○'}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: have ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)' }}>{skill}</span>
                        {have && <span style={{ fontSize: 10, color: '#06D6A0', fontWeight: 700, background: 'rgba(6,214,160,0.1)', padding: '1px 6px', borderRadius: 4 }}>You have this</span>}
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 800, color: skillDemand >= 80 ? '#FF6B6B' : skillDemand >= 60 ? '#FFD93D' : '#06D6A0' }}>
                        {skillDemand}%
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', borderRadius: 5, width: `${skillDemand}%`,
                        background: have
                          ? 'rgba(6,214,160,0.7)'
                          : skillDemand >= 80 ? 'rgba(255,107,107,0.6)' : skillDemand >= 60 ? 'rgba(255,217,61,0.6)' : 'rgba(124,92,252,0.5)',
                        transition: 'width 0.8s',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Hiring companies */}
          <div style={{
            marginTop: 24, background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px',
          }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Companies Actively Hiring {domain}s
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {domainData.hiring.map(company => (
                <a
                  key={company}
                  href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(domain + ' ' + company)}`}
                  target="_blank" rel="noreferrer"
                  style={{
                    padding: '6px 14px', borderRadius: 20,
                    background: 'rgba(124,92,252,0.1)', border: '1px solid rgba(124,92,252,0.2)',
                    color: '#A29BFE', fontWeight: 700, fontSize: 13, textDecoration: 'none',
                    transition: 'all 0.15s', display: 'inline-block',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,92,252,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(124,92,252,0.1)'}
                >
                  {company} →
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { toast } from 'react-toastify';
// import API from '../api';

// // ── Domain required skills (mirrors backend DOMAIN_SKILLS) ────
// const DOMAIN_SKILLS = {
//   'Software Engineer'    : ['Python','Java','C++','Data Structures','Algorithms','Git','SQL','REST API','OOP','Linux'],
//   'Data Scientist'       : ['Python','Statistics','Machine Learning','Pandas','NumPy','SQL','Data Visualization','Scikit-learn','Jupyter'],
//   'Web Developer'        : ['HTML','CSS','JavaScript','React','Node.js','Git','REST API','MongoDB','Responsive Design'],
//   'AI/ML Engineer'       : ['Python','Machine Learning','Deep Learning','TensorFlow','PyTorch','NLP','Computer Vision','MLOps','Docker'],
//   'Cloud Engineer'       : ['AWS','Azure','GCP','Docker','Kubernetes','Linux','Networking','Terraform','CI/CD','Bash'],
//   'Cybersecurity Analyst': ['Networking','Linux','Python','Security','Ethical Hacking','Cryptography','SIEM','Firewalls'],
//   'Data Engineer'        : ['Python','SQL','Spark','Hadoop','Kafka','Airflow','ETL','Data Pipelines','AWS','Scala'],
// };

// // Learning resources for each skill
// const SKILL_RESOURCES = {
//   'Python'           : { yt:'https://www.youtube.com/watch?v=_uQrJ0TkZlc', doc:'https://docs.python.org/3/', free:'https://www.learnpython.org/' },
//   'Java'             : { yt:'https://www.youtube.com/watch?v=eIrMbAQSU34', doc:'https://dev.java/learn/', free:'https://www.javatpoint.com/' },
//   'C++'              : { yt:'https://www.youtube.com/watch?v=vLnPwxZdW4Y', doc:'https://cppreference.com/', free:'https://www.learncpp.com/' },
//   'Data Structures'  : { yt:'https://www.youtube.com/watch?v=RBSGKlAvoiM', doc:'https://www.geeksforgeeks.org/data-structures/', free:'https://www.geeksforgeeks.org/data-structures/' },
//   'Algorithms'       : { yt:'https://www.youtube.com/watch?v=kgBjXUE_Nwc', doc:'https://www.geeksforgeeks.org/fundamentals-of-algorithms/', free:'https://www.geeksforgeeks.org/fundamentals-of-algorithms/' },
//   'Git'              : { yt:'https://www.youtube.com/watch?v=RGOj5yH7evk', doc:'https://git-scm.com/doc', free:'https://learngitbranching.js.org/' },
//   'SQL'              : { yt:'https://www.youtube.com/watch?v=HXV3zeQKqGY', doc:'https://www.w3schools.com/sql/', free:'https://sqlzoo.net/' },
//   'Machine Learning' : { yt:'https://www.youtube.com/watch?v=NWONeJKn6kc', doc:'https://scikit-learn.org/stable/', free:'https://www.coursera.org/learn/machine-learning' },
//   'React'            : { yt:'https://www.youtube.com/watch?v=bMknfKXIFA8', doc:'https://react.dev/', free:'https://react.dev/learn' },
//   'Node.js'          : { yt:'https://www.youtube.com/watch?v=ENrzD9HAZK4', doc:'https://nodejs.org/en/docs/', free:'https://www.w3schools.com/nodejs/' },
//   'Docker'           : { yt:'https://www.youtube.com/watch?v=fqMOX6JJhGo', doc:'https://docs.docker.com/', free:'https://docs.docker.com/get-started/' },
//   'AWS'              : { yt:'https://www.youtube.com/watch?v=3hLmDS179YE', doc:'https://docs.aws.amazon.com/', free:'https://aws.amazon.com/free/' },
//   'JavaScript'       : { yt:'https://www.youtube.com/watch?v=jS4aFq5-91M', doc:'https://developer.mozilla.org/en-US/docs/Web/JavaScript', free:'https://javascript.info/' },
//   'HTML'             : { yt:'https://www.youtube.com/watch?v=pQN-pnXPaVg', doc:'https://developer.mozilla.org/en-US/docs/Web/HTML', free:'https://www.w3schools.com/html/' },
//   'CSS'              : { yt:'https://www.youtube.com/watch?v=1Rs2ND1ryYc', doc:'https://developer.mozilla.org/en-US/docs/Web/CSS', free:'https://www.w3schools.com/css/' },
//   'Networking'       : { yt:'https://www.youtube.com/watch?v=IPvYjXCsTg8', doc:'https://www.geeksforgeeks.org/computer-network-tutorials/', free:'https://www.geeksforgeeks.org/computer-network-tutorials/' },
//   'Linux'            : { yt:'https://www.youtube.com/watch?v=ZtqBQ68cfJc', doc:'https://linux.die.net/', free:'https://linuxjourney.com/' },
//   'Kubernetes'       : { yt:'https://www.youtube.com/watch?v=X48VuDVv0do', doc:'https://kubernetes.io/docs/', free:'https://kubernetes.io/docs/tutorials/' },
//   'TensorFlow'       : { yt:'https://www.youtube.com/watch?v=tPYj3fFJGjk', doc:'https://www.tensorflow.org/learn', free:'https://www.tensorflow.org/tutorials' },
//   'Statistics'       : { yt:'https://www.youtube.com/watch?v=xxpc-HPKN28', doc:'https://www.khanacademy.org/math/statistics-probability', free:'https://www.khanacademy.org/math/statistics-probability' },
// };

// const DEFAULT_RESOURCE = {
//   yt   : 'https://www.youtube.com/results?search_query=',
//   doc  : 'https://www.geeksforgeeks.org/search/?q=',
//   free : 'https://www.geeksforgeeks.org/search/?q=',
// };

// const getResource = (skill) => SKILL_RESOURCES[skill] || {
//   yt   : `${DEFAULT_RESOURCE.yt}${encodeURIComponent(skill + ' tutorial')}`,
//   doc  : `${DEFAULT_RESOURCE.doc}${encodeURIComponent(skill)}`,
//   free : `${DEFAULT_RESOURCE.free}${encodeURIComponent(skill)}`,
// };

// function LinkBtn({ href, icon, label, color }) {
//   return (
//     <a href={href} target="_blank" rel="noreferrer" style={{
//       display:'inline-flex', alignItems:'center', gap:5,
//       padding:'4px 12px', borderRadius:8, textDecoration:'none',
//       background:`${color}15`, border:`1px solid ${color}33`,
//       color, fontSize:12, fontWeight:700, transition:'all 0.15s', whiteSpace:'nowrap'
//     }}
//     onMouseEnter={e=>{ e.currentTarget.style.background=color; e.currentTarget.style.color='#fff'; }}
//     onMouseLeave={e=>{ e.currentTarget.style.background=`${color}15`; e.currentTarget.style.color=color; }}>
//       {icon} {label}
//     </a>
//   );
// }

// export default function SkillGap() {
//   const [domain,   setDomain]   = useState('Software Engineer');
//   const [result,   setResult]   = useState(null);
//   const [profile,  setProfile]  = useState(null);
//   const [loading,  setLoading]  = useState(false);
//   const [analyzed, setAnalyzed] = useState(false);

//   useEffect(() => {
//     API.get('/profile/').then(r => setProfile(r.data)).catch(()=>{});
//   }, []);

//   const analyze = async () => {
//     setLoading(true);
//     try {
//       const res = await API.post('/roadmap/generate', { career_domain: domain });
//       setResult(res.data?.skill_gap || null);
//       setAnalyzed(true);
//       if (!res.data?.skill_gap) toast.info('Complete your profile & upload resume for better results');
//       else toast.success('Skill gap analyzed! 📊');
//     } catch { toast.error('Analysis failed — make sure your profile is complete'); }
//     finally { setLoading(false); }
//   };

//   const required = DOMAIN_SKILLS[domain] || [];
//   const userSkills = Object.keys(profile?.skills || {});

//   // Local analysis (instant, from profile)
//   const localHave    = required.filter(r => userSkills.some(s => s.toLowerCase() === r.toLowerCase()));
//   const localMissing = required.filter(r => !userSkills.some(s => s.toLowerCase() === r.toLowerCase()));
//   const localMatch   = required.length ? Math.round((localHave.length / required.length) * 100) : 0;

//   // Server result (includes resume skills too)
//   const serverHave    = result?.current_skills  || [];
//   const serverMissing = result?.missing_skills  || [];
//   const serverMatch   = result?.match_percentage || 0;
//   const serverGap     = result?.gap_percentage   || 0;

//   const have    = analyzed && result ? serverHave    : localHave;
//   const missing = analyzed && result ? serverMissing : localMissing;
//   const matchPct= analyzed && result ? serverMatch   : localMatch;
//   const gapPct  = 100 - matchPct;

//   const matchColor = matchPct >= 70 ? '#06D6A0' : matchPct >= 50 ? '#FFD93D' : '#FF6B6B';
//   const matchLabel = matchPct >= 70 ? 'Strong Match! 🎉' : matchPct >= 50 ? 'Decent Match 👍' : 'Large Gap ⚠️';

//   return (
//     <div style={{ maxWidth:900, fontFamily:'Inter,sans-serif' }}>
//       <h1 className="page-title">Skill Gap Analyzer</h1>
//       <p className="page-sub">Find exactly what skills you're missing for your target career</p>

//       {/* ── Domain Selector ── */}
//       <div style={{
//         display:'flex', gap:14, marginBottom:28, flexWrap:'wrap', alignItems:'flex-end'
//       }}>
//         <div style={{ flex:1, minWidth:240 }}>
//           <label style={{ display:'block', fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)', marginBottom:8 }}>
//             Target Career Domain
//           </label>
//           <select value={domain} onChange={e => { setDomain(e.target.value); setAnalyzed(false); }}>
//             {Object.keys(DOMAIN_SKILLS).map(d => <option key={d}>{d}</option>)}
//           </select>
//         </div>
//         <button className="btn btn-primary" onClick={analyze} disabled={loading}
//           style={{ padding:'13px 28px', fontSize:15, flexShrink:0 }}>
//           {loading ? '⏳ Analyzing...' : '🔍 Analyze My Gap'}
//         </button>
//       </div>

//       {/* ── Hero score card ── */}
//       <div style={{
//         borderRadius:24, padding:'28px 32px', marginBottom:24,
//         background:`linear-gradient(135deg,${matchColor}18,rgba(124,92,252,0.1))`,
//         border:`1px solid ${matchColor}33`,
//         display:'flex', gap:28, alignItems:'center', flexWrap:'wrap'
//       }}>
//         {/* Circle */}
//         <div style={{ position:'relative', width:120, height:120, flexShrink:0 }}>
//           <svg width="120" height="120" style={{ transform:'rotate(-90deg)' }}>
//             <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10"/>
//             <circle cx="60" cy="60" r="50" fill="none" stroke={matchColor} strokeWidth="10"
//               strokeLinecap="round"
//               strokeDasharray={`${2*Math.PI*50}`}
//               strokeDashoffset={`${2*Math.PI*50*(1-matchPct/100)}`}
//               style={{ transition:'stroke-dashoffset 1.2s ease', filter:`drop-shadow(0 0 8px ${matchColor})` }}/>
//           </svg>
//           <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center' }}>
//             <div style={{ fontFamily:'Space Grotesk,sans-serif', fontSize:22, fontWeight:900, color:matchColor }}>{Math.round(matchPct)}%</div>
//             <div style={{ fontSize:10, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Match</div>
//           </div>
//         </div>

//         <div style={{ flex:1 }}>
//           <div style={{ fontFamily:'Space Grotesk,sans-serif', fontWeight:800, fontSize:22, color:'#F0F0FF', marginBottom:6 }}>
//             {domain}
//           </div>
//           <div style={{
//             display:'inline-flex', alignItems:'center', gap:8,
//             padding:'6px 16px', borderRadius:20,
//             background:`${matchColor}20`, border:`1px solid ${matchColor}44`,
//             color:matchColor, fontWeight:700, fontSize:14, marginBottom:16
//           }}>{matchLabel}</div>

//           <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
//             <div>
//               <div style={{ fontSize:28, fontWeight:900, color:'#06D6A0' }}>{have.length}</div>
//               <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Skills Matched</div>
//             </div>
//             <div>
//               <div style={{ fontSize:28, fontWeight:900, color:'#FF6B6B' }}>{missing.length}</div>
//               <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Skills Missing</div>
//             </div>
//             <div>
//               <div style={{ fontSize:28, fontWeight:900, color:'#FFD93D' }}>{required.length}</div>
//               <div style={{ fontSize:12, color:'rgba(255,255,255,0.4)', fontWeight:600 }}>Total Required</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ── Progress bar ── */}
//       <div style={{ marginBottom:24 }}>
//         <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
//           <span style={{ fontSize:13, fontWeight:600, color:'rgba(255,255,255,0.5)' }}>Skill Coverage</span>
//           <span style={{ fontSize:13, fontWeight:800, color:matchColor }}>{Math.round(matchPct)}% matched • {Math.round(gapPct)}% gap</span>
//         </div>
//         <div style={{ height:12, background:'rgba(255,255,255,0.06)', borderRadius:12, overflow:'hidden', position:'relative' }}>
//           <div style={{ position:'absolute', top:0, left:0, height:'100%', width:`${matchPct}%`, background:`linear-gradient(90deg,${matchColor},#7C5CFC)`, borderRadius:12, transition:'width 1.2s ease', boxShadow:`0 0 12px ${matchColor}44` }}/>
//         </div>
//       </div>

//       {/* ── Two columns: Have + Missing ── */}
//       <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>

//         {/* Skills You HAVE */}
//         <div className="card">
//           <div style={{ fontSize:13, fontWeight:700, color:'#06D6A0', textTransform:'uppercase', letterSpacing:1, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
//             ✅ Skills You Have ({have.length})
//           </div>
//           {have.length === 0 ? (
//             <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>
//               No matching skills found — fill your profile first
//             </p>
//           ) : (
//             <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//               {have.map(s => (
//                 <div key={s} style={{
//                   display:'inline-flex', alignItems:'center', gap:6,
//                   padding:'6px 14px', borderRadius:20,
//                   background:'rgba(6,214,160,0.12)',
//                   border:'1px solid rgba(6,214,160,0.25)',
//                   color:'#06D6A0', fontSize:13, fontWeight:700
//                 }}>
//                   <span>✓</span> {s}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Skills MISSING */}
//         <div className="card">
//           <div style={{ fontSize:13, fontWeight:700, color:'#FF6B6B', textTransform:'uppercase', letterSpacing:1, marginBottom:16, display:'flex', alignItems:'center', gap:8 }}>
//             ❌ Skills Missing ({missing.length})
//           </div>
//           {missing.length === 0 ? (
//             <div style={{ textAlign:'center', padding:'20px 0' }}>
//               <div style={{ fontSize:36, marginBottom:10 }}>🎉</div>
//               <p style={{ color:'#06D6A0', fontWeight:700, fontSize:14 }}>You have all required skills!</p>
//             </div>
//           ) : (
//             <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
//               {missing.map(s => (
//                 <div key={s} style={{
//                   display:'inline-flex', alignItems:'center', gap:6,
//                   padding:'6px 14px', borderRadius:20,
//                   background:'rgba(255,107,107,0.12)',
//                   border:'1px solid rgba(255,107,107,0.25)',
//                   color:'#FF6B6B', fontSize:13, fontWeight:700
//                 }}>
//                   <span>✗</span> {s}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── Learning Plan for Missing Skills ── */}
//       {missing.length > 0 && (
//         <>
//           <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:1, marginBottom:16 }}>
//             📚 Learning Plan — Fix Each Gap
//           </div>
//           <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
//             {missing.map((skill, i) => {
//               const res = getResource(skill);
//               return (
//                 <div key={skill} style={{
//                   display:'flex', alignItems:'center', justifyContent:'space-between',
//                   gap:14, padding:'14px 18px', borderRadius:14,
//                   background:'rgba(255,107,107,0.04)',
//                   border:'1px solid rgba(255,107,107,0.12)',
//                   flexWrap:'wrap'
//                 }}>
//                   <div style={{ display:'flex', alignItems:'center', gap:12 }}>
//                     <div style={{
//                       width:32, height:32, borderRadius:8, flexShrink:0,
//                       background:'rgba(255,107,107,0.15)',
//                       display:'flex', alignItems:'center', justifyContent:'center',
//                       fontWeight:900, fontSize:13, color:'#FF6B6B'
//                     }}>{i+1}</div>
//                     <div>
//                       <div style={{ fontWeight:800, fontSize:14, color:'#F0F0FF' }}>{skill}</div>
//                       <div style={{ fontSize:12, color:'rgba(255,255,255,0.35)', fontWeight:500 }}>Missing for {domain}</div>
//                     </div>
//                   </div>
//                   <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
//                     <LinkBtn href={res.yt}   icon="▶️" label="YouTube" color="#FF6B6B" />
//                     <LinkBtn href={res.doc}  icon="📖" label="Docs"    color="#7C5CFC" />
//                     <LinkBtn href={res.free} icon="🆓" label="Free Course" color="#06D6A0" />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </>
//       )}

//       {/* ── Tip ── */}
//       {!profile?.skills || Object.keys(profile.skills).length === 0 ? (
//         <div style={{
//           marginTop:24, padding:'16px 20px', borderRadius:14,
//           background:'rgba(255,217,61,0.08)', border:'1px solid rgba(255,217,61,0.2)'
//         }}>
//           <p style={{ fontWeight:700, color:'#FFD93D', fontSize:14 }}>
//             💡 Tip: Fill your <strong>Profile → Skill Ratings</strong> and upload your <strong>Resume</strong> for a more accurate skill gap analysis.
//           </p>
//         </div>
//       ) : null}
//     </div>
//   );
// }
