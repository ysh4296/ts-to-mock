#!/usr/bin/env node
// ---------------------------------------------------------------------------
// ts-to-mock CLI
//
// 기존 스키마 레지스트리 사용:
//   list / pipeline / openapi / mock
//
// TypeScript 파일에서 직접 실행 (ts-to-zod 사용):
//   generate <ts-file>              TypeScript → Zod 스키마 파일 생성
//   from-ts  <ts-file> <action>     TypeScript 파일에서 바로 pipeline/mock/openapi 실행
// ---------------------------------------------------------------------------

import { writeFileSync, readFileSync } from "node:fs"
import { resolve }                     from "node:path"
import { Command }                     from "commander"
import { z }                           from "zod"
import { generate as tsToZod }        from "ts-to-zod"

import { SCHEMAS }            from "../models/index"
import { toOpenAPI }          from "../core/to-openapi"
import { toMock, toMockList } from "../core/to-mock"
import { zodToTypeScript }    from "../core/to-typescript"
import { SCHEMA_SOURCE }      from "../models/source"

// ── ANSI 컬러 헬퍼 ───────────────────────────────────────────────────────────
const bold   = (s: string) => `\x1b[1m${s}\x1b[0m`
const dim    = (s: string) => `\x1b[2m${s}\x1b[0m`
const blue   = (s: string) => `\x1b[34m${s}\x1b[0m`
const purple = (s: string) => `\x1b[35m${s}\x1b[0m`
const yellow = (s: string) => `\x1b[33m${s}\x1b[0m`
const green  = (s: string) => `\x1b[32m${s}\x1b[0m`
const red    = (s: string) => `\x1b[31m${s}\x1b[0m`
const cyan   = (s: string) => `\x1b[36m${s}\x1b[0m`

function stageHeader(num: number, label: string, colorFn: (s: string) => string) {
  console.log()
  console.log(colorFn(bold(`[${num}] ${label}`)))
  console.log(dim("─".repeat(64)))
}

function die(msg: string): never {
  console.error(red("Error:") + " " + msg)
  process.exit(1)
  throw new Error(msg)
}

function resolveSchema(name: string) {
  const schema = SCHEMAS[name]
  if (!schema) die(`Unknown schema "${name}". Available: ${Object.keys(SCHEMAS).join(", ")}`)
  return schema
}

// ── ts-to-zod 변환 헬퍼 ──────────────────────────────────────────────────────

interface ConversionResult {
  zodCode: string
  schemas: Record<string, z.AnyZodObject>
  keys:    string[]   // e.g. ["UserSchema", "OrderItemSchema", "OrderSchema"]
}

/**
 * TypeScript 파일을 읽어 Zod 스키마 객체 맵으로 변환한다.
 *
 * 변환 흐름:
 *  1. readFileSync  → TypeScript 소스 문자열
 *  2. ts-to-zod     → Zod 스키마 코드 문자열
 *  3. new Function  → 실제 Zod 객체 (파일 I/O 없이 메모리에서 평가)
 */
function buildFromTs(filePath: string): ConversionResult {
  let sourceText: string
  try {
    sourceText = readFileSync(resolve(filePath), "utf-8")
  } catch {
    die(`파일을 읽을 수 없습니다: ${filePath}`)
  }

  const result = tsToZod({
    sourceText,
    // "User" → "UserSchema" (대문자 첫 글자 유지)
    getSchemaName: (id: string) => `${id}Schema`,
  })

  if (result.errors.length > 0) {
    console.error(yellow("변환 경고:"))
    result.errors.forEach(e => console.error(dim(`  · ${e}`)))
  }

  const zodCode = result.getZodSchemasFile("zod")

  // export const XxxSchema = ... 패턴으로 이름 추출
  const keys = [...zodCode.matchAll(/^export const (\w+)/gm)].map(m => m[1])

  if (keys.length === 0) {
    die(
      `"${filePath}"에서 변환 가능한 스키마를 찾지 못했습니다.\n` +
      `  → export interface 또는 export type 이 있는지 확인하세요.`
    )
  }

  // import 라인 제거, export 키워드 제거 후 new Function으로 평가
  // (임시 파일 없이 메모리에서 실행 — z 는 외부에서 주입)
  const body = zodCode
    .split("\n")
    .filter(l => !l.trimStart().startsWith("import "))
    .map(l => (l.startsWith("export ") ? l.slice(7) : l))
    .join("\n")

  const fn  = new Function("z", `${body}\nreturn {${keys.join(",")}}`)
  const mod = fn(z) as Record<string, unknown>

  const schemas = Object.fromEntries(
    Object.entries(mod).filter(([, v]) => v instanceof z.ZodType)
  ) as Record<string, z.AnyZodObject>

  return { zodCode, schemas, keys }
}

/** "UserSchema" → "User",  "OrderItemSchema" → "OrderItem" */
function displayName(key: string): string {
  return key.endsWith("Schema") ? key.slice(0, -6) : key
}

/** User, count=1 → "const mockUser: User = { ... }" */
function toTsVar(data: unknown, typeName: string, count: number): string {
  const varName  = count === 1 ? `mock${typeName}` : `mock${typeName}s`
  const typeAnn  = count === 1 ? typeName : `${typeName}[]`
  const body     = JSON.stringify(data, null, 2)
    .replace(/"([a-zA-Z_$][a-zA-Z0-9_$]*)": /g, "$1: ")  // "key": → key:
  return `const ${varName}: ${typeAnn} = ${body}`
}

/** 여러 스키마 중 하나를 선택한다 (단일이면 자동, 복수면 마지막 or --schema 값 사용). */
function pickSchema(
  schemas: Record<string, z.AnyZodObject>,
  keys: string[],
  hint?: string,
): { schema: z.AnyZodObject; name: string } {
  if (hint) {
    const key = keys.find(
      k => k === hint || k === `${hint}Schema` ||
           displayName(k).toLowerCase() === hint.toLowerCase()
    )
    if (!key) {
      die(`"${hint}" 스키마를 찾을 수 없습니다. 사용 가능: ${keys.map(displayName).join(", ")}`)
    }
    return { schema: schemas[key!], name: displayName(key!) }
  }

  if (keys.length === 1) {
    return { schema: schemas[keys[0]], name: displayName(keys[0]) }
  }

  // 파일에서 마지막으로 선언된 것이 보통 루트 타입
  const last = keys[keys.length - 1]
  console.error(dim(`  감지된 스키마: ${keys.map(displayName).join(", ")}`))
  console.error(dim(`  사용: ${displayName(last)}  (다른 것을 쓰려면 --schema 옵션 사용)\n`))
  return { schema: schemas[last], name: displayName(last) }
}

// ── program 설정 ─────────────────────────────────────────────────────────────
const program = new Command()
  .name("ts-to-mock")
  .description("TypeScript + Zod → OpenAPI → Mock  |  schema pipeline")
  .version("0.1.0")
  .addHelpText("after", `
${bold("── 레지스트리 스키마 사용 (Zod 파일 기반) ──")}
  npm run cli -- list
  npm run cli -- pipeline User
  npm run cli -- openapi  Product -o product-api.json
  npm run cli -- mock     Order -n 5

${bold("── TypeScript 파일에서 직접 실행 ──")}
  npm run cli -- generate src/types/user.ts
  npm run cli -- generate src/types/user.ts -o src/models/user.ts

  npm run cli -- from-ts src/types/user.ts pipeline
  npm run cli -- from-ts src/types/order.ts pipeline --schema Order
  npm run cli -- from-ts src/types/user.ts mock -n 5
  npm run cli -- from-ts src/types/user.ts openapi -o user-api.json
`)

// ── list ─────────────────────────────────────────────────────────────────────
program
  .command("list")
  .description("사용 가능한 레지스트리 스키마 목록")
  .action(() => {
    console.log(bold("\n레지스트리 스키마:\n"))
    Object.keys(SCHEMAS).forEach(name => console.log(`  • ${name}`))
    console.log()
  })

// ── pipeline ─────────────────────────────────────────────────────────────────
program
  .command("pipeline <schema>")
  .description("레지스트리 스키마의 4단계 파이프라인 전체 출력")
  .action((schemaName: string) => {
    const schema = resolveSchema(schemaName)

    console.log(bold(`\n  ts-to-mock  ·  ${schemaName} pipeline\n`))
    console.log(dim("  Zod Schema → TypeScript Type → OpenAPI 3.0 → Mock Data\n"))

    stageHeader(1, "Zod Schema Definition", blue)
    console.log(SCHEMA_SOURCE[schemaName] ?? "(source string not found)")

    stageHeader(2, "Derived TypeScript Type", purple)
    console.log(zodToTypeScript(schema, schemaName))

    stageHeader(3, "OpenAPI 3.0 Document", yellow)
    console.log(JSON.stringify(toOpenAPI(schema, schemaName), null, 2))

    stageHeader(4, "Mock Data", green)
    console.log(JSON.stringify(toMock(schema), null, 2))

    console.log()
  })

// ── openapi ──────────────────────────────────────────────────────────────────
program
  .command("openapi <schema>")
  .description("레지스트리 스키마로 OpenAPI 3.0 문서 생성")
  .option("-o, --output <file>", "파일로 저장 (기본: stdout)")
  .action((schemaName: string, opts: { output?: string }) => {
    const schema = resolveSchema(schemaName)
    const json   = JSON.stringify(toOpenAPI(schema, schemaName), null, 2)
    if (opts.output) {
      writeFileSync(opts.output, json, "utf-8")
      console.log(green("✓") + ` Written to ${opts.output}`)
    } else {
      console.log(json)
    }
  })

// ── mock ─────────────────────────────────────────────────────────────────────
program
  .command("mock <schema>")
  .description("레지스트리 스키마로 목 데이터 생성")
  .option("-n, --count <n>", "생성 개수", "1")
  .option("-o, --output <file>", "파일로 저장 (기본: stdout)")
  .action((schemaName: string, opts: { count: string; output?: string }) => {
    const schema = resolveSchema(schemaName)
    const count  = Math.max(1, parseInt(opts.count, 10) || 1)
    const data   = count === 1 ? toMock(schema) : toMockList(schema, count)
    const out    = toTsVar(data, schemaName, count)
    if (opts.output) {
      writeFileSync(opts.output, out, "utf-8")
      console.log(green("✓") + ` Written to ${opts.output}`)
    } else {
      console.log(out)
    }
  })

// ── generate ─────────────────────────────────────────────────────────────────
program
  .command("generate <ts-file>")
  .description("TypeScript 파일 → Zod 스키마 코드 생성")
  .option("-o, --out <file>", "파일로 저장 (기본: stdout)")
  .addHelpText("after", `
${cyan("예시:")}
  npm run cli -- generate src/types/user.ts
  npm run cli -- generate src/types/user.ts -o src/models/user.ts
  npm run cli -- generate src/types/order.ts -o src/models/order.ts
  `)
  .action((tsFile: string, opts: { out?: string }) => {
    console.error(dim(`  읽는 중: ${tsFile}`))

    const { zodCode, keys } = buildFromTs(tsFile)

    console.error(dim(`  변환된 스키마: ${keys.map(displayName).join(", ")}\n`))

    if (opts.out) {
      writeFileSync(opts.out, zodCode, "utf-8")
      console.error(green("✓") + ` Written to ${opts.out}`)
    } else {
      console.log(zodCode)
    }
  })

// ── from-ts ───────────────────────────────────────────────────────────────────
program
  .command("from-ts <ts-file> <action>")
  .description("TypeScript 파일에서 직접 pipeline / mock / openapi 실행")
  .option("-s, --schema <name>", "파일에 인터페이스가 여러 개일 때 사용할 스키마 지정")
  .option("-n, --count <n>",    "생성 개수 (mock 액션)", "1")
  .option("-o, --out <file>",   "파일로 저장 (기본: stdout)")
  .addHelpText("after", `
${cyan("액션:")}
  pipeline   4단계 파이프라인 전체 출력
  mock       목 데이터 생성
  openapi    OpenAPI 3.0 문서 생성

${cyan("예시:")}
  npm run cli -- from-ts src/types/user.ts pipeline
  npm run cli -- from-ts src/types/order.ts pipeline --schema Order
  npm run cli -- from-ts src/types/user.ts mock -n 5
  npm run cli -- from-ts src/types/user.ts openapi -o user-api.json
  npm run cli -- from-ts src/types/order.ts mock --schema Order -n 3 -o orders.json
  `)
  .action((tsFile: string, action: string, opts: {
    schema?: string
    count:   string
    out?:    string
  }) => {
    console.error(dim(`  읽는 중: ${tsFile}`))

    const { zodCode, schemas, keys } = buildFromTs(tsFile)
    const { schema, name }           = pickSchema(schemas, keys, opts.schema)

    const writeOrPrint = (json: string) => {
      if (opts.out) {
        writeFileSync(opts.out, json, "utf-8")
        console.error(green("✓") + ` Written to ${opts.out}`)
      } else {
        console.log(json)
      }
    }

    switch (action) {
      case "pipeline": {
        console.log(bold(`\n  ts-to-mock  (from-ts)  ·  ${name}\n`))
        console.log(dim("  TypeScript 파일 → Zod 스키마 → TypeScript Type → OpenAPI → Mock\n"))

        stageHeader(1, "Generated Zod Schema", blue)
        console.log(zodCode)

        stageHeader(2, "Derived TypeScript Type", purple)
        console.log(zodToTypeScript(schema, name))

        stageHeader(3, "OpenAPI 3.0 Document", yellow)
        console.log(JSON.stringify(toOpenAPI(schema, name), null, 2))

        stageHeader(4, "Mock Data", green)
        console.log(JSON.stringify(toMock(schema), null, 2))

        console.log()
        break
      }

      case "mock": {
        const count   = Math.max(1, parseInt(opts.count, 10) || 1)
        const targets = opts.schema
          ? [{ s: schema, n: name }]
          : keys.map(k => ({ s: schemas[k], n: displayName(k) }))
        const out = targets
          .map(({ s, n }) => toTsVar(count === 1 ? toMock(s) : toMockList(s, count), n, count))
          .join("\n\n")
        writeOrPrint(out)
        break
      }

      case "openapi": {
        writeOrPrint(JSON.stringify(toOpenAPI(schema, name), null, 2))
        break
      }

      default:
        die(`알 수 없는 액션 "${action}". 사용 가능: pipeline | mock | openapi`)
    }
  })

program.parse()
