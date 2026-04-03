import os
import PyPDF2
import docx
import json
from openai import OpenAI

# Client uses OPENAI_API_KEY env variable automatically
client = OpenAI()

def extract_text(file_path):
    ext = file_path.lower().split('.')[-1]
    text = ""
    if ext == 'pdf':
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    elif ext in ['doc', 'docx']:
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else: # Fallback to plain text read
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            text = f.read()
    return text

def analyze_resume_file(file_path):
    text = extract_text(file_path)
    
    prompt = f"""
    Analyze the following resume and return a strict JSON output representing the candidate's profile.
    JSON structure:
    {{
        "skills": ["skill1", "skill2"],
        "experience_years": 5,
        "summary": "Brief summary of the candidate"
    }}

    Resume Text:
    {text}
    """
    
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a professional technical recruiter and output strictly JSON."},
            {"role": "user", "content": prompt}
        ]
    )
    
    analysis_dict = json.loads(response.choices[0].message.content)
    return text, json.dumps(analysis_dict)
