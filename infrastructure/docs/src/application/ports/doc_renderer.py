from abc import ABC, abstractmethod

from src.domain.value_objects import TemplateName

class DocRendererPort(ABC):
	@abstractmethod
	def render(self, template_name: TemplateName, context: dict) -> bytes:
		"""Take template name and context -> return byte stream of document"""
		pass