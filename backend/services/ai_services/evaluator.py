import json
from openai import OpenAI

client = OpenAI()

def evaluate_answers(questions, user_answers_dict):
    """
    questions: The original list of question dicts
    user_answers_dict: dict of {question_id: user_answer_string}
    """
    
    prompt = f"""
    Evaluate the following user answers to an interview quiz.
    
    Quiz Questions:
    {json.dumps(questions, indent=2)}
    
    User Answers:
    {json.dumps(user_answers_dict, indent=2)}
    
    For MCQ questions, check against the correct answer. For coding and essay questions, evaluate based on correctness, quality, and typical interview standards.
    
    Return STRICTLY JSON format with this structure:
    {{
        "score": 85, 
        "strengths": ["List of 2-3 strengths found in answers"],
        "weaknesses": ["List of 2-3 areas to improve"],
        "question_feedback": [
            {{
                "id": "q1",
                "is_correct": true,
                "feedback": "Correct. Detailed feedback for coding/essay."
            }}
        ]
    }}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a highly analytical technical interview evaluator and output strictly JSON."},
            {"role": "user", "content": prompt}
        ]
    )
    
    return json.loads(response.choices[0].message.content)
