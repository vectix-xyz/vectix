from abc import ABC, abstractmethod

class CodeGeneratorPort(ABC):
	@abstractmethod
	def generate_qr_base64(self, content: str) -> str:
		"""Move QR in base64 data URL for insert into HTML/DOCX/Typst."""
		pass

	@abstractmethod
	def generate_barcode_base64(self, content: str, code_type: str = "code128") -> str:
		"""Move Barcode in base64 data URL."""
		pass