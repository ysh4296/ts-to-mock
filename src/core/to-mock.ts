// ---------------------------------------------------------------------------
// Stage 4: Zod schema → mock data
//
// Traverses Zod's _def (same approach as to-openapi.ts) and generates
// realistic values using @faker-js/faker.
// Field-name hints (name, email, city …) produce context-aware values
// without the caller needing to annotate each field explicitly.
// ---------------------------------------------------------------------------

import { z } from "zod"
import { faker } from "@faker-js/faker"

type ZodDef = {
  typeName:   string
  checks?:    Array<{ kind: string; value?: number }>
  values?:    string[]
  value?:     unknown
  type?:      z.ZodTypeAny
  innerType?: z.ZodTypeAny
  options?:   z.ZodTypeAny[]
  shape?:     () => Record<string, z.ZodTypeAny>
}

function def(schema: z.ZodTypeAny): ZodDef {
  return (schema as unknown as { _def: ZodDef })._def
}

// Field names that trigger realistic values for plain z.string() fields.
const STRING_HINTS: Record<string, () => string> = {
  name:        () => faker.person.fullName(),
  firstName:   () => faker.person.firstName(),
  lastName:    () => faker.person.lastName(),
  username:    () => faker.internet.userName(),
  description: () => faker.lorem.sentence(),
  title:       () => faker.lorem.words(3),
  city:        () => faker.location.city(),
  address:     () => faker.location.streetAddress(),
  company:     () => faker.company.name(),
  phone:       () => faker.phone.number(),
  url:         () => faker.internet.url(),
  color:       () => faker.color.human(),
}

export function zodToMock(schema: z.ZodTypeAny, fieldName?: string): unknown {
  const d = def(schema)

  switch (d.typeName) {
    case "ZodString": {
      const checks = d.checks ?? []
      if (checks.some(c => c.kind === "uuid"))     return faker.string.uuid()
      if (checks.some(c => c.kind === "email"))    return faker.internet.email()
      if (checks.some(c => c.kind === "datetime")) return faker.date.recent().toISOString()
      const hint = fieldName && STRING_HINTS[fieldName]
      return hint ? hint() : faker.lorem.word()
    }

    case "ZodNumber": {
      const checks = d.checks ?? []
      const minC  = checks.find(c => c.kind === "min")
      const maxC  = checks.find(c => c.kind === "max")
      const min   = minC?.value ?? 0
      const max   = maxC?.value ?? 100
      const isInt = checks.some(c => c.kind === "int")
      if (isInt) return faker.number.int({ min: Math.ceil(min), max: Math.floor(max) })
      return Math.round(faker.number.float({ min, max }) * 100) / 100
    }

    case "ZodBoolean":  return faker.datatype.boolean()

    case "ZodEnum":     return faker.helpers.arrayElement(d.values ?? [])

    case "ZodLiteral":  return d.value

    case "ZodArray": {
      const len = faker.number.int({ min: 1, max: 4 })
      return Array.from({ length: len }, () => zodToMock(d.type!))
    }

    case "ZodOptional":
      return Math.random() > 0.3 ? zodToMock(d.innerType!, fieldName) : undefined

    case "ZodUnion":
      return zodToMock(faker.helpers.arrayElement(d.options ?? []), fieldName)

    case "ZodObject": {
      const shape = d.shape!()
      return Object.fromEntries(
        Object.entries(shape).map(([k, v]) => [k, zodToMock(v, k)])
      )
    }

    default: return null
  }
}

// Generate one mock object with optional field-level overrides.
export function toMock(
  schema: z.AnyZodObject,
  overrides?: Record<string, unknown>,
): Record<string, unknown> {
  const base = zodToMock(schema) as Record<string, unknown>
  return overrides ? { ...base, ...overrides } : base
}

// Generate an array of mock objects.
export function toMockList(schema: z.AnyZodObject, count = 3): Record<string, unknown>[] {
  return Array.from({ length: count }, () => toMock(schema))
}
