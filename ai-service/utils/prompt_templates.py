"""
Prompt templates for Gemini API
"""

def get_quiz_analysis_prompt(responses):
    """
    Get prompt for analyzing quiz responses
    
    Args:
        responses (dict): User's quiz responses
        
    Returns:
        str: Prompt for Gemini API
    """
    return f"""
    Based on the following travel quiz responses, determine the user's travel persona.
    Analyze their preferences and categorize them into one of these personas:
    1. Foodie - Prioritizes culinary experiences
    2. Adventurer - Seeks thrilling and outdoor activities
    3. Cultural Explorer - Interested in history, art, and local traditions
    4. Relaxer - Prefers leisurely, stress-free experiences
    5. Shopaholic - Enjoys shopping and markets
    
    Quiz Responses:
    {responses}
    
    Provide a detailed analysis with:
    1. Primary travel persona
    2. Secondary travel persona (if applicable)
    3. Key interests
    4. Budget sensitivity (high, medium, low)
    5. Preferred activities
    6. Travel pace preference (fast, moderate, slow)
    
    Format the response as JSON.
    """

def get_chatbot_prompt(query, context=None):
    """
    Get prompt for chatbot response
    
    Args:
        query (str): User's question
        context (dict): Additional context
        
    Returns:
        str: Prompt for Gemini API
    """
    if context:
        location = context.get('location', '')
        itinerary = context.get('itinerary', {})
        user_preferences = context.get('userPreferences', {})
        
        return f"""
        You are Ghoomo, an AI travel assistant for India and international destinations.
        Be helpful, friendly, and use a conversational tone with occasional Hindi phrases.
        
        User's current location/interest: {location}
        User's preferences: {user_preferences}
        
        If itinerary information is available, refer to it in your answers:
        {itinerary if itinerary else 'No itinerary available'}
        
        User's question: {query}
        
        Provide a helpful, accurate response. If suggesting places, include brief descriptions.
        For food recommendations, mention local specialties. For safety tips, be honest but reassuring.
        If you don't know something specific, suggest general advice instead of making up facts.
        """
    else:
        return f"""
        You are Ghoomo, an AI travel assistant for India and international destinations.
        Be helpful, friendly, and use a conversational tone with occasional Hindi phrases.
        
        User's question: {query}
        
        Provide a helpful, accurate response. If suggesting places, include brief descriptions.
        For food recommendations, mention local specialties. For safety tips, be honest but reassuring.
        If you don't know something specific, suggest general advice instead of making up facts.
        """