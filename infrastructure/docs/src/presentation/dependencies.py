from pathlib import Path
from fastapi import Depends

from src.application.ports import CodeGeneratorPort, DocRendererPort
from src.infrastructure.adapters import CodeGeneratorAdapter, PdfRendererAdapter, DocxRendererAdapter
from src.application.use_cases import GenerateReportUseCase, GenerateTicketUseCase

TEMPLATES_DIR = Path(__file__).resolve().parent.parent / "infrastructure" / "adapters" / "templates"

def get_pdf_renderer() -> DocRendererPort:
	return PdfRendererAdapter(templates_dir=TEMPLATES_DIR)

def get_docx_renderer() -> DocRendererPort:
	return DocxRendererAdapter(templates_dir=TEMPLATES_DIR)

def get_code_generator() -> CodeGeneratorPort:
    return CodeGeneratorAdapter()

def get_generate_pdf_use_case(
	renderer: DocRendererPort = Depends(get_pdf_renderer)
) -> GenerateReportUseCase:
	return GenerateReportUseCase(renderer=renderer)

def get_generate_docx_use_case(
	renderer: DocRendererPort = Depends(get_docx_renderer)
) -> GenerateReportUseCase:
	return GenerateReportUseCase(renderer=renderer)

def get_pdf_ticket_use_case(
	renderer: DocRendererPort = Depends(get_pdf_renderer),
	code_generator: CodeGeneratorPort = Depends(get_code_generator)
) -> GenerateTicketUseCase:
	return GenerateTicketUseCase(
		renderer=renderer,
		code_generator=code_generator
	)

def get_docx_ticket_use_case(
	renderer: DocRendererPort = Depends(get_docx_renderer),
	code_generator: CodeGeneratorPort = Depends(get_code_generator)
) -> GenerateTicketUseCase:
	return GenerateTicketUseCase(
		renderer=renderer,
		code_generator=code_generator
	)