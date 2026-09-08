from .base import DomainError

class TicketError(DomainError):
	message = "Ticket processing error occurred."

class CodeGenerationError(TicketError):
	message = "Failed to generate code: {reason}"