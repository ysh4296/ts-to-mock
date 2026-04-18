// ---------------------------------------------------------------------------
// MSW request handlers
//
// Handlers are generated dynamically from the SCHEMAS registry.
// Adding a new schema to models/index.ts automatically creates:
//   GET /api/{plural}      → returns 5 mock items
//   GET /api/{plural}/:id  → returns 1 mock item (id preserved from URL)
// ---------------------------------------------------------------------------

import { http, HttpResponse } from "msw"
import { SCHEMAS } from "../models/index"
import { toMock, toMockList } from "../core/to-mock"

function makeHandlers(name: string) {
  const schema = SCHEMAS[name]
  const base   = `/api/${name.toLowerCase()}s`

  return [
    http.get(base, () =>
      HttpResponse.json(toMockList(schema, 5))
    ),
    http.get(`${base}/:id`, ({ params }) =>
      HttpResponse.json(toMock(schema, { id: params.id as string }))
    ),
  ]
}

export const handlers = Object.keys(SCHEMAS).flatMap(makeHandlers)
