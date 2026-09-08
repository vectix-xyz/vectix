from fastapi import APIRouter
from scalar_fastapi import Theme, get_scalar_api_reference

from src.core.configs import settings

router = APIRouter(include_in_schema=False)

@router.get("/docs")
async def scalar_html():
	return get_scalar_api_reference(
		openapi_url=settings.app.openapi_url,
		title=settings.app.title,
		hide_models=True,
		dark_mode=True,
		scalar_proxy_url="https://proxy.scalar.com",
		theme=Theme.DEEP_SPACE,
	)

docs_controller = router