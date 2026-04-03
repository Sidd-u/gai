import os
import json
from openai import OpenAI

def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

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
    Evaluate the following interview answers and return ONLY a JSON object:
    {{
        "score": 75,
        "strengths": ["strength1", "strength2"],
        "weaknesses": ["weakness1", "weakness2"],
        "feedback": "Overall feedback here",
        "question_scores": [
            {{"question": "Q text", "score": 8, "feedback": "Good because..."}}
        ]
    }}

    Score must be 0-100. Be honest and specific.

    Q&A pairs:
    {json.dumps(qa_pairs, indent=2)}
    """

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are an expert interview evaluator. Output strictly valid JSON only."},
            {"role": "user", "content": prompt}
        ]
    )

    result = json.loads(response.choices[0].message.content)
    print(f"[INFO] Evaluation complete. Score: {result.get('score')}")
    return result
