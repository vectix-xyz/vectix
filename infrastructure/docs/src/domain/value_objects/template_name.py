from dataclasses import dataclass

from src.domain.exceptions import DomainError

@dataclass(frozen=True)
class TemplateName:
	value: str

	def __post_init__(self):
		if not self.value or not self.value.strip():
			raise DomainError("Template name cannot be empty.")
		if ".." in self.value:
			raise DomainError("Invalid template path.")

	def __str__(self) -> str:
		return self.value