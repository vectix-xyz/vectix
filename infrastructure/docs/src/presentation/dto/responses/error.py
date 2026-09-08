from pydantic import Field

from src.core.dto import Base

class ErrorResponse(Base):
	detail: str = Field(..., example="Template 'trip_schedule' was not found.")

COMMON_ERROR_RESPONSES = {
	400: {"model": ErrorResponse, "description": "Validation or rendering error"},
	404: {"model": ErrorResponse, "description": "Template missing"},
}