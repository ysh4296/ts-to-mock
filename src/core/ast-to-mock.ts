import * as ts from "typescript"
import { readFileSync, existsSync } from "node:fs"
import { resolve, dirname } from "node:path"
import { faker } from "@faker-js/faker"

export class EnumRef {
  constructor(readonly ref: string) {}
}

const STRING_HINTS: Record<string, () => string> = {
  // person
  name:         () => faker.person.fullName(),
  firstName:    () => faker.person.firstName(),
  lastName:     () => faker.person.lastName(),
  username:     () => faker.internet.userName(),
  jobTitle:     () => faker.person.jobTitle(),
  // contact
  email:        () => faker.internet.email(),
  phone:        () => faker.phone.number(),
  // text
  description:  () => faker.lorem.sentence(),
  title:        () => faker.lorem.words(3),
  body:         () => faker.lorem.paragraph(),
  bio:          () => faker.lorem.sentence(),
  summary:      () => faker.lorem.sentence(),
  excerpt:      () => faker.lorem.sentence(),
  query:        () => faker.lorem.words(2),
  // location
  city:         () => faker.location.city(),
  address:      () => faker.location.streetAddress(),
  country:      () => faker.location.country(),
  timezone:     () => faker.location.timeZone(),
  // company / web
  company:      () => faker.company.name(),
  url:          () => faker.internet.url(),
  link:         () => faker.internet.url(),
  website:      () => faker.internet.url(),
  ip:           () => faker.internet.ip(),
  ipAddress:    () => faker.internet.ip(),
  // identifiers
  id:           () => faker.string.uuid(),
  slug:         () => faker.helpers.slugify(faker.lorem.words(2)).toLowerCase(),
  // auth
  password:     () => faker.internet.password(),
  secret:       () => faker.string.alphanumeric(32),
  token:        () => faker.string.alphanumeric(40),
  accessToken:  () => faker.string.alphanumeric(40),
  refreshToken: () => faker.string.alphanumeric(40),
  hash:         () => faker.string.alphanumeric(40),
  // misc
  color:        () => faker.color.human(),
  locale:       () => faker.helpers.arrayElement(["en-US", "ko-KR", "ja-JP", "fr-FR", "de-DE"]),
  language:     () => faker.helpers.arrayElement(["en", "ko", "ja", "fr", "de"]),
  mimeType:     () => faker.system.mimeType(),
  version:      () => faker.system.semver(),
  emoji:        () => faker.internet.emoji(),
}

const SUFFIX_HINTS: [string, () => string][] = [
  ["Id",   () => faker.string.uuid()],
  ["At",   () => faker.date.recent().toISOString()],
  ["Date", () => faker.date.recent().toISOString()],
  ["Url",  () => faker.internet.url()],
]

function getStringHint(fieldName: string): string {
  const exact = STRING_HINTS[fieldName]
  if (exact) return exact()
  for (const [suffix, fn] of SUFFIX_HINTS) {
    if (fieldName.length > suffix.length && fieldName.endsWith(suffix)) return fn()
  }
  return faker.lorem.word()
}

type TypeEntry =
  | { kind: "type";      node: ts.TypeNode }
  | { kind: "interface"; node: ts.InterfaceDeclaration }
  | { kind: "enum";      node: ts.EnumDeclaration }

export type TypeMap = Map<string, TypeEntry>

function interfaceToMock(node: ts.InterfaceDeclaration, typeMap: TypeMap): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  if (node.heritageClauses) {
    for (const clause of node.heritageClauses) {
      if (clause.token !== ts.SyntaxKind.ExtendsKeyword) continue
      for (const type of clause.types) {
        const name = ts.isIdentifier(type.expression) ? type.expression.text : ""
        const entry = name ? typeMap.get(name) : undefined
        if (entry?.kind === "interface") Object.assign(result, interfaceToMock(entry.node, typeMap))
      }
    }
  }

  Object.assign(result, typeElementsToMock(node.members, typeMap))
  return result
}

function typeElementsToMock(
  members: ts.NodeArray<ts.TypeElement>,
  typeMap: TypeMap,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const member of members) {
    if (!ts.isPropertySignature(member) || !member.type) continue
    const key = ts.isIdentifier(member.name) ? member.name.text
      : ts.isStringLiteral(member.name) ? member.name.text
      : ""
    if (!key) continue
    if (member.questionToken && Math.random() < 0.3) continue
    result[key] = typeNodeToMock(member.type, typeMap, key)
  }
  return result
}

function extractLiteralKeys(node: ts.TypeNode): string[] {
  if (ts.isLiteralTypeNode(node) && ts.isStringLiteral(node.literal)) return [node.literal.text]
  if (ts.isUnionTypeNode(node)) return node.types.flatMap(extractLiteralKeys)
  return []
}

function typeNodeToMock(node: ts.TypeNode, typeMap: TypeMap, fieldName?: string): unknown {
  switch (node.kind) {
    case ts.SyntaxKind.StringKeyword:
      return fieldName ? getStringHint(fieldName) : faker.lorem.word()
    case ts.SyntaxKind.NumberKeyword:
      return faker.number.int({ min: 0, max: 100 })
    case ts.SyntaxKind.BooleanKeyword:
      return faker.datatype.boolean()
    case ts.SyntaxKind.NullKeyword:
      return null
    case ts.SyntaxKind.UndefinedKeyword:
    case ts.SyntaxKind.VoidKeyword:
      return undefined
    case ts.SyntaxKind.AnyKeyword:
    case ts.SyntaxKind.UnknownKeyword:
    case ts.SyntaxKind.ObjectKeyword:
      return {}
    case ts.SyntaxKind.NeverKeyword:
      return null

    case ts.SyntaxKind.LiteralType: {
      const lit = (node as ts.LiteralTypeNode).literal
      if (ts.isStringLiteral(lit))  return lit.text
      if (ts.isNumericLiteral(lit)) return Number(lit.text)
      if (lit.kind === ts.SyntaxKind.TrueKeyword)  return true
      if (lit.kind === ts.SyntaxKind.FalseKeyword) return false
      if (lit.kind === ts.SyntaxKind.NullKeyword)  return null
      return null
    }

    case ts.SyntaxKind.ArrayType: {
      const len = faker.number.int({ min: 1, max: 4 })
      return Array.from({ length: len }, () =>
        typeNodeToMock((node as ts.ArrayTypeNode).elementType, typeMap)
      )
    }

    case ts.SyntaxKind.UnionType: {
      const types = [...(node as ts.UnionTypeNode).types]
      const concrete = types.filter(
        t => t.kind !== ts.SyntaxKind.UndefinedKeyword && t.kind !== ts.SyntaxKind.NullKeyword
      )
      const pool = concrete.length > 0 && Math.random() > 0.2 ? concrete : types
      return typeNodeToMock(faker.helpers.arrayElement(pool), typeMap, fieldName)
    }

    case ts.SyntaxKind.IntersectionType: {
      const parts = (node as ts.IntersectionTypeNode).types.map(t => {
        const v = typeNodeToMock(t, typeMap)
        return typeof v === "object" && v !== null ? v : {}
      })
      return Object.assign({}, ...parts)
    }

    case ts.SyntaxKind.TypeLiteral:
      return typeElementsToMock((node as ts.TypeLiteralNode).members, typeMap)

    case ts.SyntaxKind.ParenthesizedType:
      return typeNodeToMock((node as ts.ParenthesizedTypeNode).type, typeMap, fieldName)

    case ts.SyntaxKind.TupleType:
      return (node as ts.TupleTypeNode).elements.map(e =>
        ts.isNamedTupleMember(e)
          ? typeNodeToMock(e.type, typeMap)
          : typeNodeToMock(e as ts.TypeNode, typeMap)
      )

    case ts.SyntaxKind.OptionalType:
      return Math.random() > 0.3
        ? typeNodeToMock((node as ts.OptionalTypeNode).type, typeMap, fieldName)
        : undefined

    case ts.SyntaxKind.FunctionType:
    case ts.SyntaxKind.ConstructorType:
      return () => undefined

    case ts.SyntaxKind.TypeReference: {
      const refNode  = node as ts.TypeReferenceNode
      if (!ts.isIdentifier(refNode.typeName)) return {}
      const typeName = refNode.typeName.text

      if (typeName === "Date")    return faker.date.recent().toISOString()
      if (typeName === "Array" && refNode.typeArguments?.length) {
        const len = faker.number.int({ min: 1, max: 4 })
        return Array.from({ length: len }, () =>
          typeNodeToMock(refNode.typeArguments![0], typeMap)
        )
      }
      if ((typeName === "Partial" || typeName === "Required" || typeName === "Readonly") && refNode.typeArguments?.length) {
        return typeNodeToMock(refNode.typeArguments[0], typeMap, fieldName)
      }
      if (typeName === "Pick" && refNode.typeArguments?.length === 2) {
        const base = typeNodeToMock(refNode.typeArguments[0], typeMap)
        if (typeof base !== "object" || base === null) return base
        const keys = extractLiteralKeys(refNode.typeArguments[1])
        return Object.fromEntries(
          keys.map(k => [k, (base as Record<string, unknown>)[k]])
        )
      }
      if (typeName === "Omit" && refNode.typeArguments?.length === 2) {
        const base = typeNodeToMock(refNode.typeArguments[0], typeMap)
        if (typeof base !== "object" || base === null) return base
        const keys = new Set(extractLiteralKeys(refNode.typeArguments[1]))
        return Object.fromEntries(
          Object.entries(base as Record<string, unknown>).filter(([k]) => !keys.has(k))
        )
      }
      if (typeName === "Promise" && refNode.typeArguments?.length) {
        return typeNodeToMock(refNode.typeArguments[0], typeMap)
      }
      if (typeName === "Record") return {}

      const entry = typeMap.get(typeName)
      if (!entry) return null

      if (entry.kind === "enum") {
        const members    = [...entry.node.members]
        const picked     = faker.helpers.arrayElement(members)
        const memberName = ts.isIdentifier(picked.name) ? picked.name.text : String(members.indexOf(picked))
        return new EnumRef(`${typeName}.${memberName}`)
      }
      if (entry.kind === "interface") return interfaceToMock(entry.node, typeMap)
      return typeNodeToMock(entry.node, typeMap, fieldName)
    }

    default:
      return null
  }
}

function resolveImportPath(importPath: string, fromFile: string): string | null {
  const base = resolve(dirname(fromFile), importPath)
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    const candidate = base + ext
    if (existsSync(candidate)) return candidate
  }
  return null
}

export function parseTypes(filePath: string): { typeMap: TypeMap; exportedNames: string[] } {
  const typeMap: TypeMap        = new Map()
  const exportedNames: string[] = []
  const visited                 = new Set<string>()
  const absMainPath             = resolve(filePath)

  function parseFile(currentPath: string): void {
    if (visited.has(currentPath)) return
    visited.add(currentPath)

    let sourceText: string
    try { sourceText = readFileSync(currentPath, "utf-8") } catch { return }

    const isMainFile = currentPath === absMainPath
    const sourceFile = ts.createSourceFile(currentPath, sourceText, ts.ScriptTarget.Latest, true)
    const isExported = (n: ts.Declaration) =>
      (ts.getCombinedModifierFlags(n) & ts.ModifierFlags.Export) !== 0

    // 상대 경로 import를 따라 먼저 파싱
    for (const stmt of sourceFile.statements) {
      if (!ts.isImportDeclaration(stmt)) continue
      const spec = stmt.moduleSpecifier
      if (!ts.isStringLiteral(spec) || !spec.text.startsWith(".")) continue

      const resolved = resolveImportPath(spec.text, currentPath)
      if (!resolved) continue
      parseFile(resolved)

      // import { Foo as Bar } 형태 alias 처리
      const bindings = stmt.importClause?.namedBindings
      if (!bindings || !ts.isNamedImports(bindings)) continue
      for (const el of bindings.elements) {
        const localName    = el.name.text
        const importedName = el.propertyName?.text ?? localName
        if (localName !== importedName) {
          const entry = typeMap.get(importedName)
          if (entry) typeMap.set(localName, entry)
        }
      }
    }

    function visit(node: ts.Node) {
      if (ts.isInterfaceDeclaration(node)) {
        typeMap.set(node.name.text, { kind: "interface", node })
        if (isMainFile && isExported(node)) exportedNames.push(node.name.text)
      } else if (ts.isTypeAliasDeclaration(node)) {
        typeMap.set(node.name.text, { kind: "type", node: node.type })
        if (isMainFile && isExported(node)) exportedNames.push(node.name.text)
      } else if (ts.isEnumDeclaration(node)) {
        typeMap.set(node.name.text, { kind: "enum", node })
        if (isMainFile && isExported(node)) exportedNames.push(node.name.text)
      }
      ts.forEachChild(node, visit)
    }
    visit(sourceFile)
  }

  parseFile(absMainPath)
  return { typeMap, exportedNames }
}

export function toMock(
  typeName: string,
  typeMap: TypeMap,
  overrides?: Record<string, unknown>,
): Record<string, unknown> {
  const entry = typeMap.get(typeName)
  if (!entry) throw new Error(`Type "${typeName}" not found`)

  let base: unknown
  if (entry.kind === "interface") base = interfaceToMock(entry.node, typeMap)
  else if (entry.kind === "enum") {
    const members    = [...entry.node.members]
    const picked     = faker.helpers.arrayElement(members)
    const memberName = ts.isIdentifier(picked.name) ? picked.name.text : String(members.indexOf(picked))
    base = new EnumRef(`${typeName}.${memberName}`)
  } else {
    base = typeNodeToMock(entry.node, typeMap)
  }

  if (base instanceof EnumRef || typeof base !== "object" || base === null) return base as unknown as Record<string, unknown>
  return overrides ? { ...(base as Record<string, unknown>), ...overrides } : base as Record<string, unknown>
}

export function toMockList(
  typeName: string,
  typeMap: TypeMap,
  count = 3,
): Record<string, unknown>[] {
  return Array.from({ length: count }, () => toMock(typeName, typeMap))
}
