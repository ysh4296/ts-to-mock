# ts-to-mock

**개발자는 TypeScript 인터페이스만 작성합니다. 이후 모든 과정은 CLI 또는 자동으로 처리됩니다.**

```
 개발자 작성         ◀ 여기까지만
┌──────────────┐
│ TypeScript   │
│ interface    │
└──────┬───────┘
       │  CLI: generate / from-ts (ts-to-zod)
       ▼  ─────────────────────────────────── 이후 자동
┌──────────────┐
│ Zod Schema   │  → TypeScript Type (z.infer)
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ OpenAPI 3.0  │  → Swagger UI, Postman, API Gateway 연동 가능
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Mock Data    │  → faker로 사실적인 목 데이터 생성
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ MSW          │  → 브라우저에서 실제 HTTP 요청 인터셉트 (서버 불필요)
└──────────────┘
```

각 단계는 순수 함수(pure function)로 구현되어 있으며, 독립적으로 사용하거나 테스트할 수 있습니다.

---

## 빠른 시작

```bash
npm install
npm run dev        # React 데모 앱 실행 (http://localhost:5173)
```

---

## TypeScript 파일에서 바로 시작하기 (실제 개발 환경 연동)

Zod를 모르거나 기존 TypeScript 인터페이스가 이미 있는 경우,
**순수 TypeScript 파일만 작성**하면 CLI가 나머지를 자동으로 처리합니다.

### 1단계 — TypeScript 타입 파일 작성

```ts
// src/types/user.ts  (Zod 없이 순수 TypeScript만 사용)
export interface User {
  id: string
  name: string
  email: string
  age: number
  role: "admin" | "editor" | "viewer"
  isActive: boolean
  tags: string[]
  createdAt: string
}
```

### 2단계 — 바로 파이프라인 실행

```bash
# TypeScript 파일 → 4단계 파이프라인 전체 출력
npm run cli -- from-ts src/types/user.ts pipeline

# 목 데이터 생성 (5건)
npm run cli -- from-ts src/types/user.ts mock -n 5

# OpenAPI 3.0 문서 파일로 저장
npm run cli -- from-ts src/types/user.ts openapi -o user-api.json

# 파일에 인터페이스가 여러 개일 때 (OrderItem + Order)
npm run cli -- from-ts src/types/order.ts pipeline --schema Order
npm run cli -- from-ts src/types/order.ts mock --schema Order -n 3 -o orders.json
```

### 2-1단계 (선택) — Zod 스키마 파일로 내보내서 정제

```bash
# TypeScript → Zod 스키마 파일 생성
npm run cli -- generate src/types/user.ts -o src/models/user.ts
```

생성된 파일에서 원하는 필드에 `.uuid()`, `.email()`, `.min()` 등 정제를 추가한 뒤
`src/models/index.ts`의 SCHEMAS 레지스트리에 등록하면
React 데모와 MSW 핸들러에 자동으로 반영됩니다.

```ts
// 생성된 src/models/user.ts 를 손으로 정제한 예시
export const UserSchema = z.object({
  id:        z.string().uuid(),      // ← 추가
  email:     z.string().email(),     // ← 추가
  age:       z.number().int().min(18).max(65),  // ← 추가
  name:      z.string(),
  role:      z.enum(["admin", "editor", "viewer"]),
  isActive:  z.boolean(),
  tags:      z.array(z.string()),
  createdAt: z.string().datetime(),  // ← 추가
})
```

### 왜 `id`가 UUID 형식이 아닌가요?

TypeScript의 `string` 타입에는 format 정보가 없습니다.
`ts-to-zod`는 `string` → `z.string()` 으로만 변환할 수 있으며,
`.uuid()` / `.email()` 같은 refinement는 생성 후 수동으로 추가해야 합니다.

```
TypeScript  →  변환 결과         →  수동 정제 추가
id: string  →  z.string()        →  z.string().uuid()
email: string → z.string()      →  z.string().email()
age: number  →  z.number()       →  z.number().int().min(18).max(65)
```

---

## CLI 사용법

모든 파이프라인 과정을 CLI로 실행할 수 있습니다.

### 기본 형태

```bash
npm run cli -- <command> [options]
```

### 명령어 목록

#### `list` — 사용 가능한 스키마 조회

```bash
npm run cli -- list
```

출력 예:
```
Available schemas:

  • User
  • Product
  • Order
```

---

#### `pipeline` — 4단계 파이프라인 전체 출력

```bash
npm run cli -- pipeline User
npm run cli -- pipeline Product
npm run cli -- pipeline Order
```

출력 구조:
```
  ts-to-mock  ·  User pipeline

  TypeScript Definition → Internal Type → OpenAPI 3.0 → Mock Data

[1] Zod Schema Definition
────────────────────────────────────────────────────────────────
import { z } from "zod"
export const UserSchema = z.object({ ... })

[2] Derived TypeScript Type
────────────────────────────────────────────────────────────────
// Equivalent to: type User = z.infer<typeof UserSchema>
interface User { ... }

[3] OpenAPI 3.0 Document
────────────────────────────────────────────────────────────────
{ "openapi": "3.0.0", ... }

[4] Mock Data
────────────────────────────────────────────────────────────────
{ "id": "uuid...", "name": "Alice Smith", ... }
```

---

#### `openapi` — OpenAPI 3.0 문서 생성

```bash
# stdout 출력
npm run cli -- openapi User

# 파일로 저장
npm run cli -- openapi User -o ./user-api.json
npm run cli -- openapi Product -o ./product-api.json
npm run cli -- openapi Order -o ./order-api.json
```

출력 예시 (일부):
```json
{
  "openapi": "3.0.0",
  "info": { "title": "User API", "version": "1.0.0" },
  "paths": {
    "/users": { "get": { "summary": "List Users", ... } },
    "/users/{id}": { "get": { "summary": "Get User by id", ... } }
  },
  "components": {
    "schemas": {
      "User": {
        "type": "object",
        "properties": {
          "id":    { "type": "string", "format": "uuid" },
          "email": { "type": "string", "format": "email" },
          "role":  { "type": "string", "enum": ["admin", "editor", "viewer"] }
        }
      }
    }
  }
}
```

---

#### `mock` — 목 데이터 생성

```bash
# 단건 생성
npm run cli -- mock User

# 여러 건 생성
npm run cli -- mock User -n 5
npm run cli -- mock Order -n 3

# 파일로 저장
npm run cli -- mock Product -n 10 -o ./products.json
```

출력 예시:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Alice Smith",
  "email": "alice.smith@example.com",
  "age": 34,
  "role": "editor",
  "isActive": true,
  "tags": ["lorem", "ipsum"],
  "createdAt": "2024-03-15T09:23:41.000Z"
}
```

---

## MSW (Mock Service Worker)

React 데모 앱에 MSW가 내장되어 있어 **별도 서버 없이** 실제 HTTP 요청을 인터셉트합니다.

### 자동 생성되는 엔드포인트

`SCHEMAS` 레지스트리에 등록된 모든 스키마에 대해 자동으로 2개의 엔드포인트가 생성됩니다.

| Method | Path | 응답 |
|---|---|---|
| GET | `/api/users` | User 목 5건 |
| GET | `/api/users/:id` | User 목 1건 (id 보존) |
| GET | `/api/products` | Product 목 5건 |
| GET | `/api/products/:id` | Product 목 1건 |
| GET | `/api/orders` | Order 목 5건 |
| GET | `/api/orders/:id` | Order 목 1건 |

### 핸들러 구조

```ts
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw"
import { SCHEMAS } from "../models/index"
import { toMock, toMockList } from "../core/to-mock"

// SCHEMAS에 새 스키마를 추가하면 핸들러가 자동으로 생성됩니다
export const handlers = Object.keys(SCHEMAS).flatMap(name => {
  const base = `/api/${name.toLowerCase()}s`
  return [
    http.get(base,         () => HttpResponse.json(toMockList(SCHEMAS[name], 5))),
    http.get(`${base}/:id`, ({ params }) =>
      HttpResponse.json(toMock(SCHEMAS[name], { id: params.id as string }))
    ),
  ]
})
```

### 실제 사용 예시

React 앱 내에서 일반 fetch를 호출하면 MSW가 인터셉트합니다:

```ts
// 컴포넌트 어디서든 사용 가능 — 서버 불필요
const res   = await fetch("/api/users")
const users = await res.json()  // → User[] 목 데이터
```

### 새 핸들러 추가 (커스텀)

```ts
// src/mocks/handlers.ts 에 추가
http.post("/api/users", async ({ request }) => {
  const body = await request.json()
  return HttpResponse.json({ ...toMock(UserSchema), ...body }, { status: 201 })
}),
```

### DevTools 확인

`npm run dev` 실행 후 브라우저 DevTools → Network 탭에서
`[MSW] Mocking enabled` 메시지와 함께 인터셉트된 요청을 확인할 수 있습니다.

---

## 새 모델 추가하는 방법

### 방법 A — TypeScript만 작성 후 CLI로 즉시 실행 (가장 빠름)

```ts
// src/types/my-model.ts  ← 여기만 작성
export interface MyModel {
  id: string
  name: string
  status: "active" | "inactive"
  count: number
  createdAt: string
}
```

```bash
# 바로 파이프라인 실행 (파일 생성 없음)
npm run cli -- from-ts src/types/my-model.ts pipeline
npm run cli -- from-ts src/types/my-model.ts mock -n 5
npm run cli -- from-ts src/types/my-model.ts openapi -o my-model-api.json
```

### 방법 B — Zod 파일로 정제 후 레지스트리 등록 (React 데모 + MSW 반영)

```bash
# 1. Zod 스키마 파일 자동 생성
npm run cli -- generate src/types/my-model.ts -o src/models/my-model.ts
```

생성된 `src/models/my-model.ts` 에 refinement 추가:

```ts
// 자동 생성됨 → 필요한 정제만 추가
export const MyModelSchema = z.object({
  id:        z.string().uuid(),        // ← .uuid() 추가
  name:      z.string().min(1),        // ← .min(1) 추가
  status:    z.enum(["active", "inactive"]),
  count:     z.number().int().min(0),  // ← 조건 추가
  createdAt: z.string().datetime(),    // ← .datetime() 추가
})

export type MyModel = z.infer<typeof MyModelSchema>
```

```ts
// src/models/index.ts 에 등록 → React 데모 + MSW 자동 반영
export const SCHEMAS: Record<string, z.AnyZodObject> = {
  User:    UserSchema,
  Product: ProductSchema,
  Order:   OrderSchema,
  MyModel: MyModelSchema,  // ← 추가
}
```

---

## 핵심 API

### `toOpenAPI(schema, name)` → OpenAPI 3.0 문서

```ts
import { UserSchema } from "./models/user"
import { toOpenAPI }  from "./core/to-openapi"

const doc = toOpenAPI(UserSchema, "User")
// → 완전한 OpenAPI 3.0 JSON 객체
```

### `toMock(schema, overrides?)` → 목 객체

```ts
import { toMock } from "./core/to-mock"

const user = toMock(UserSchema)
// → { id: "uuid...", name: "Alice Smith", ... }

const admin = toMock(UserSchema, { role: "admin", name: "Bob" })
// → { ..., role: "admin", name: "Bob" }
```

### `toMockList(schema, count)` → 목 객체 배열

```ts
import { toMockList } from "./core/to-mock"

const users = toMockList(UserSchema, 5)
// → [{ ... }, { ... }, { ... }, { ... }, { ... }]
```

### `zodToTypeScript(schema, name)` → TypeScript interface 문자열

```ts
import { zodToTypeScript } from "./core/to-typescript"

const ts = zodToTypeScript(UserSchema, "User")
// → "interface User { id: string; name: string; ... }"
```

---

## 파일 구조

```
ts-to-mock/
├── src/
│   ├── core/
│   │   ├── to-openapi.ts      # Zod → OpenAPI 3.0 변환기
│   │   ├── to-mock.ts         # Zod → mock data 생성기 (faker 사용)
│   │   └── to-typescript.ts   # Zod → TypeScript interface 문자열 생성기
│   ├── models/
│   │   ├── index.ts           # 스키마 레지스트리 (CLI + 데모 공용)
│   │   ├── source.ts          # 소스코드 문자열 (데모 표시용)
│   │   ├── user.ts            # User Zod 스키마
│   │   ├── product.ts         # Product Zod 스키마
│   │   └── order.ts           # Order Zod 스키마
│   ├── types/                 ← 여기에 TypeScript 파일만 작성하면 됩니다
│   │   ├── user.ts            # 순수 TypeScript interface (Zod 불필요)
│   │   ├── product.ts
│   │   └── order.ts
│   ├── mocks/
│   │   ├── handlers.ts        # MSW 요청 핸들러 (SCHEMAS에서 자동 생성)
│   │   └── browser.ts         # MSW 브라우저 워커 설정
│   ├── cli/
│   │   └── index.ts           # CLI 진입점 (commander + ts-to-zod 연동)
│   ├── App.tsx                # React 파이프라인 시각화 데모
│   ├── main.tsx               # MSW 워커 초기화 후 렌더링
│   └── index.css
├── public/
│   └── mockServiceWorker.js   # MSW Service Worker (자동 생성)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 파이프라인 내부 구조

개발자는 TypeScript 인터페이스 작성만 담당하고, 이후 모든 단계는 CLI 또는 자동으로 처리됩니다.

```
┌─────────────────────────────────────────────────────────────┐
│  개발자가 작성 (여기까지만)                                    │
│                                                             │
│  // src/types/user.ts                                       │
│  export interface User {                                    │
│    id: string                                               │
│    role: "admin" | "editor" | "viewer"                      │
│    ...                                                      │
│  }                                                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ CLI: npm run cli -- generate / from-ts
                       │ ts-to-zod 라이브러리가 자동 변환
         ┌─────────────▼──────────────┐
         │  Zod Schema                │  z.object({ role: z.enum([...]) })
         │  (자동 생성 또는 정제 후    │
         │   src/models/ 에 저장)     │
         └─────────────┬──────────────┘
                       │ CLI 자동 처리 / 앱 시작 시 자동 처리
         ┌─────────────▼──────────────┐
         │  to-typescript.ts          │  → interface User { ... }
         └─────────────┬──────────────┘
         ┌─────────────▼──────────────┐
         │  to-openapi.ts             │  → OpenAPI 3.0 JSON
         └─────────────┬──────────────┘
         ┌─────────────▼──────────────┐
         │  to-mock.ts + faker        │  → { id: "uuid", name: "Alice" }
         └─────────────┬──────────────┘
         ┌─────────────▼──────────────┐
         │  MSW handlers              │  → GET /api/users 자동 인터셉트
         └─────────────────────────────┘
```

각 변환기는 Zod의 `_def` 내부 구조를 직접 순회합니다. `zod-to-openapi` 같은 별도 라이브러리를 사용하지 않아 변환 로직이 소스코드에 완전히 노출됩니다.

---

## 트레이드오프

### Zod 선택 이유
- 스키마 정의와 TypeScript 타입을 하나로 통합 (`z.infer<>`)
- `.describe()` 메서드가 OpenAPI `description` 필드로 직접 매핑
- 런타임 유효성 검사도 동일한 스키마로 수행 가능
- 팀 내 이미 사용하는 경우 학습 비용 없음

### `_def` 직접 순회 vs `zod-to-openapi` 라이브러리
`_def`는 Zod 생태계 전반(trpc, zod-to-openapi 등)에서 사용하는 사실상 안정적인 내부 API입니다.
`zod-to-openapi`를 사용하면 더 정확하지만, 변환 로직이 블랙박스가 되어 데모 설명이 어려워집니다.
**프로토타입 목적에서는 로직의 가시성이 더 중요하다고 판단했습니다.**

### faker.js 사용
목 데이터에 `@faker-js/faker`를 사용해 사실적인 값(이름, 이메일, 도시 등)을 생성합니다.
의존성이 추가되지만 생성된 데이터가 프레젠테이션에서 훨씬 설득력 있게 보입니다.

### 단일 Vite 프로젝트 구조
Core 로직과 React 데모를 하나의 Vite 프로젝트 내 폴더로 분리했습니다.
npm 패키지로 배포하려면 별도 패키지로 분리가 필요하지만, 데모 목적에서는 `npm install && npm run dev` 한 줄이 더 중요합니다.
