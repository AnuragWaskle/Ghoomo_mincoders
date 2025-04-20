from flask import Blueprint, request, jsonify
from services.quiz_analyzer import QuizAnalyzer

quiz_bp = Blueprint('quiz', __name__)

@quiz_bp.route('/questions', methods=['GET'])
def get_quiz_questions():
    """Get the travel persona quiz questions"""
    try:
        questions = QuizAnalyzer.get_quiz_questions()
        return jsonify({
            'success': True,
            'questions': questions
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@quiz_bp.route('/analyze', methods=['POST'])
def analyze_quiz():
    """Analyze quiz responses to determine travel persona"""
    try:
        data = request.json
        
        if not data or not isinstance(data, dict):
            return jsonify({
                'success': False,
                'error': 'Invalid request data'
            }), 400
        
        responses = data.get('responses')
        if not responses:
            return jsonify({
                'success': False,
                'error': 'No responses provided'
            }), 400
        
        analysis = QuizAnalyzer.analyze_responses(responses)
        return jsonify(analysis), 200
    
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500