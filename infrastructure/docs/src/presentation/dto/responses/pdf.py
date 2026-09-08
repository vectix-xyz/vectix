from fastapi import Response

class PdfResponse(Response):
	media_type = "application/pdf"

	def __init__(self, content: bytes, filename: str = "document.pdf"):
		super().__init__(
			content=content,
			headers={"Content-Disposition": f'inline; filename="{filename}"'}
		)

PDF_REPORT_RESPONSES = {
	200: {
		"content": {"application/pdf": {"schema": {"type": "string", "format": "binary"}}},
		"description": "Binary PDF document stream",
	},
}