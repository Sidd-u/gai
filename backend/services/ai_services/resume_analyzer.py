import os
import json
import PyPDF2
import docx
from openai import OpenAI

def get_client():
    return OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_text(file_path):
    ext = file_path.lower().split('.')[-1]
    text = ""
    try:
        if ext == 'pdf':
            with open(file_path, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
        elif ext in ['doc', 'docx']:
            doc = docx.Document(file_path)
            for para in doc.paragraphs:
                text += para.text + "\n"
        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()
    except Exception as e:
        print(f"[ERROR] Text extraction failed: {str(e)}")
        raise
    return text.strip()

def analyze_resume_file(file_path):
    text = extract_text(file_path)
    if not text:
        raise ValueError("Could not extract text from resume file")

    prompt = f"""
    Analyze the following resume and return ONLY a JSON object with no extra text.
    JSON structure must be exactly:
    {{
        "skills": ["skill1", "skill2"],
        "experience_years": 0,
        "projects": ["project1"],
        "strengths": ["strength1"],
        "weaknesses": ["weakness1"],
        "summary": "Brief summary of the candidate"
    }}

    Resume Text:
    {text[:4000]}
    """

    client = get_client()
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a professional technical recruiter. Output strictly valid JSON only."},
            {"role": "user", "content": prompt}
        ]
    )

    analysis_dict = json.loads(response.choices[0].message.content)
    print(f"[INFO] Resume analyzed successfully: {list(analysis_dict.keys())}")
    return text, json.dumps(analysis_dict)
