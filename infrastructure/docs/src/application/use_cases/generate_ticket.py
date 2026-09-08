from typing import Any, Dict

from src.application.ports import DocRendererPort, CodeGeneratorPort
from src.domain.value_objects import TemplateName

class GenerateTicketUseCase:
	def __init__(self, renderer: DocRendererPort, code_generator: CodeGeneratorPort):
		self._renderer = renderer
		self._code_generator = code_generator

	def _prepare_context(self, payload: Dict[str, Any]) -> Dict[str, Any]:
		context = dict(payload)

		ticket_number = context.get("ticket_number", "")
		payload_data = context.get("qr_payload") or ticket_number

		context["qr_code_b64"] = self._code_generator.generate_qr_base64(payload_data)
		context["barcode_b64"] = self._code_generator.generate_barcode_base64(ticket_number)

		return context

	def execute(self, template_name_str: str, payload: Dict[str, Any]) -> bytes:
		template_name = TemplateName(template_name_str)
		prepared_context = self._prepare_context(payload)
		return self._renderer.render(template_name, prepared_context)