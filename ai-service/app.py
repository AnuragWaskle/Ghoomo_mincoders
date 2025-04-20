from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from routes.quiz import quiz_bp
from routes.chatbot import chatbot_bp

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Register blueprints
app.register_blueprint(quiz_bp, url_prefix='/api/quiz')
app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')

# Health check route
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'ghoomo-ai-service'
    }), 200

# Error handler
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Error: {str(e)}")
    return jsonify({
        'error': str(e),
        'message': 'An error occurred while processing your request'
    }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    debug = os.environ.get('FLASK_ENV', 'development') == 'development'
    
    app.run(host='0.0.0.0', port=port, debug=debug)