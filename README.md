# AgriMitra 🌾

An intelligent web application providing farmers with AI-powered tools for crop management, disease detection, and market insights. **Powered by MERN Stack & Python AI.**

![Build Status](https://img.shields.io/badge/build-verified-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## About The Project

AgriMitra is a comprehensive, AI-powered platform built to address the everyday challenges faced by modern farmers. By combining machine learning with essential agricultural data, this application serves as a one-stop digital assistant for farming operations.

---

### Key Features

*   **📅 AI Smart Calendar:** Generates personalized week-by-week farming schedules.
*   **📸 Visual AI Assistant:** A multimodal chatbot (Voice + Text + Image) that can analyze plant images and answer farming queries.
*   **👥 Kisan Forum:** A community space for farmers to share tips, ask questions, and interact with peers.
*   **🌿 Plant Diagnosis:** Instantly identifies crop diseases from photos using MobileNetV2 (Python ML Service) with Gemini AI Fallback.
*   **☀️ Weather Dashboard:** Real-time temperature, humidity, and 5-day forecasts.
*   **📈 Market Insights:** Track mandi prices and trends for various crops.
*   **🗣️ Bilingual Support:** Fully localized interface in English, Hindi (हिंदी), and Gujarati.

---

### Built With

This project is built with a modern, full-stack technology set (**MERN**):

*   [React](https://reactjs.org/) (Vite)
*   [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
*   [MongoDB](https://www.mongodb.com/)
*   [Python](https://www.python.org/) & [FastAPI](https://fastapi.tiangolo.com/) (ML Service)
*   [Tailwind CSS](https://tailwindcss.com/)

## Project Structure

```
AgriMitra/
├── client/                     # Frontend (React + Vite)
│   ├── src/
│   │   ├── pages/              # Application Pages
│   │   ├── components/         # Reusable UI Components
│   │   └── ...
├── server/                     # Backend (Node.js + Express)
│   ├── src/
│   │   ├── models/             # Mongoose Models
│   │   ├── routes/             # API Routes
│   │   └── ...
└── ml-service/                 # AI Service (Python + FastAPI)
    ├── main.py                 # ML Entry Point
    └── ...
```

---

## Getting Started

### Prerequisites
*   Node.js (v18+)
*   Python (v3.10+)
*   MongoDB

### Installation

1.  **Clone the repository**
    ```sh
    git clone https://github.com/deepaksinghh12/Agrimitra.git
    cd AgriMitra
    ```

2.  **Install Dependencies**
    *   **Frontend**: `cd client && npm install`
    *   **Backend**: `cd server && npm install`
    *   **ML Service**: `cd ml-service && pip install -r requirements.txt`

3.  **Run the Application**
    *   **Backend**: `cd server && npm run dev` (Runs on port 5000)
    *   **ML Service**: `cd ml-service && uvicorn main:app --reload` (Runs on port 8000)
    *   **Frontend**: `cd client && npm run dev` (Runs on port 5173)

open [http://localhost:5173](http://localhost:5173) to view it in the browser.

