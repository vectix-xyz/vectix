from .base import DomainError

class TemplateNotFoundError(DomainError):
	message = "Template '{template_name}' was not found in storage."

class RenderFailedError(DomainError):
	message = "Failed to render template '{template_name}': {reason}"