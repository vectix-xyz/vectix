from io import BytesIO
import base64
import segno
import barcode
from barcode.writer import ImageWriter

from src.application.ports import CodeGeneratorPort
from src.domain.exceptions import CodeGenerationError

class CodeGeneratorAdapter(CodeGeneratorPort):
	def generate_qr_base64(self, content: str) -> str:
		try:
			qr = segno.make(content, error='m')
			buffer = BytesIO()

			qr.save(buffer, kind='png', scale=5, border=1)
			b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')

			return f"data:image/png;base64,{b64_str}"
		except Exception as e:
			raise CodeGenerationError(reason=f"QR generation failed: {str(e)}")

	def generate_barcode_base64(self, content: str, code_type: str = "code128") -> str:
		try:
			barcode_class = barcode.get_barcode_class(code_type)
			buffer = BytesIO()

			code_instance = barcode_class(content, writer=ImageWriter())
			code_instance.write(buffer, options={"write_text": True, "module_height": 10.0})
			b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')

			return f"data:image/png;base64,{b64_str}"
		except Exception as e:
			raise CodeGenerationError(reason=f"Barcode generation failed: {str(e)}")