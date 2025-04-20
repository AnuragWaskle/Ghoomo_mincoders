import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Get the model
model = genai.GenerativeModel('gemini-pro')

class GeminiService:
    @staticmethod
    def analyze_quiz_responses(responses):
        """
        Analyze quiz responses to determine travel persona
        
        Args:
            responses (dict): User's quiz responses
            
        Returns:
            dict: Travel persona analysis
        """
        try:
            # Create prompt with the quiz responses
            prompt = f"""
            Based on the following travel quiz responses, determine the user's travel persona.
            Analyze their preferences and categorize them into one of these personas:
            1. Foodie - Prioritizes culinary experiences
            2. Adventurer - Seeks thrilling and outdoor activities
            3. Cultural Explorer - Interested in history, art, and local traditions
            4. Relaxer - Prefers leisurely, stress-free experiences
            5. Shopaholic - Enjoys shopping and markets
            
            Quiz Responses:
            {json.dumps(responses, indent=2)}
            
            Provide a detailed analysis with:
            1. Primary travel persona
            2. Secondary travel persona (if applicable)
            3. Key interests
            4. Budget sensitivity (high, medium, low)
            5. Preferred activities
            6. Travel pace preference (fast, moderate, slow)
            
            Format the response as JSON.
            """
            
            # Generate response
            response = model.generate_content(prompt)
            
            # Parse the response text to extract JSON
            response_text = response.text
            
            # Extract JSON from the response (handling potential markdown code blocks)
            if "```json" in response_text:
                json_str = response_text.split("```json")[1].split("```")[0].strip()
            elif "```" in response_text:
                json_str = response_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = response_text
            
            # Parse JSON
            analysis = json.loads(json_str)
            
            return {
                "success": True,
                "analysis": analysis
            }
            
        except Exception as e:
            print(f"Error analyzing quiz responses: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "analysis": {
                    "primaryPersona": "Cultural Explorer",  # Default fallback
                    "secondaryPersona": "Foodie",
                    "budgetSensitivity": "medium",
                    "interests": ["sightseeing", "local cuisine"],
                    "preferredActivities": ["visiting landmarks", "trying local food"],
                    "travelPace": "moderate"
                }
            }
    
    @staticmethod
    def get_chatbot_response(query, context=None):
        """
        Get a response from the chatbot
        
        Args:
            query (str): User's question
            context (dict): Additional context (itinerary, location, etc.)
            
        Returns:
            dict: Chatbot response
        """
        try:
            # Create the prompt with context if available
            if context:
                location = context.get('location', '')
                itinerary = context.get('itinerary', {})
                user_preferences = context.get('userPreferences', {})
                
                prompt = f"""
                You are Ghoomo, an AI travel assistant for India and international destinations.
                Be helpful, friendly, and use a conversational tone with occasional Hindi phrases.
                
                User's current location/interest: {location}
                User's preferences: {json.dumps(user_preferences, indent=2)}
                
                If itinerary information is available, refer to it in your answers:
                {json.dumps(itinerary, indent=2) if itinerary else 'No itinerary available'}
                
                User's question: {query}
                
                Provide a helpful, accurate response. If suggesting places, include brief descriptions.
                For food recommendations, mention local specialties. For safety tips, be honest but reassuring.
                If you don't know something specific, suggest general advice instead of making up facts.
                """
            else:
                prompt = f"""
                You are Ghoomo, an AI travel assistant for India and international destinations.
                Be helpful, friendly, and use a conversational tone with occasional Hindi phrases.
                
                User's question: {query}
                
                Provide a helpful, accurate response. If suggesting places, include brief descriptions.
                For food recommendations, mention local specialties. For safety tips, be honest but reassuring.
                If you don't know something specific, suggest general advice instead of making up facts.
                """
            
            # Generate response
            response = model.generate_content(prompt)
            
            # Process suggestions for follow-up questions
            follow_up_prompt = f"""
            Based on the user's question "{query}" and your response, suggest 3 short follow-up questions the user might want to ask.
            Format as a JSON array of strings. Keep each question under 60 characters.
            """
            
            follow_up_response = model.generate_content(follow_up_prompt)
            
            # Parse follow-up questions
            follow_up_text = follow_up_response.text
            
            # Extract JSON from the response
            if "```json" in follow_up_text:
                json_str = follow_up_text.split("```json")[1].split("```")[0].strip()
            elif "```" in follow_up_text:
                json_str = follow_up_text.split("```")[1].split("```")[0].strip()
            else:
                json_str = follow_up_text
            
            try:
                suggestions = json.loads(json_str)
            except:
                suggestions = [
                    "What are the best times to visit?",
                    "How's the local transportation?",
                    "Any safety tips I should know?"
                ]
            
            return {
                "success": True,
                "response": response.text,
                "suggestions": suggestions
            }
            
        except Exception as e:
            print(f"Error getting chatbot response: {str(e)}")
            return {
                "success": False,
                "error": str(e),
                "response": "I'm having trouble processing your request right now. Please try again later.",
                "suggestions": [
                    "What are popular destinations in India?",
                    "How can I plan a budget trip?",
                    "What should I pack for my trip?"
                ]
            }