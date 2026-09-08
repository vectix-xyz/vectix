from typing import Any, Dict

from src.application.ports import DocRendererPort
from src.domain.value_objects import TemplateName

class GenerateReportUseCase:
	def __init__(self, renderer: DocRendererPort):
		self._renderer = renderer

	def _prepare_context(self, payload: Dict[str, Any]) -> Dict[str, Any]:
		context = dict[str, Any](payload)

		trips = context.get("trips") or []
		context["trips"] = trips

		hourly_stats = context.get("hourly_stats")
		if not hourly_stats:
			stats: Dict[str, int] = {}
			for trip in trips:
				time_str = trip.get("time", "00:00")
				hour = time_str.split(":")[0] + ":00"
				stats[hour] = stats.get(hour, 0) + trip.get("passengers", 0)

			hourly_stats = [
				{"hour": h, "passengers": count}
				for h, count in sorted(stats.items())
			]
			context["hourly_stats"] = hourly_stats

		passengers_list = (
			[s["passengers"] for s in hourly_stats] if hourly_stats else []
		)
		context["max_passengers"] = (
			max(passengers_list) if passengers_list else 1
		)

		return context

	def execute(self, template_name_str: str, payload: Dict[str, Any]) -> bytes:
		template_name = TemplateName(template_name_str)
		prepared_context = self._prepare_context(payload)
		return self._renderer.render(template_name, prepared_context)