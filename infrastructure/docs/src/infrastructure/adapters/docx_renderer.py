import io
from pathlib import Path
from docxtpl import DocxTemplate

from src.domain.exceptions import RenderFailedError, TemplateNotFoundError
from src.domain.value_objects import TemplateName
from src.application.ports import DocRendererPort

class DocxRendererAdapter(DocRendererPort):
  def __init__(self, templates_dir: Path):
    self.templates_dir = templates_dir

  def render(self, template_name: TemplateName, context: dict) -> bytes:
    template_path = self.templates_dir / str(template_name)

    if not template_path.exists():
      raise TemplateNotFoundError(str(template_name))

    try:
      doc = DocxTemplate(template_path)
      doc.render(context)

      output_stream = io.BytesIO()
      doc.save(output_stream)
      return output_stream.getvalue()
    except TemplateNotFoundError:
      raise
    except Exception as e:
      raise RenderFailedError(template_name=str(template_name), reason=str(e))