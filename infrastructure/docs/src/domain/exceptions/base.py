class DomainError(Exception):
	"""Base class for domain exceptions: automatic collect str from message class"""
	message: str = "A domain error occurred."

	def __init__(self, *args, **kwargs):
		"""Automatic fill message with arguments or save kwargs as attributes"""
		self.__dict__.update(kwargs)

		if kwargs:
			formatted_message = self.message.format(**kwargs)
		elif args:
			if "{template_name}" in self.message:
				formatted_message = self.message.format(template_name=args[0])
			else:
				formatted_message = str(args[0])
		else:
			formatted_message = self.message

		super().__init__(formatted_message)