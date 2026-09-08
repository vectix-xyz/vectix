from fastapi import Response

class DocxResponse(Response):
	media_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

	def __init__(self, content: bytes, filename: str = "schedulez.docx"):
		super().__init__(
			content=content,
			headers={"Content-Disposition": f'attachment; filename="{filename}"'},
		)

DOCX_REPORT_RESPONSES = {
	200: {
		"content": {
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
				"schema": {"type": "string", "format": "binary"}
			}
		},
		"description": "Binary DOCX document stream",
	},
}