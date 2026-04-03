import json
from openai import OpenAI

client = OpenAI()

def generate_quiz(company, role, resume_text):
    prompt = f"""
    Generate an interview quiz for a candidate applying for '{role}' at '{company}'.
    The candidate's resume summary/skills: {resume_text}
    
    Return STRICTLY JSON format with this structure:
    {{
        "questions": [
            {{
                "id": "q1",
                "type": "mcq",
                "question": "question text",
                "options": ["A", "B", "C", "D"],
                "answer": "A"
            }},
            {{
                "id": "q2",
                "type": "coding",
                "question": "coding problem description"
            }},
            {{
                "id": "q3",
                "type": "essay",
                "question": "behavioral or system design question"
            }}
        ]
    }}
    Include 3 MCQs, 1 Coding, and 1 Essay question.
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are an expert technical interviewer and output strictly JSON."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return json.loads(response.choices[0].message.content)
