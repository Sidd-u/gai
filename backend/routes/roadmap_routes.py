import json
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database.models import db, Result
from services.ai_services.roadmap_generator import generate_roadmap

roadmap_bp = Blueprint('roadmap', __name__)

@roadmap_bp.route('/generate', methods=['POST'])
@jwt_required()
def create_roadmap():
    data = request.get_json()
    result_id = data.get('result_id')
    
    if not result_id:
        return jsonify({"success": False, "error": "result_id required"}), 400
        
    try:
        user_id = get_jwt_identity()
        result = Result.query.filter_by(id=result_id, user_id=user_id).first()
        
        if not result:
            return jsonify({"success": False, "error": "Result not found"}), 404
            
        feedback = json.loads(result.feedback_json)
        roadmap = generate_roadmap(feedback)
        
        result.roadmap_json = json.dumps(roadmap)
        db.session.commit()
        
        print("Received result_id:", result_id)
        return jsonify({"success": True, "data": {"roadmap": roadmap}}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
