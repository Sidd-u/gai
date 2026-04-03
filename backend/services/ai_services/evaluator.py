import os
import json
import google.generativeai as genai

def get_client():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    return genai.GenerativeModel("gemini-1.5-flash")

def evaluate_answers(questions, answers):
    qa_pairs = []
    for q in questions:
        q_id = q.get("id")
        user_answer = answers.get(q_id, "No answer provided")
        qa_pairs.append({
            "question": q.get("question"),
            "type": q.get("type"),
            "correct_answer": q.get("correct_answer"),
            "user_answer": user_answer
        })

    prompt = f"""
    Evaluate the following interview answers.
    Return ONLY a valid JSON object. No markdown, no code blocks.
    {{
        "score": 75,
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "feedback": "Overall feedback here",
        "question_scores": [
            {{"question": "Q text", "score": 8, "feedback": "Good because..."}}
        ]
    }}

    Score must be 0-100.

    Q&A pairs:
    {json.dumps(qa_pairs, indent=2)}
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
    print(f"[INFO] Evaluation complete. Score: {result.get('score')}")
    return result
