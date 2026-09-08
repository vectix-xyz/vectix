from fastapi import Request, status
from fastapi.responses import JSONResponse

from src.domain.exceptions import DomainError, TemplateNotFoundError

async def domain_error_handler(request: Request, exc: DomainError):
    status_code = status.HTTP_400_BAD_REQUEST

    if isinstance(exc, TemplateNotFoundError):
        status_code = status.HTTP_404_NOT_FOUND

    return JSONResponse(
        status_code=status_code,
        content={"detail": str(exc)},
    )