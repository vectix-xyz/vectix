#set page(
  paper: "a4",
  margin: (top: 3cm, bottom: 2.5cm, left: 1.8cm, right: 1.8cm),
  header: context {
    let page_number = counter(page).get().first()
    if page_number >= 1 {
      block(width: 100%, inset: (bottom: 8pt), stroke: (bottom: 0.5pt + luma(180)))[
        #grid(
          columns: (1fr, 1fr, 1fr),
          align(left)[
            #text(size: 8pt, fill: rgb("#6B7280"), weight: "medium")[
              BusToMove • Period trip reports
            ]
          ],
          align(center)[
            #text(size: 8pt, fill: rgb("#6B7280"), weight: "medium")[
              Automatic generated
            ]
          ],
          align(right)[
            #text(size: 8pt, fill: rgb("#6B7280"), weight: "bold")[
              {{ company_name }}
            ]
          ]
        )
      ]
    }
  },
  footer: context {
    let page_number = counter(page).get().first()
    let total_pages = counter(page).final().first()
    block(width: 100%, inset: (top: 8pt), stroke: (top: 0.5pt + luma(220)))[
      #grid(
        columns: (1fr, 1fr, 1fr),
        align(left)[
          #text(size: 8pt, fill: rgb("#9CA3AF"))[
            Confidential
          ]
        ],
        align(center)[
          #text(size: 8pt, fill: rgb("#9CA3AF"))[
            Automatic generated
          ]
        ],
        align(right)[
          #text(size: 8pt, fill: rgb("#4B5563"), weight: "bold")[
            Page #page_number з #total_pages
          ]
        ]
      )
    ]
  }
)

#set text(font: "DejaVu Sans", size: 9.5pt, fill: rgb("#1F2937"))
#set par(leading: 0.65em)

// ==========================================
// HEADER BLOCK: LOGO + METADATA
// ==========================================
#grid(
  columns: (1fr, auto),
  align: (left + horizon, right + horizon),
  [
    // Clean Grid alignment for Icon + Brand Text
    #grid(
      columns: (auto, auto),
      gutter: 10pt,
      align: (horizon, horizon),
      rect(
        width: 32pt,
        height: 32pt,
        radius: 6pt,
        fill: rgb("#1E3A8A"),
        align(center + horizon)[
          #text(fill: white, size: 16pt, weight: "bold")[B]
        ]
      ),
      [
        #text(size: 15pt, weight: "bold", fill: rgb("#1E3A8A"))[BusToMove] \
        #v(-2pt)
        #text(size: 8pt, fill: rgb("#6B7280"), weight: "medium")[Document Generation Service]
      ]
    )
  ],
  [
    #rect(
      fill: rgb("#F3F4F6"),
      radius: 4pt,
      inset: (x: 10pt, y: 6pt)
    )[
      #text(size: 8pt, fill: rgb("#4B5563"))[Report date:] \
      #text(size: 9.5pt, weight: "bold", fill: rgb("#111827"))[{{ report_date }}]
    ]
  ]
)

#v(1.2em)

// ==========================================
// TITLE & METRICS SUMMARY
// ==========================================
#grid(
  columns: (1fr, auto),
  align: (left + horizon, right + horizon),
  [
    #text(size: 16pt, weight: "bold", fill: rgb("#1E3A8A"))[Trip report for: {{ company_name }}]
  ],
  [
    #rect(
      fill: rgb("#EFF6FF"),
      stroke: 0.5pt + rgb("#BFDBFE"),
      radius: 4pt,
      inset: (x: 8pt, y: 5pt)
    )[
      #text(size: 8.5pt, fill: rgb("#1E40AF"), weight: "bold")[
        Total trips: {{ trips|length }}
      ]
    ]
  ]
)

// ==========================================
// VISUAL ANALYTICS / CHART BLOCK
// ==========================================
{% if hourly_stats %}
#v(0.5em)
#block(
  width: 100%,
  fill: rgb("#FAFAFA"),
  stroke: 0.5pt + rgb("#E5E7EB"),
  radius: 6pt,
  inset: 12pt
)[
  #text(size: 10pt, weight: "bold", fill: rgb("#1E3A8A"))[Passengers quantity per hours]
  #v(1em)

  #grid(
    columns: {{ hourly_stats|length }},
    gutter: 12pt,
    align: bottom + center,
    {% for stat in hourly_stats %}
    [
      #let bar_height = ({{ stat.passengers }} / {{ max_passengers | default(1) }}) * 60pt
      #text(size: 7.5pt, weight: "bold", fill: rgb("#4B5563"))[{{ stat.passengers }}]
      #v(2pt)
      #rect(
        width: 100%,
        height: calc.max(bar_height, 4pt),
        fill: rgb("#1E3A8A"),
        radius: (top: 3pt, bottom: 0pt)
      )
      #v(4pt)
      #text(size: 7.5pt, fill: rgb("#6B7280"))[{{ stat.hour }}]
    ]{% if not loop.last %},{% endif %}
    {% endfor %}
  )
]
#v(1em)
{% endif %}

#v(1.5em)

// ==========================================
// MAIN TABLE
// ==========================================
#table(
  columns: (0.8fr, 2.2fr, 1.5fr, 1fr),
  align: (col, row) => (
    if col == 3 { right + horizon }
    else { left + horizon }
  ),
  stroke: (x, y) => if y == 0 { none } else { (top: 0.5pt + rgb("#E5E7EB"), bottom: none) },
  fill: (x, y) => {
    if y == 0 {
      rgb("#1E3A8A")
    } else if calc.even(y) {
      rgb("#F9FAFB")
    } else {
      none
    }
  },
  inset: (x: 8pt, y: 7pt),

  // Table Header
  [*#text(fill: white, weight: "bold")[Time]*],
  [*#text(fill: white, weight: "bold")[Trip]*],
  [*#text(fill: white, weight: "bold")[Vehicle]*],
  [*#text(fill: white, weight: "bold")[Passengers]*],

  // Table Body via Jinja2
  {% for trip in trips %}
  [{{ trip.time }}],
  [{{ trip.route }}],
  [{{ trip.bus }}],
  [#text(weight: "medium")[{{ trip.passengers }}]]{% if not loop.last %},{% endif %}
  {% endfor %}
)

#v(2.5em)

// ==========================================
// SIGNATURES BLOCK
// ==========================================
#align(bottom)[
  #block(width: 100%, breakable: false)[
    #line(length: 100%, stroke: 0.5pt + rgb("#D1D5DB"))
    #v(1em)
    #grid(
      columns: (1fr, 1fr),
      gutter: 20pt,
      [
        #text(size: 8.5pt, weight: "bold", fill: rgb("#374151"))[Responsable:] \
        #v(2.5em)
        #line(length: 80%, stroke: 0.5pt + rgb("#9CA3AF"))
        #v(2pt)
        #text(size: 7.5pt, fill: rgb("#6B7280"))[(Sign / Name Surname)]
      ],
      [
        #text(size: 8.5pt, weight: "bold", fill: rgb("#374151"))[Taken by:] \
        #v(2.5em)
        #line(length: 80%, stroke: 0.5pt + rgb("#9CA3AF"))
        #v(2pt)
        #text(size: 7.5pt, fill: rgb("#6B7280"))[(Sign / Name Surname)]
      ]
    )
  ]
]