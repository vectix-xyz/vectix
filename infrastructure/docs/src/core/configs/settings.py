from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict

class AppConfig(BaseSettings):
		title: str = "BTM Docs Generator API"
		debug: bool = False
		openapi_url: str = "/openapi.json"

		model_config = SettingsConfigDict(
				env_file=".env",
				extra="ignore",
		)


class ServerConfig(BaseSettings):
		port: int = Field(validation_alias="PORT")
		host: str = Field(validation_alias="HOST")

		model_config = SettingsConfigDict(
				env_file=".env",
				extra="ignore",
		)


class DatabaseConfig(BaseSettings):
		user: str = Field(validation_alias="DATABASE_USER")
		password: str = Field(validation_alias="DATABASE_PASSWORD")

		model_config = SettingsConfigDict(
				env_file=".env",
				extra="ignore",
		)


class Settings(BaseSettings):
		app: AppConfig = AppConfig()
		server: ServerConfig = ServerConfig()
		db: DatabaseConfig = Field(default_factory=DatabaseConfig)

		model_config = SettingsConfigDict(
				env_file=".env",
				extra="ignore",
		)

settings = Settings()
