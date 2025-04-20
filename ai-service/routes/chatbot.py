from flask import Blueprint, request, jsonify
from services.gemini_service import GeminiService

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/ask', methods=['POST'])
def ask_chatbot():
    """Get a response from the chatbot"""
    try:
        data = request.json
        
        if not data:
            return jsonify({
                'success': False,
                'error': 'Invalid request data'
            }), 400
        
        query = data.get('query')
        if not query:
            return jsonify({
                'success': False,
                'error': 'No query provided'
            }), 400
        
        # Get optional context
        context = data.get('context', {})
        
        # Get response from Gemini
        response = GeminiService.get_chatbot_response(query, context)
        
        return jsonify(response), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'response': "I'm having trouble processing your request right now. Please try again later.",
            'suggestions': [
                "What are popular destinations in India?",
                "How can I plan a budget trip?",
                "What should I pack for my trip?"
            ]
        }), 500