#set page(
  paper: "a5",
  flipped: true,
  margin: (top: 1.2cm, bottom: 1.2cm, left: 1.5cm, right: 1.5cm)
)

#set text(font: "DejaVu Sans", size: 9pt, fill: rgb("#1F2937"))

// ==========================================
// TICKET CONTAINER CARD
// ==========================================
#rect(
  width: 100%,
  height: 100%,
  stroke: 1pt + rgb("#1E3A8A"),
  radius: 8pt,
  inset: 12pt,
  fill: rgb("#FFFFFF")
)[
  // Header
  #grid(
    columns: (1fr, auto),
    align: (left + horizon, right + horizon),
    [
      #text(size: 16pt, weight: "bold", fill: rgb("#1E3A8A"))[BusToMove] \
      #text(size: 8pt, fill: rgb("#6B7280"))[Посадковий купон / Boarding Pass]
    ],
    [
      #rect(
        fill: rgb("#EFF6FF"),
        stroke: 0.5pt + rgb("#BFDBFE"),
        radius: 4pt,
        inset: (x: 8pt, y: 4pt)
      )[
        #text(size: 10pt, weight: "bold", fill: rgb("#1E40AF"))[{{ ticket_number }}]
      ]
    ]
  )

  #v(0.8em)
  #line(length: 100%, stroke: 0.5pt + rgb("#E5E7EB"))
  #v(0.8em)

  // Route Block
  #grid(
    columns: (1fr, auto, 1fr),
    align: (left + horizon, center + horizon, right + horizon),
    [
      #text(size: 8pt, fill: rgb("#6B7280"))[Звідки:] \
      #text(size: 13pt, weight: "bold", fill: rgb("#111827"))[{{ route_from }}] \
      #text(size: 8.5pt, fill: rgb("#374151"))[{{ departure_time }}]
    ],
    [
      #text(size: 14pt, fill: rgb("#1E3A8A"))[➔]
    ],
    [
      #align(right)[
        #text(size: 8pt, fill: rgb("#6B7280"))[Куди:] \
        #text(size: 13pt, weight: "bold", fill: rgb("#111827"))[{{ route_to }}] \
        #text(size: 8.5pt, fill: rgb("#374151"))[{{ arrival_time }}]
      ]
    ]
  )

  #v(1em)

  // Passenger & Codes Section
  #grid(
    columns: (1.5fr, 1fr),
    gutter: 15pt,
    [
      #rect(
        width: 100%,
        fill: rgb("#F9FAFB"),
        stroke: 0.5pt + rgb("#F3F4F6"),
        radius: 6pt,
        inset: 8pt
      )[
        #grid(
          columns: (1fr, 1fr),
          gutter: 8pt,
          [
            #text(size: 7.5pt, fill: rgb("#6B7280"))[Пасажир:] \
            #text(size: 9.5pt, weight: "bold")[{{ passenger.full_name }}]
          ],
          [
            #text(size: 7.5pt, fill: rgb("#6B7280"))[Місце:] \
            #text(size: 11pt, weight: "bold", fill: rgb("#166534"))[{{ passenger.seat_number }}]
          ],
          [
            #text(size: 7.5pt, fill: rgb("#6B7280"))[Транспорт:] \
            #text(size: 8pt)[{{ bus_info }}]
          ],
          [
            #text(size: 7.5pt, fill: rgb("#6B7280"))[Вартість:] \
            #text(size: 9.5pt, weight: "bold")[{{ price_uah }} UAH]
          ]
        )
      ]
    ],
    [
      #align(center + horizon)[
        #image("{{ qr_code_path }}", width: 70pt, height: 70pt)
      ]
    ]
  )

  #v(0.8em)

  // Barcode Footer
  #align(center + bottom)[
    #image("{{ barcode_path }}", width: 180pt, height: 35pt)
  ]
]