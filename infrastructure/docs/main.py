import uvicorn
from dotenv import load_dotenv
from fastapi import FastAPI

from src.domain.exceptions import DomainError
from src.presentation.exception_handlers import domain_error_handler
from src.core.configs import settings
from src.presentation.controllers import report_controller, docs_controller, tickets_controller

load_dotenv()

def create_app() -> FastAPI:
	"""Factory for create FastAPI app."""
	app = FastAPI(
		title=settings.app.title,
		docs_url=None,
		redoc_url=None,
	)

	"""Global Exception Handler."""
	app.add_exception_handler(DomainError, domain_error_handler)

	"""Connect controllers to the app."""
	app.include_router(docs_controller)
	app.include_router(report_controller)
	app.include_router(tickets_controller)

	return app


app = create_app()

if __name__ == "__main__":
	uvicorn.run(
		"main:app",
		host=settings.server.host,
		port=settings.server.port,
		reload=True
	)