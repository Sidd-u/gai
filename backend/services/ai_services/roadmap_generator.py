import os
import json
import ollama

def get_client():
    return None  # ollama is called directly, no client needed

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
    print(f"[INFO] Roadmap generated: {len(result.get('topics', []))} topics")
    return result
