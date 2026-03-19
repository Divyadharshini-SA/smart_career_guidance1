import os
import json
import urllib.request
import urllib.error
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from routes.auth import get_current_user
from models import User

router = APIRouter()

SYSTEM_PROMPT = """You are an expert AI Technical Interviewer for engineering students.
Generate exactly 5 mock technical interview questions and model answers based on the user's target domain and their missing skills that they need to learn.
Focus on standard interview questions for that domain and those skills.
Format the output strictly as JSON with this structure:
{
  "questions": [
    {
      "question": "The interview question",
      "answer": "A concise model answer or key points to cover"
    }
  ]
}
Do not include markdown blocks like ```json, just the raw JSON.
"""

@router.get("/questions")
def get_interview_questions(domain: str, missing_skills: str = "", current_user: User = Depends(get_current_user)):
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or api_key == "your_gemini_api_key_here":
        return {
            "questions": [
                {
                    "question": "What is the importance of configuring your API key?",
                    "answer": "You need to add a valid GEMINI_API_KEY to the backend .env file to generate AI mock interviews. Please contact your administrator."
                }
            ]
        }

    user_prompt = f"Target Domain: {domain}\nMissing Skills to focus on: {missing_skills}\nGenerate 5 questions."

    payload = json.dumps({
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
        "generationConfig": {
            "temperature": 0.7,
            "maxOutputTokens": 1000,
            "topP": 0.9
        }
    }).encode("utf-8")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
    req = urllib.request.Request(
        url, data=payload,
        headers={"Content-Type": "application/json"},
        method="POST"
    )

    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read())
            # Extract text
            text = data["candidates"][0]["content"]["parts"][0]["text"]
            # Clean possible markdown formatting
            text = text.replace("```json", "").replace("```", "").strip()
            parsed = json.loads(text)
            return parsed
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="ignore")
        print(f"Gemini HTTP {e.code}: {body}")
        raise HTTPException(status_code=500, detail="Error generating questions from AI. Try again later.")
    except Exception as e:
        print(f"Gemini error in interview generation: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate interview questions. Try again later.")
