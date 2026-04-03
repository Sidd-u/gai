import os
import json
import ollama

def get_client():
    return None  # ollama is called directly, no client needed

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

    response = ollama.chat(
        model="llama3.2",
        messages=[{"role": "user", "content": prompt}]
    )
    raw = response['message']['content'].strip()
    if "```" in raw:
        parts = raw.split("```")
        for part in parts:
            part = part.strip()
            if part.startswith("json"):
                part = part[4:].strip()
            if part.startswith("{") or part.startswith("["):
                raw = part
                break
    raw = raw.strip()
    result = json.loads(raw)
    print(f"[INFO] Quiz generated: {len(result.get('questions', []))} questions")
    return result
