# --- Bare Metal Dev (Fastest) ---
install-backend:
	cd backend && pip install uv && uv sync

run-backend:
	cd backend && uv run uvicorn main:app --reload --port $(shell grep API_PORT .env | cut -d '=' -f2)

run-frontend:
	cd frontend && npm install && npm run dev

# --- Docker Dev ---
docker-dev:
	docker compose up --build

# --- Production ---
deploy:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
