import os
import json
import PyPDF2
import docx
import ollama

def get_client():
    return None  # ollama is called directly, no client needed

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
    Analyze the following resume and return ONLY a valid JSON object.
    No extra text, no markdown, no code blocks. Just raw JSON.
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
    analysis_dict = json.loads(raw)
    print(f"[INFO] Resume analyzed: {list(analysis_dict.keys())}")
    return text, json.dumps(analysis_dict)
