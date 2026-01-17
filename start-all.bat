@echo off
start cmd /k "cd ml-service && uvicorn main:app --reload --port 8000"
start cmd /k "cd server && npm run dev"
start cmd /k "cd client && npm run dev"
echo Services starting...
echo Frontend: http://localhost:5173
echo Server: http://localhost:5000
echo ML Service: http://localhost:8000
