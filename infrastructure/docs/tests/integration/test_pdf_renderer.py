from pathlib import Path
import pytest

from src.domain.exceptions import RenderFailedError, TemplateNotFoundError
from src.domain.value_objects import TemplateName
from src.infrastructure.adapters import PdfRendererAdapter


class TestPdfRendererAdapterIntegration:
	@pytest.fixture
	def templates_dir(self, tmp_path: Path) -> Path:
		"""Fixture, which create temp dir for templates."""
		dir_path = tmp_path / "templates"
		dir_path.mkdir()
		return dir_path

	@pytest.fixture
	def adapter(self, templates_dir: Path) -> PdfRendererAdapter:
		return PdfRendererAdapter(templates_dir=templates_dir)

	def test_render_success(self, adapter: PdfRendererAdapter, templates_dir: Path):
		template_file = templates_dir / "test_report.typ"
		template_file.write_text(
				'= Report for {{ company_name }}\n#lorem(10)',
				encoding="utf-8"
		)

		template_name = TemplateName("test_report.typ")
		context = {"company_name": "BusToMove Express"}

		pdf_bytes = adapter.render(template_name, context)

		assert isinstance(pdf_bytes, bytes)
		assert len(pdf_bytes) > 0
		assert pdf_bytes.startswith(b"%PDF")

	def test_render_template_not_found(self, adapter: PdfRendererAdapter):
		template_name = TemplateName("non_existing.typ")

		with pytest.raises(TemplateNotFoundError) as exc_info:
				adapter.render(template_name, context={})

		assert "non_existing.typ" in str(exc_info.value)

	def test_render_failed_error_on_invalid_typst_syntax(
		self, adapter: PdfRendererAdapter, templates_dir: Path
	):
		template_file = templates_dir / "broken.typ"
		template_file.write_text("= Broken Typst #invalid_function_that_does_not_exist()", encoding="utf-8")

		template_name = TemplateName("broken.typ")

		with pytest.raises(RenderFailedError) as exc_info:
				adapter.render(template_name, context={})

		assert "broken.typ" in str(exc_info.value)