import { writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs"
import { resolve, relative, dirname, join } from "node:path"
import { Command } from "commander"
import { parseTypes, toMock, toMockList, EnumRef, type TypeMap } from "../core/ast-to-mock"

const green = (s: string) => `\x1b[32m${s}\x1b[0m`
const red   = (s: string) => `\x1b[31m${s}\x1b[0m`
const dim   = (s: string) => `\x1b[2m${s}\x1b[0m`

function die(msg: string): never {
  console.error(red("Error:") + " " + msg)
  process.exit(1)
  throw new Error(msg)
}

function serialize(value: unknown, depth = 0): string {
  const pad   = "  ".repeat(depth)
  const inner = "  ".repeat(depth + 1)

  if (value instanceof EnumRef)   return value.ref
  if (value === null)              return "null"
  if (value === undefined)         return "undefined"
  if (typeof value === "string")   return JSON.stringify(value)
  if (typeof value === "number" || typeof value === "boolean") return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return "[]"
    const items = value.map(v => `${inner}${serialize(v, depth + 1)}`).join(",\n")
    return `[\n${items}\n${pad}]`
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${inner}${k}: ${serialize(v, depth + 1)}`)
    if (entries.length === 0) return "{}"
    return `{\n${entries.join(",\n")}\n${pad}}`
  }
  return "null"
}

function toTsVar(data: unknown, typeName: string, count: number): string {
  const varName = count === 1 ? `mock${typeName}` : `mock${typeName}s`
  const typeAnn = count === 1 ? typeName : `${typeName}[]`
  return `export const ${varName}: ${typeAnn} = ${serialize(data)}`
}

function buildFileHeader(typeNames: string[], typeMap: TypeMap, tsFile: string, outFile: string): string {
  const from = relative(dirname(resolve(outFile)), resolve(tsFile))
    .replace(/\\/g, "/")
    .replace(/\.ts$/, "")
  const importPath = from.startsWith(".") ? from : "./" + from
  const specifiers = typeNames
    .map(n => typeMap.get(n)?.kind === "enum" ? n : `type ${n}`)
    .join(", ")
  return `import { ${specifiers} } from "${importPath}"\n\n`
}

const SCAN_IGNORE = new Set(["node_modules", ".git", "dist", "build", ".next", "out", "coverage"])

function findTsFiles(dir: string): string[] {
  const result: string[] = []
  function walk(current: string) {
    for (const entry of readdirSync(current)) {
      if (SCAN_IGNORE.has(entry)) continue
      const full = join(current, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
      } else if (
        entry.endsWith(".ts") &&
        !entry.endsWith(".d.ts") &&
        !entry.endsWith(".test.ts") &&
        !entry.endsWith(".spec.ts")
      ) {
        result.push(full)
      }
    }
  }
  walk(dir)
  return result
}

function generateForFile(
  tsFile: string,
  outFile: string,
  count: number,
  schema?: string,
): void {
  const { typeMap, exportedNames } = parseTypes(tsFile)
  if (exportedNames.length === 0) return

  const targets = schema
    ? (() => {
        const name = exportedNames.find(
          n => n === schema || n.toLowerCase() === schema.toLowerCase()
        )
        if (!name) throw new Error(`Type "${schema}" not found. Available: ${exportedNames.join(", ")}`)
        return [name]
      })()
    : exportedNames

  const body = targets
    .map(n => toTsVar(count === 1 ? toMock(n, typeMap) : toMockList(n, typeMap, count), n, count))
    .join("\n\n")

  const out = buildFileHeader(targets, typeMap, tsFile, outFile) + body
  mkdirSync(dirname(resolve(outFile)), { recursive: true })
  writeFileSync(outFile, out, "utf-8")
}

new Command()
  .name("ts-to-mock")
  .description("Generate typed mock variables from TypeScript interfaces")
  .version("0.1.0")
  .argument("[ts-file]", "TypeScript file to generate mocks from")
  .option("-n, --count <n>",       "number of mocks to generate", "1")
  .option("-o, --out <file>",      "output file path (default: stdout)")
  .option("-s, --schema <name>",   "specific type to generate (default: all exported types)")
  .option("-d, --dir <dir>",       "scan all TypeScript files in a directory recursively")
  .option("--out-dir <dir>",       "output directory when using --dir (mirrors source structure)")
  .addHelpText("after", `
Examples:
  # Single file
  ts-to-mock src/types/user.ts
  ts-to-mock src/types/user.ts -n 5
  ts-to-mock src/types/user.ts -o src/mocks/mockUser.ts
  ts-to-mock src/types/order.ts --schema Order -n 3 -o mocks/orders.ts

  # Directory (mirrors structure)
  ts-to-mock --dir src/types --out-dir src/mocks
  ts-to-mock --dir src --out-dir mocks -n 3
  `)
  .action((tsFile: string | undefined, opts: {
    count: string
    out?: string
    schema?: string
    dir?: string
    outDir?: string
  }) => {
    const count = Math.max(1, parseInt(opts.count, 10) || 1)

    // ── directory mode ─────────────────────────────────────────────────────
    if (opts.dir) {
      if (!opts.outDir) die("--out-dir 옵션이 필요합니다  (예: --out-dir src/mocks)")

      const absDir    = resolve(opts.dir)
      const absOutDir = resolve(opts.outDir)
      const files     = findTsFiles(absDir)

      if (files.length === 0) die(`"${opts.dir}" 에서 TypeScript 파일을 찾을 수 없습니다`)

      let generated = 0
      let skipped   = 0

      for (const file of files) {
        const rel     = relative(absDir, file)
        const outFile = join(absOutDir, rel)
        try {
          const { exportedNames } = parseTypes(file)
          if (exportedNames.length === 0) {
            console.error(dim(`  skip  ${rel}`))
            skipped++
            continue
          }
          generateForFile(file, outFile, count, opts.schema)
          console.error(green("  ✓  ") + rel)
          generated++
        } catch (e) {
          console.error(red("  ✗  ") + `${rel}: ${e}`)
        }
      }

      console.error(`\n${generated}개 파일 생성 → ${opts.outDir}${skipped ? `  (${skipped}개 skip)` : ""}`)
      return
    }

    // ── single file mode ───────────────────────────────────────────────────
    if (!tsFile) die("파일 경로 또는 --dir 옵션을 지정하세요")

    let typeMap: ReturnType<typeof parseTypes>["typeMap"]
    let exportedNames: string[]
    try {
      ;({ typeMap, exportedNames } = parseTypes(resolve(tsFile)))
    } catch (e) {
      die(`Cannot parse file: ${tsFile}\n${e}`)
    }

    if (exportedNames.length === 0) die(`No exported types found in "${tsFile}"`)

    const targets = opts.schema
      ? (() => {
          const name = exportedNames.find(
            n => n === opts.schema || n.toLowerCase() === opts.schema!.toLowerCase()
          )
          if (!name) die(`Type "${opts.schema}" not found. Available: ${exportedNames.join(", ")}`)
          return [name!]
        })()
      : exportedNames

    const body = targets
      .map(n => toTsVar(count === 1 ? toMock(n, typeMap) : toMockList(n, typeMap, count), n, count))
      .join("\n\n")

    if (opts.out) {
      const out = buildFileHeader(targets, typeMap, tsFile, opts.out) + body
      mkdirSync(dirname(resolve(opts.out)), { recursive: true })
      writeFileSync(opts.out, out, "utf-8")
      console.error(green("✓") + ` Written to ${opts.out}`)
    } else {
      console.log(body)
    }
  })
  .parse()
