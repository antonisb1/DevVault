# DevVault Backend

FastAPI backend for DevVault.

## Local setup

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
python -m app.db.seed
uvicorn app.main:app --reload
```

## API docs

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Demo user

- Email: `demo@devvault.app`
- Password: `Password123!`


Password hashing uses `pbkdf2_sha256` to avoid the bcrypt backend issues that can appear in some container builds.
