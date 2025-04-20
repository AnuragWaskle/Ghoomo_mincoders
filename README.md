🌍 Ghoomo – AI Travel Assistant
By Team CodeYatra
Ghoomo is a full-stack AI-powered travel assistant web app that helps users plan and explore trips with intelligent recommendations, map integration, and an interactive UI.
🚀 Features

AI-based travel planning and quiz analysis
Interactive maps with Mapbox
Dynamic PDF generation with jsPDF
Firebase authentication and Firestore
Stylish UI built with React, Vite, and Tailwind

🛠️ Tech Stack



Layer
Tech Used



Frontend
React, Vite, Tailwind CSS, Firebase, Mapbox, Recharts


Backend
Flask, Google Generative AI, Gunicorn


DevOps
Docker, Docker Compose


🧩 Folder Structure
ghoomo/
├── ai-service/         # Flask backend with AI integration
├── client/             # React frontend with Vite + Tailwind
├── docker-compose.yml  # Orchestrates full app

🧪 Installation Guide
1. Clone the Repo
git clone https://github.com/your-org/ghoomo.git
cd ghoomo

2. Set up Environment
Create a .env file inside ai-service/ with your API keys:
GOOGLE_API_KEY=your-google-generativeai-key

3. Run with Docker (Recommended)
docker-compose up --build

This will:

Run the Flask backend on localhost:5000
Launch the React frontend on localhost:5173

💻 Local Development (Without Docker)
Backend (Flask)
cd ai-service
pip install -r requirements.txt
python app.py

Frontend (React)
cd client
npm install
npm run dev

📦 Dependencies
Python (ai-service/requirements.txt)
flask==2.2.3
flask-cors==3.0.10
python-dotenv==1.0.0
google-generativeai==0.3.1
requests==2.28.2
gunicorn==20.1.0

Node (client/package.json)

React 18, Firebase, Axios, Mapbox GL
Tailwind CSS, jsPDF, Recharts

🧠 How to Use

Open the frontend in your browser.
Sign in using Firebase Auth.
Use the AI assistant to get travel suggestions.
View interactive maps and generate PDFs for trip plans or quiz results.

📜 License
This project is licensed under the MIT License.
👨‍💻 Authors
Developed with ❤️ by Team CodeYatra
Empowering journeys through code.
