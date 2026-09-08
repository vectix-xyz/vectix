from fastapi import APIRouter, Depends

from src.presentation.dto.responses import COMMON_ERROR_RESPONSES, PDF_REPORT_RESPONSES, PdfResponse, DOCX_REPORT_RESPONSES, DocxResponse
from src.presentation.dto.requests import GenerateReportRequest
from src.application.use_cases import GenerateReportUseCase
from src.presentation.dependencies import get_generate_docx_use_case, get_generate_pdf_use_case

router = APIRouter(prefix="/reports", tags=["Reports"], responses=COMMON_ERROR_RESPONSES)

@router.post("/pdf", responses=PDF_REPORT_RESPONSES)
async def generate_pdf_report(
  payload: GenerateReportRequest,
  use_case: GenerateReportUseCase = Depends(get_generate_pdf_use_case),
):
  pdf_bytes = use_case.execute("trip_schedule.typ", payload.model_dump())
  return PdfResponse(content=pdf_bytes, filename="schedule.pdf")

@router.post("/docx", responses=DOCX_REPORT_RESPONSES)
async def generate_docx_report(
  payload: GenerateReportRequest,
  use_case: GenerateReportUseCase = Depends(get_generate_docx_use_case),
):
  docx_bytes = use_case.execute("trip_schedule.docx", payload.model_dump())
  return DocxResponse(content=docx_bytes, filename="schedule.docx")

report_controller = router