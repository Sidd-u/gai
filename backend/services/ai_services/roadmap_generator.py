import os
import json
from openai import OpenAI

def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_roadmap(feedback):
    score = feedback.get("score", 0)
    weaknesses = feedback.get("weaknesses", [])
    strengths = feedback.get("strengths", [])

    prompt = f"""
    Generate a personalized interview preparation roadmap.

    Candidate score: {score}/100
    Strengths: {strengths}
    Areas to improve: {weaknesses}

    Return ONLY a JSON object:
    {{
        "summary_plan": "Overall 2-3 sentence preparation strategy",
        "topics": [
            {{
                "name": "Topic Name",
                "priority": "high",
                "description": "Why this topic matters and what to focus on",
                "resources": ["Resource 1", "Resource 2", "Resource 3"]
            }}
        ]
    }}

    Priority must be: high, medium, or low.
    Generate 4-6 topics ordered by priority.
    Make it specific and actionable.
    """

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a career coach and technical mentor. Output strictly valid JSON only."},
            {"role": "user", "content": prompt}
        ]
    )

    result = json.loads(response.choices[0].message.content)
    print(f"[INFO] Roadmap generated: {len(result.get('topics', []))} topics")
    return result
