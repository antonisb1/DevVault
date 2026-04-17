from functools import lru_cache
from typing import List

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file='.env', case_sensitive=True, extra='ignore')

    PROJECT_NAME: str = 'DevVault API'
    API_V1_STR: str = '/api/v1'
    SECRET_KEY: str = 'change-me'
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 14
    DATABASE_URL: str = 'postgresql+psycopg2://postgres:postgres@localhost:5432/devvault'
    FRONTEND_URL: str = 'http://localhost:5173'
    BACKEND_CORS_ORIGINS: List[str] | str = ['http://localhost:5173']
    COOKIE_SECURE: bool = False

    @field_validator('BACKEND_CORS_ORIGINS', mode='before')
    @classmethod
    def parse_cors_origins(cls, value: List[str] | str):
        if isinstance(value, list):
            return value
        return [item.strip() for item in value.split(',') if item.strip()]


@lru_cache

def get_settings() -> Settings:
    return Settings()


settings = get_settings()
