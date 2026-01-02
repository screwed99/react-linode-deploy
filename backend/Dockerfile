# --- Builder Stage ---
FROM python:3.12-slim-bookworm AS builder
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

ENV UV_COMPILE_BYTECODE=1 
ENV UV_LINK_MODE=copy

WORKDIR /app

# 1. Define a custom location for the virtual environment
#    (Outside of /app so volumes don't overwrite it)
ENV UV_PROJECT_ENVIRONMENT="/venv"

COPY pyproject.toml uv.lock ./

# 2. Sync dependencies into that custom location
RUN uv sync --frozen --no-install-project --no-dev

# --- Production Stage ---
FROM python:3.12-slim-bookworm AS prod
WORKDIR /app

RUN useradd --create-home appuser
USER appuser

# 3. Copy the venv from the safe location
COPY --from=builder /venv /venv

# 4. Add the safe venv to PATH
ENV PATH="/venv/bin:$PATH"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# --- Dev Stage ---
FROM builder AS dev

# Sync dev dependencies into the safe /venv
RUN uv sync --no-install-project

# Add /venv to PATH
ENV PATH="/venv/bin:$PATH"

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]