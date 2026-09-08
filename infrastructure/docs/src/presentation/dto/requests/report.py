from typing import List, Optional
from pydantic import Field

from src.core.dto import Base

class HourlyStatDto(Base):
	hour: str = Field(..., description="Hour (example, '08:00')")
	passengers: int = Field(..., description="Passengers quantity")

class TripDto(Base):
	time: str
	route: str
	bus: str
	passengers: int

class GenerateReportRequest(Base):
	company_name: str
	report_date: str
	trips: List[TripDto]
	hourly_stats: Optional[List[HourlyStatDto]] = None