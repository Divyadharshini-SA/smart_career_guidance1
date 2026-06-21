# 🚀 Smart AI Career Guidance System

An AI-driven platform designed to provide personalized career recommendations, placement readiness analysis, and skill development roadmaps using the **Google Gemini Pro API**.

---

## 🌟 Key Features

- **🤖 AI Career Chatbot**: Instant career advice and guidance powered by Gemini AI.
- **📊 Assessment System**: Evaluate technical and soft skills through structured tests.
- **🛤️ Learning Roadmaps**: Dynamic, personalized learning paths generated as professional PDFs.
- **🔍 Skill Gap Analysis**: Detailed reports identifying missing skills for target roles.
- **📄 Resume Analysis**: Smart parsing and feedback on resume strength and job alignment.
- **💼 Placement Hub**: Job recommendations and placement preparation tracking.
- **👨‍💼 Admin Dashboard**: Manage questions, view system stats, and monitor user progress.

---

## 🛠️ Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.9+)
- **Database**: SQLAlchemy (SQLite for development)
- **AI/ML**: Google Gemini Pro, Scikit-learn, Sentence-Transformers, NLTK
- **Security**: JWT (Jose), Bcrypt, Passlib
- **Utilities**: PDFPlumber, Python-Docx (Resume parsing)

### Frontend
- **Framework**: React.js
- **Styling**: Vanilla CSS (Modern, Premium UI)
- **Visualization**: Recharts
- **PDF Generation**: jsPDF, AutoTable
- **API Client**: Axios

---

## ⚙️ Getting Started

### Prerequisites
- Python 3.9 or higher
- Node.js (v16+) and npm
- Google Gemini API Key

### 📂 Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder:
   ```env
   DATABASE_URL=sqlite:///./career_guidance.db
   SECRET_KEY=your_jwt_secret_key
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
5. Run the server:
   ```bash
   python main.py
   ```
   *The API will be available at: http://localhost:8000*
   *API Docs (Swagger): http://localhost:8000/docs*

### 🎨 Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
   *The app will be available at: http://localhost:3000*

---

## 📁 Project Structure

```text
smart_career_guidance1/
├── backend/            # FastAPI Backend
│   ├── routes/         # API Endpoints
│   ├── services/       # Business Logic & AI Services
│   ├── ml/             # Machine Learning Models
│   ├── models.py       # SQLAlchemy Database Models
│   └── main.py         # App Entry Point
├── frontend/           # React Frontend
│   ├── src/
│   │   ├── components/ # Reusable UI Components
│   │   ├── pages/      # Main View Pages
│   │   └── api.js      # API Interaction Layer
│   └── public/         # Static Assets
└── README.md           # Project Documentation
```
