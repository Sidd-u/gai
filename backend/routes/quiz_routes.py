import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import db, Quiz, Result
from services.ai_services.quiz_generator import generate_quiz
from services.ai_services.evaluator import evaluate_answers

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/generate', methods=['POST'])
@jwt_required()
def create_quiz():
    data = request.get_json()
    company = data.get('company')
    role = data.get('role')
    resume_text = data.get('resume_text', '')
    
    if not company or not role:
        return jsonify({"success": False, "error": "Company and role required"}), 400
        
    try:
        user_id = get_jwt_identity()
        quiz_data = generate_quiz(company, role, resume_text)
        
        new_quiz = Quiz(
            user_id=user_id,
            company=company,
            role=role,
            questions_json=json.dumps(quiz_data)
        )
        db.session.add(new_quiz)
        db.session.commit()
        
        return jsonify({"success": True, "data": {"message": "Quiz generated", "quiz_id": new_quiz.id, "quiz": quiz_data}}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@quiz_bp.route('/submit', methods=['POST'])
@jwt_required()
def submit_quiz():
    data = request.get_json()
    quiz_id = data.get('quiz_id')
    answers = data.get('answers')
    if isinstance(answers, list):
        answers = {str(i): a for i, a in enumerate(answers)}
    if not isinstance(answers, dict):
        answers = {} # List/dict of answers mapped to questions
    
    if not quiz_id or answers is None:
        return jsonify({"success": False, "error": "quiz_id and answers required"}), 400
        
    try:
        user_id = get_jwt_identity()
        quiz = Quiz.query.filter_by(id=quiz_id, user_id=user_id).first()
        
        if not quiz:
            return jsonify({"success": False, "error": "Quiz not found"}), 404
            
        quiz_data = json.loads(quiz.questions_json)
        questions = quiz_data.get('questions', quiz_data) if isinstance(quiz_data, dict) else quiz_data
        evaluation = evaluate_answers(questions, answers)
        
        new_result = Result(
            user_id=user_id,
            quiz_id=quiz_id,
            score=evaluation.get('score', 0),
            feedback_json=json.dumps(evaluation)
        )
        db.session.add(new_result)
        db.session.commit()
        
        return jsonify({"success": True, "data": {"message": "Quiz evaluated", "result_id": new_result.id, "evaluation": evaluation}}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
