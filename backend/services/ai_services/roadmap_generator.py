import json
from openai import OpenAI

client = OpenAI()

def generate_roadmap(feedback_json):
    
    prompt = f"""
    Based on the following interview evaluation feedback, generate a structured, personalized learning roadmap for the candidate.
    
    Feedback:
    {json.dumps(feedback_json, indent=2)}
    
    Return STRICTLY JSON format with this structure:
    {{
        "topics": [
            {{
                "name": "Topic Name",
                "priority": "High | Medium | Low",
                "description": "Why they need to learn this and what to focus on",
                "resources": ["A link or suggestion 1", "Suggestion 2"]
            }}
        ],
        "summary_plan": "A short summary of the overall plan."
    }}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a career and technical coach and output strictly JSON."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return json.loads(response.choices[0].message.content)
