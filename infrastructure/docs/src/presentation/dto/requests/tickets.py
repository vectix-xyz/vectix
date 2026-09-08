from pydantic import Field
from typing import Optional

from src.core.dto import Base

class PassengerDTO(Base):
	full_name: str = Field(..., example="Carl Petron")
	seat_number: str = Field(..., example="12B")
	passenger_type: str = Field(default="Standard", example="Standard")

class TicketRequest(Base):
	ticket_number: str = Field(..., example="BTM-2026-88901")
	company_name: str = Field(default="BusToMove", example="BusToMove")
	route_from: str = Field(..., example="Kyiv")
	route_to: str = Field(..., example="Lviv")
	departure_time: str = Field(..., example="2026-08-15 08:30")
	arrival_time: str = Field(..., example="2026-08-15 14:45")
	bus_info: str = Field(..., example="Neoplan N122 (KA 1234 BP)")
	passenger: PassengerDTO
	price_uah: float = Field(..., example="450.00")
	qr_payload: Optional[str] = Field(
		default=None, 
		description="String for code into QR (by default ticket_number)"
	)