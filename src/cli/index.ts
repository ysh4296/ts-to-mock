#!/usr/bin/env node
import { writeFileSync, readFileSync, mkdirSync } from "node:fs"
import { resolve, relative, dirname }  from "node:path"
import { Command }                     from "commander"
import { z }                           from "zod"
import { generate as tsToZod }        from "ts-to-zod"
import { toMock, toMockList }         from "../core/to-mock"

const green = (s: string) => `\x1b[32m${s}\x1b[0m`
const dim   = (s: string) => `\x1b[2m${s}\x1b[0m`
const red   = (s: string) => `\x1b[31m${s}\x1b[0m`

function die(msg: string): never {
  console.error(red("Error:") + " " + msg)
  process.exit(1)
  throw new Error(msg)
}

function buildFromTs(filePath: string) {
  let sourceText: string
  try {
    sourceText = readFileSync(resolve(filePath), "utf-8")
  } catch {
    die(`Cannot read file: ${filePath}`)
  }

  const result = tsToZod({ sourceText, getSchemaName: (id) => `${id}Schema` })

  if (result.errors.length > 0) {
    result.errors.forEach(e => console.error(dim(`  · ${e}`)))
  }

  const zodCode = result.getZodSchemasFile("zod")
  const keys    = [...zodCode.matchAll(/^export const (\w+)/gm)].map(m => m[1])

  if (keys.length === 0) die(`No exportable types found in "${filePath}"`)

  const body = zodCode
    .split("\n")
    .filter(l => !l.trimStart().startsWith("import "))
    .map(l => l.startsWith("export ") ? l.slice(7) : l)
    .join("\n")

  const schemas = Object.fromEntries(
    Object.entries(new Function("z", `${body}\nreturn {${keys.join(",")}}`) (z) as Record<string, unknown>)
      .filter(([, v]) => v instanceof z.ZodType)
  ) as Record<string, z.AnyZodObject>

  return { schemas, keys }
}

function displayName(key: string): string {
  return key.endsWith("Schema") ? key.slice(0, -6) : key
}

function toTsVar(data: unknown, typeName: string, count: number): string {
  const varName = count === 1 ? `mock${typeName}` : `mock${typeName}s`
  const typeAnn = count === 1 ? typeName : `${typeName}[]`
  const body    = JSON.stringify(data, null, 2)
    .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)": /g, "$1: ")
  return `export const ${varName}: ${typeAnn} = ${body}`
}

function buildFileHeader(typeNames: string[], tsFile: string, outFile: string): string {
  const from = relative(dirname(resolve(outFile)), resolve(tsFile))
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "")
  const importPath = from.startsWith(".") ? from : "./" + from
  return `import type { ${typeNames.join(", ")} } from "${importPath}"\n\n`
}

new Command()
  .name("ts-to-mock")
  .description("Generate typed mock variables from TypeScript interfaces")
  .version("0.1.0")
  .argument("<ts-file>", "TypeScript file containing interface definitions")
  .option("-n, --count <n>",     "number of mocks to generate", "1")
  .option("-o, --out <file>",    "save to file (default: stdout)")
  .option("-s, --schema <name>", "specific type to use (default: all types in file)")
  .addHelpText("after", `
Examples:
  ts-to-mock src/types/user.ts
  ts-to-mock src/types/user.ts -n 5
  ts-to-mock src/types/user.ts -o src/mocks/mockUser.ts
  ts-to-mock src/types/order.ts --schema Order -n 3 -o mocks/orders.ts
  `)
  .action((tsFile: string, opts: { count: string; out?: string; schema?: string }) => {
    const { schemas, keys } = buildFromTs(tsFile)
    const count = Math.max(1, parseInt(opts.count, 10) || 1)

    const targets = opts.schema
      ? (() => {
          const key = keys.find(
            k => k === opts.schema || k === `${opts.schema}Schema` ||
                 displayName(k).toLowerCase() === opts.schema!.toLowerCase()
          )
          if (!key) die(`Schema "${opts.schema}" not found. Available: ${keys.map(displayName).join(", ")}`)
          return [{ s: schemas[key!], n: displayName(key!) }]
        })()
      : keys.map(k => ({ s: schemas[k], n: displayName(k) }))

    const body = targets
      .map(({ s, n }) => toTsVar(count === 1 ? toMock(s) : toMockList(s, count), n, count))
      .join("\n\n")

    const out = opts.out
      ? buildFileHeader(targets.map(t => t.n), tsFile, opts.out) + body
      : body

    if (opts.out) {
      mkdirSync(dirname(resolve(opts.out)), { recursive: true })
      writeFileSync(opts.out, out, "utf-8")
      console.error(green("✓") + ` Written to ${opts.out}`)
    } else {
      console.log(out)
    }
  })
  .parse()
