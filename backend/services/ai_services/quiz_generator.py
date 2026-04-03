import os
import json
import google.generativeai as genai

def get_client():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    return genai.GenerativeModel("gemini-1.5-flash")

def generate_quiz(company, role, resume_text=""):
    prompt = f"""
    Generate an interview quiz for:
    Company: {company}
    Role: {role}
    Candidate background: {resume_text[:1000] if resume_text else "Not provided"}

    Return ONLY a valid JSON object. No markdown, no code blocks.
    {{
        "questions": [
            {{
                "id": "q1",
                "type": "mcq",
                "question": "Question text here",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correct_answer": "Option A"
            }},
            {{
                "id": "q2",
                "type": "coding",
                "question": "Write a function that...",
                "options": null,
                "correct_answer": "Expected logic explanation"
            }},
            {{
                "id": "q3",
                "type": "essay",
                "question": "Describe your experience with...",
                "options": null,
                "correct_answer": "Key points to cover"
            }}
        ]
    }}

    Generate exactly: 4 MCQ, 3 coding, 3 essay questions (10 total).
    Make questions specific to {company} and {role}.
    """

    model = get_client()
    response = model.generate_content(prompt)
    raw = response.text.strip()
    if raw.startswith("```"):
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]
    raw = raw.strip()
    result = json.loads(raw)
    print(f"[INFO] Quiz generated: {len(result.get('questions', []))} questions")
    return result
