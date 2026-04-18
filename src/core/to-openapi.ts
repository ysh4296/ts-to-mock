// ---------------------------------------------------------------------------
// Stage 3: Zod schema → OpenAPI 3.0 document
//
// We traverse Zod's internal _def structure rather than using zod-to-openapi
// so that the transformation logic is fully visible in this file.
// _def access is standard practice in the Zod ecosystem (used by zod-to-openapi,
// trpc, etc.) — Zod exposes it intentionally as a stable internal API.
// ---------------------------------------------------------------------------

import { z } from "zod"

type OAPISchema = Record<string, unknown>

// Typed subset of Zod's _def — only the fields we actually read.
type ZodDef = {
  typeName:    string
  description?: string
  checks?:     Array<{ kind: string; value?: number }>
  values?:     string[]
  value?:      unknown
  type?:       z.ZodTypeAny
  innerType?:  z.ZodTypeAny
  options?:    z.ZodTypeAny[]
  shape?:      () => Record<string, z.ZodTypeAny>
}

function def(schema: z.ZodTypeAny): ZodDef {
  return (schema as unknown as { _def: ZodDef })._def
}

export function zodToOpenAPISchema(schema: z.ZodTypeAny): OAPISchema {
  const d = def(schema)
  // .describe("...") on any Zod field maps directly to OpenAPI description
  const base: OAPISchema = d.description ? { description: d.description } : {}

  switch (d.typeName) {
    case "ZodString": {
      const checks = d.checks ?? []
      if (checks.some(c => c.kind === "uuid"))     return { ...base, type: "string", format: "uuid",      example: "550e8400-e29b-41d4-a716-446655440000" }
      if (checks.some(c => c.kind === "email"))    return { ...base, type: "string", format: "email",     example: "user@example.com" }
      if (checks.some(c => c.kind === "datetime")) return { ...base, type: "string", format: "date-time" }
      return { ...base, type: "string" }
    }

    case "ZodNumber": {
      const checks = d.checks ?? []
      const minC  = checks.find(c => c.kind === "min")
      const maxC  = checks.find(c => c.kind === "max")
      const isInt = checks.some(c => c.kind === "int")
      return {
        ...base,
        type: isInt ? "integer" : "number",
        ...(minC && { minimum: minC.value }),
        ...(maxC && { maximum: maxC.value }),
      }
    }

    case "ZodBoolean": return { ...base, type: "boolean" }

    case "ZodEnum":    return { ...base, type: "string", enum: d.values }

    case "ZodLiteral": return { ...base, const: d.value }

    case "ZodArray":   return { ...base, type: "array", items: zodToOpenAPISchema(d.type!) }

    case "ZodOptional": return zodToOpenAPISchema(d.innerType!)

    case "ZodUnion":   return { ...base, oneOf: (d.options ?? []).map(zodToOpenAPISchema) }

    case "ZodObject": {
      const shape = d.shape!()
      return {
        ...base,
        type: "object",
        properties: Object.fromEntries(
          Object.entries(shape).map(([k, v]) => [k, zodToOpenAPISchema(v)])
        ),
        required: Object.keys(shape),
      }
    }

    default: return { ...base, type: "string" }
  }
}

// Wraps the schema in a complete OpenAPI 3.0 document with standard CRUD paths.
export function toOpenAPI(schema: z.AnyZodObject, name: string): OAPISchema {
  const plural = name.toLowerCase() + "s"
  return {
    openapi: "3.0.0",
    info: { title: `${name} API`, version: "1.0.0" },
    paths: {
      [`/${plural}`]: {
        get: {
          summary:     `List ${name}s`,
          operationId: `list${name}s`,
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: { type: "array", items: { $ref: `#/components/schemas/${name}` } },
                },
              },
            },
          },
        },
      },
      [`/${plural}/{id}`]: {
        get: {
          summary:     `Get ${name} by id`,
          operationId: `get${name}ById`,
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } },
          ],
          responses: {
            "200": {
              description: "OK",
              content: {
                "application/json": {
                  schema: { $ref: `#/components/schemas/${name}` },
                },
              },
            },
          },
        },
      },
    },
    components: {
      schemas: {
        [name]: zodToOpenAPISchema(schema),
      },
    },
  }
}
