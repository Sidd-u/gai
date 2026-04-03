import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from database.models import db
from flask_jwt_extended import JWTManager

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configure Database
    base_dir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(base_dir, 'database.sqlite')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Configure JWT
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default-dev-secret-key')
    jwt = JWTManager(app)
    
    db.init_app(app)
    
    with app.app_context():
        db.create_all()
        
    # Register Blueprints
    from routes.auth_routes import auth_bp
    from routes.resume_routes import resume_bp
    from routes.quiz_routes import quiz_bp
    from routes.roadmap_routes import roadmap_bp
    
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(resume_bp, url_prefix='/resume')
    app.register_blueprint(quiz_bp, url_prefix='/quiz')
    app.register_blueprint(roadmap_bp, url_prefix='/roadmap')

    @app.route('/')
    def health_check():
        return {"status": "healthy", "message": "AI Interview Prep API is running."}

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.getenv('PORT', 5000))
    app.run(debug=True, port=port)
