import typst
from pathlib import Path
from jinja2 import Template

from src.domain.exceptions import RenderFailedError, TemplateNotFoundError
from src.domain.value_objects import TemplateName
from src.application.ports import DocRendererPort

class PdfRendererAdapter(DocRendererPort):
  def __init__(self, templates_dir: Path):
    self.templates_dir = templates_dir

  def render(self, template_name: TemplateName, context: dict) -> bytes:
    template_path = self.templates_dir / str(template_name)

    if not template_path.exists():
      raise TemplateNotFoundError(str(template_name))

    try:
      raw_typst_code = template_path.read_text(encoding="utf-8")
      rendered_code = Template(raw_typst_code).render(context)

      pdf_bytes = typst.compile(
        rendered_code.encode("utf-8"),
        root=self.templates_dir
      )
      return pdf_bytes
    except TemplateNotFoundError:
      raise
    except Exception as e:
      raise RenderFailedError(template_name=str(template_name), reason=str(e))
