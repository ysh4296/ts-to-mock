// ---------------------------------------------------------------------------
// Stage 2: Zod schema → TypeScript type string
//
// Generates a human-readable interface that mirrors z.infer<typeof Schema>.
// Used by the React demo and CLI to show that Zod gives you TypeScript types
// for free — no separate interface declaration needed.
// ---------------------------------------------------------------------------

import { z } from "zod"

type ZodDef = {
  typeName:   string
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

function fieldToTypeStr(schema: z.ZodTypeAny, depth = 0): string {
  const d   = def(schema)
  const pad = "  ".repeat(depth)

  switch (d.typeName) {
    case "ZodString":   return "string"
    case "ZodNumber":   return "number"
    case "ZodBoolean":  return "boolean"
    case "ZodEnum":     return (d.values ?? []).map((v: string) => `"${v}"`).join(" | ")
    case "ZodLiteral":  return JSON.stringify(d.value)
    case "ZodArray":    return `${fieldToTypeStr(d.type!, depth)}[]`
    case "ZodOptional": return `${fieldToTypeStr(d.innerType!, depth)} | undefined`
    case "ZodUnion":
      return (d.options ?? []).map((o: z.ZodTypeAny) => fieldToTypeStr(o, depth)).join(" | ")
    case "ZodObject": {
      const shape = d.shape!()
      const lines = Object.entries(shape)
        .map(([k, v]) => `${pad}  ${k}: ${fieldToTypeStr(v as z.ZodTypeAny, depth + 1)}`)
        .join(";\n")
      return `{\n${lines};\n${pad}}`
    }
    default: return "unknown"
  }
}

// Returns a TypeScript interface string equivalent to z.infer<typeof schema>.
export function zodToTypeScript(schema: z.AnyZodObject, name: string): string {
  const shape = def(schema).shape!()
  const fields = Object.entries(shape)
    .map(([k, v]) => `  ${k}: ${fieldToTypeStr(v as z.ZodTypeAny, 1)}`)
    .join(";\n")
  return `// Equivalent to: type ${name} = z.infer<typeof ${name}Schema>\n\ninterface ${name} {\n${fields};\n}`
}
