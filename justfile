backend:
  cd backend && poetry run uvicorn backend.main:app --reload

frontend:
  cd frontend
  pnpm run dev
