import os
import json
from openai import OpenAI

def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_quiz(company, role, resume_text=""):
    prompt = f"""
    Generate an interview quiz for:
    Company: {company}
    Role: {role}
    Candidate background: {resume_text[:1000] if resume_text else "Not provided"}

    Return ONLY a JSON object with no extra text:
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

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a senior technical interviewer. Output strictly valid JSON only."},
            {"role": "user", "content": prompt}
        ]
    )

    result = json.loads(response.choices[0].message.content)
    print(f"[INFO] Quiz generated: {len(result.get('questions', []))} questions")
    return result
