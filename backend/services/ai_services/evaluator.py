import os
import json
import ollama

def get_client():
    return None  # ollama is called directly, no client needed

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
    print(f"[INFO] Evaluation complete. Score: {result.get('score')}")
    return result
