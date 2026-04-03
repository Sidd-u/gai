import os
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import db, Resume
from services.ai_services.resume_analyzer import analyze_resume_file
from werkzeug.utils import secure_filename

ALLOWED_EXTENSIONS = {'pdf', 'doc', 'docx'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

resume_bp = Blueprint('resume', __name__)

@resume_bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_resume():
    try:
        print("[INFO] Starting resume upload process")
        if 'file' not in request.files:
            print("[ERROR] No file provided")
            return jsonify({"success": False, "error": "No file provided"}), 400
            
        file = request.files['file']
        if file.filename == '':
            print("[ERROR] No file selected")
            return jsonify({"success": False, "error": "No file selected"}), 400
            
        if file and allowed_file(file.filename):
            print(f"[INFO] File allowed: {file.filename}")
            upload_folder = os.path.join(os.path.dirname(__file__), '..', 'uploads')
            os.makedirs(upload_folder, exist_ok=True)
            
            filename = secure_filename(file.filename)
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            print(f"[INFO] File saved to {file_path}")
            
            user_id = get_jwt_identity()
            # Analyze using OpenAI
            print("[INFO] Passing file to AI analyzer")
            extracted_text, analysis_json = analyze_resume_file(file_path)
            
            # Save to DB
            print("[INFO] Saving DB record")
            new_resume = Resume(
                user_id=user_id,
                extracted_text=extracted_text,
                analysis_json=analysis_json
            )
            db.session.add(new_resume)
            db.session.commit()
            print("[INFO] Upload successful")
            
            return jsonify({
                "success": True,
                "data": {
                    "resume_id": new_resume.id,
                    "parsed": analysis_json
                }
            }), 200
        else:
            print("[ERROR] Invalid file format")
            return jsonify({"success": False, "error": "Only PDF and DOCX files are supported"}), 400
    except Exception as e:
        print(f"[ERROR] Resume upload failed: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500
