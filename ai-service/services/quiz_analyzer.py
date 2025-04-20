from services.gemini_service import GeminiService

class QuizAnalyzer:
    # Quiz questions with weights for different personas
    QUESTIONS = [
        {
            "id": "preferred_activities",
            "text": "What activities do you enjoy most while traveling?",
            "options": [
                {"id": "food_tasting", "text": "Food tasting and cooking classes", "weight": {"foodie": 10, "cultural": 5}},
                {"id": "outdoor_adventure", "text": "Outdoor adventures and sports", "weight": {"adventurer": 10, "relaxer": -5}},
                {"id": "museums_history", "text": "Museums and historical sites", "weight": {"cultural": 10, "adventurer": 2}},
                {"id": "shopping_markets", "text": "Shopping and local markets", "weight": {"shopaholic": 10, "foodie": 3}},
                {"id": "beaches_relaxation", "text": "Beaches and relaxation", "weight": {"relaxer": 10, "adventurer": -3}}
            ],
            "allowMultiple": True
        },
        {
            "id": "budget_preference",
            "text": "What's your budget preference?",
            "options": [
                {"id": "budget", "text": "Budget-friendly (hostels, street food)", "weight": {"budget": "low"}},
                {"id": "mid_range", "text": "Mid-range (3-star hotels, casual restaurants)", "weight": {"budget": "medium"}},
                {"id": "luxury", "text": "Luxury (5-star hotels, fine dining)", "weight": {"budget": "high"}}
            ],
            "allowMultiple": False
        },
        {
            "id": "travel_pace",
            "text": "How do you prefer to travel?",
            "options": [
                {"id": "fast_paced", "text": "Fast-paced with many activities", "weight": {"pace": "fast", "adventurer": 5}},
                {"id": "balanced", "text": "Balanced mix of activities and relaxation", "weight": {"pace": "moderate"}},
                {"id": "slow_relaxed", "text": "Slow and relaxed, taking my time", "weight": {"pace": "slow", "relaxer": 5}}
            ],
            "allowMultiple": False
        },
        {
            "id": "accommodation",
            "text": "What type of accommodation do you prefer?",
            "options": [
                {"id": "hostel", "text": "Hostels or budget stays", "weight": {"budget": "low"}},
                {"id": "mid_hotel", "text": "Mid-range hotels", "weight": {"budget": "medium"}},
                {"id": "luxury_hotel", "text": "Luxury hotels and resorts", "weight": {"budget": "high", "relaxer": 5}},
                {"id": "local_stay", "text": "Local homestays", "weight": {"cultural": 5, "foodie": 3}}
            ],
            "allowMultiple": False
        },
        {
            "id": "food_preference",
            "text": "What's your approach to food while traveling?",
            "options": [
                {"id": "local_cuisine", "text": "Trying all local specialties", "weight": {"foodie": 10, "cultural": 3}},
                {"id": "street_food", "text": "Street food and markets", "weight": {"foodie": 8, "budget": "low"}},
                {"id": "fine_dining", "text": "Fine dining experiences", "weight": {"foodie": 6, "budget": "high"}},
                {"id": "familiar_food", "text": "Sticking to familiar foods", "weight": {"foodie": -5}}
            ],
            "allowMultiple": True
        }
    ]
    
    @staticmethod
    def get_quiz_questions():
        """
        Get the quiz questions
        
        Returns:
            list: Quiz questions
        """
        # Return questions without the weights
        public_questions = []
        
        for question in QuizAnalyzer.QUESTIONS:
            public_question = question.copy()
            public_options = []
            
            for option in question["options"]:
                public_option = {
                    "id": option["id"],
                    "text": option["text"]
                }
                public_options.append(public_option)
            
            public_question["options"] = public_options
            public_questions.append(public_question)
        
        return public_questions
    
    @staticmethod
    def analyze_responses(responses):
        """
        Analyze quiz responses to determine travel persona
        
        Args:
            responses (dict): User's responses to quiz questions
            
        Returns:
            dict: Analysis results
        """
        # First pass: Calculate weights for each persona
        persona_scores = {
            "foodie": 0,
            "adventurer": 0,
            "cultural": 0,
            "relaxer": 0,
            "shopaholic": 0
        }
        
        budget_votes = []
        pace_preference = None
        
        # Process each response
        for question_id, answer_ids in responses.items():
            # Make sure answer_ids is a list
            if not isinstance(answer_ids, list):
                answer_ids = [answer_ids]
            
            # Find the question
            question = next((q for q in QuizAnalyzer.QUESTIONS if q["id"] == question_id), None)
            if not question:
                continue
            
            # Process each selected option
            for answer_id in answer_ids:
                option = next((o for o in question["options"] if o["id"] == answer_id), None)
                if not option or "weight" not in option:
                    continue
                
                # Apply weights to personas
                for persona, weight in option["weight"].items():
                    if persona == "budget":
                        budget_votes.append(weight)  # low, medium, high
                    elif persona == "pace":
                        pace_preference = weight  # fast, moderate, slow
                    else:
                        persona_scores[persona] = persona_scores.get(persona, 0) + weight
        
        # Determine primary and secondary personas
        sorted_personas = sorted(persona_scores.items(), key=lambda x: x[1], reverse=True)
        primary_persona = sorted_personas[0][0] if sorted_personas[0][1] > 0 else "cultural"
        secondary_persona = sorted_personas[1][0] if len(sorted_personas) > 1 and sorted_personas[1][1] > 0 else None
        
        # Determine budget sensitivity
        if budget_votes:
            # Count occurrences of each budget level
            budget_counts = {"low": 0, "medium": 0, "high": 0}
            for vote in budget_votes:
                budget_counts[vote] += 1
            
            # Get the most frequent budget level
            budget_sensitivity = max(budget_counts.items(), key=lambda x: x[1])[0]
        else:
            budget_sensitivity = "medium"  # Default
        
        # Get more detailed analysis from Gemini
        gemini_analysis = GeminiService.analyze_quiz_responses(responses)
        
        # If Gemini analysis is successful, use it; otherwise, use our basic analysis
        if gemini_analysis["success"]:
            analysis = gemini_analysis["analysis"]
        else:
            # Map persona names to full names
            persona_map = {
                "foodie": "Foodie",
                "adventurer": "Adventurer",
                "cultural": "Cultural Explorer",
                "relaxer": "Relaxer",
                "shopaholic": "Shopaholic"
            }
            
            # Create interests based on primary persona
            interests_map = {
                "foodie": ["local cuisine", "food markets", "cooking classes"],
                "adventurer": ["outdoor activities", "hiking", "water sports"],
                "cultural": ["museums", "historical sites", "local traditions"],
                "relaxer": ["beaches", "spas", "scenic views"],
                "shopaholic": ["markets", "malls", "local crafts"]
            }
            
            # Create preferred activities based on primary persona
            activities_map = {
                "foodie": ["trying local restaurants", "food tours", "visiting markets"],
                "adventurer": ["hiking", "kayaking", "zip-lining"],
                "cultural": ["visiting museums", "guided tours", "cultural performances"],
                "relaxer": ["beach time", "spa treatments", "scenic drives"],
                "shopaholic": ["shopping at markets", "visiting malls", "buying souvenirs"]
            }
            
            analysis = {
                "primaryPersona": persona_map.get(primary_persona, "Cultural Explorer"),
                "secondaryPersona": persona_map.get(secondary_persona, "Foodie") if secondary_persona else None,
                "budgetSensitivity": budget_sensitivity,
                "interests": interests_map.get(primary_persona, ["sightseeing", "local cuisine"]),
                "preferredActivities": activities_map.get(primary_persona, ["visiting landmarks", "trying local food"]),
                "travelPace": pace_preference or "moderate"
            }
        
        return {
            "success": True,
            "analysis": analysis
        }