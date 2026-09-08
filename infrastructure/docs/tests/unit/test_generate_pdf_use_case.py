from unittest.mock import MagicMock
import pytest

from src.application.ports import DocRendererPort
from src.application.use_cases import GenerateReportUseCase
from src.domain.exceptions import DomainError
from src.domain.value_objects import TemplateName


class TestGeneratePdfReportUseCase:
	@pytest.fixture
	def mock_renderer(self) -> MagicMock:
		"""Create mock adapter, which represent DocRendererPort."""
		return MagicMock(spec=DocRendererPort)

	@pytest.fixture
	def use_case(self, mock_renderer: MagicMock) -> GenerateReportUseCase:
		"""Create use-case with thrown mock."""
		return GenerateReportUseCase(renderer=mock_renderer)

	def test_execute_success(self, use_case: GenerateReportUseCase, mock_renderer: MagicMock):
		template_name_str = "trip_schedule.typ"
		context = {"company_name": "BusToMove", "trips": []}
		expected_pdf_bytes = b"%PDF-1.4 fake pdf binary data"

		mock_renderer.render.return_value = expected_pdf_bytes
		result = use_case.execute(template_name_str=template_name_str, context=context)

		assert result == expected_pdf_bytes

		mock_renderer.render.assert_called_once()
		call_args = mock_renderer.render.call_args
		passed_template_name, passed_context = call_args[0]

		assert isinstance(passed_template_name, TemplateName)
		assert passed_template_name.value == template_name_str
		assert passed_context == context

	def test_execute_raises_domain_error_on_invalid_template_name(self, use_case: GenerateReportUseCase, mock_renderer: MagicMock):
		invalid_template_name = "   "
		context = {}

		with pytest.raises(DomainError) as exc_info:
			use_case.execute(template_name_str=invalid_template_name, context=context)

		assert "Template name cannot be empty" in str(exc_info.value)
		mock_renderer.render.assert_not_called()