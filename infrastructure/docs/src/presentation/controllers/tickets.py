from fastapi import APIRouter, Depends, status
from fastapi.responses import Response

from src.presentation.dependencies import get_docx_ticket_use_case, get_pdf_ticket_use_case
from src.presentation.dto.requests import TicketRequest
from src.presentation.dto.responses import COMMON_ERROR_RESPONSES, DOCX_REPORT_RESPONSES, PDF_REPORT_RESPONSES, PdfResponse, DocxResponse
from src.application.use_cases import GenerateTicketUseCase

router = APIRouter(prefix="/tickets", tags=["Tickets"], responses=COMMON_ERROR_RESPONSES)

@router.post("/pdf", responses=PDF_REPORT_RESPONSES)
async def generate_pdf_ticket(
	payload: TicketRequest,
	use_case: GenerateTicketUseCase = Depends(get_pdf_ticket_use_case)
):
	pdf_bytes = use_case.execute("bus_ticket.typ", payload.model_dump())
	filename = f"ticket_{payload.ticket_number}.pdf"
	return PdfResponse(content=pdf_bytes, filename=filename)

@router.post("/docx", responses=DOCX_REPORT_RESPONSES)
async def generate_docx_ticket(
	payload: TicketRequest,
	use_case: GenerateTicketUseCase = Depends(get_docx_ticket_use_case)
):
	docx_bytes = use_case.execute("bus_ticket.docx", payload.model_dump())
	filename = f"ticket_{payload.ticket_number}.docx"
	return DocxResponse(content=docx_bytes, filename=filename)

tickets_controller = router