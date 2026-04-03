import os
import json
import google.generativeai as genai

def get_client():
    genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
    return genai.GenerativeModel("gemini-1.5-flash")

def generate_roadmap(feedback):
    score = feedback.get("score", 0)
    weaknesses = feedback.get("weaknesses", [])
    strengths = feedback.get("strengths", [])

    prompt = f"""
    Generate a personalized interview preparation roadmap.

    Candidate score: {score}/100
    Strengths: {strengths}
    Areas to improve: {weaknesses}

    Return ONLY a valid JSON object. No markdown, no code blocks.
    {{
        "summary_plan": "Overall 2-3 sentence preparation strategy",
        "topics": [
            {{
                "name": "Topic Name",
                "priority": "high",
                "description": "Why this matters and what to focus on",
                "resources": ["Resource 1", "Resource 2", "Resource 3"]
            }}
        ]
    }}

    Priority must be: high, medium, or low.
    Generate 4-6 topics ordered by priority.
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
    print(f"[INFO] Roadmap generated: {len(result.get('topics', []))} topics")
    return result
