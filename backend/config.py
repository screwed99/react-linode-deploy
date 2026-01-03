from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import ValidationError

ROOT_DIR = Path(__file__).resolve().parent.parent
ENV_FILE_PATH = ROOT_DIR / ".env"

class Settings(BaseSettings):
    environment: str
    allowed_origins: str

    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH,
        env_file_encoding='utf-8',
        # "ignore" allows extra variables in the .env 
        # without throwing an error
        extra='ignore' 
    )

    @property
    def cors_origins(self):
        return [origin.strip() for origin in self.allowed_origins.split(",") if origin]

try:
    settings = Settings()
except ValidationError as e:
    print(f"❌ CRITICAL: Failed to load config. Looked at: {ENV_FILE_PATH}")
    print(e)
    exit(1)