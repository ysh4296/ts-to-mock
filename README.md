# ts-to-mock

TypeScript 인터페이스 파일을 읽어 타입이 달린 mock 변수를 자동으로 생성하는 CLI 도구입니다.

```bash
npm run cli -- src/types/user.ts
```

```ts
export const mockUser: User = {
  id: "lorem",
  name: "Alice Smith",
  email: "alice@example.com",
  age: 34,
  role: "editor",
  isActive: true,
  tags: ["lorem", "ipsum"],
  createdAt: "2024-03-15T09:23:41.000Z"
}
```

---

## 설치

```bash
npm install
```

---

## 사용법

```bash
npm run cli -- <ts-file> [options]
```

### 옵션

| 옵션 | 설명 | 기본값 |
|---|---|---|
| `-n, --count <n>` | 생성 개수 | `1` |
| `-o, --out <file>` | 파일로 저장 (기본: stdout) | - |
| `-s, --schema <name>` | 특정 타입 지정 (기본: 파일 내 전체) | - |

---

## 예시

### 기본 — stdout 출력

```bash
npm run cli -- src/types/user.ts
```

### 여러 개 생성

```bash
npm run cli -- src/types/user.ts -n 5
```

```ts
export const mockUsers: User[] = [
  { id: "...", name: "Alice Smith", ... },
  { id: "...", name: "Bob Jones",   ... },
  ...
]
```

### 파일로 저장

```bash
npm run cli -- src/types/user.ts -o src/mocks/mockUser.ts
```

저장 시 타입 import가 자동으로 추가됩니다:

```ts
// src/mocks/mockUser.ts (자동 생성)
import type { User } from "../types/user"

export const mockUser: User = {
  ...
}
```

### 파일에 타입이 여러 개인 경우

```ts
// src/types/order.ts
export interface OrderItem { ... }
export interface Order { ... }
```

```bash
# 전체 타입 한 번에 생성
npm run cli -- src/types/order.ts

# 특정 타입만 지정
npm run cli -- src/types/order.ts --schema Order
```

### 조합 예시

```bash
npm run cli -- src/types/order.ts --schema Order -n 3 -o src/mocks/mockOrder.ts
```

---

## 프로젝트 구조

```
src/
  cli/index.ts      CLI 진입점
  core/to-mock.ts   mock 생성 코어 (faker 기반)
  types/            예시 TypeScript 타입 파일
    user.ts
    product.ts
    order.ts
```

---

## 동작 원리

```
TypeScript 파일
  → ts-to-zod  (인터페이스 파싱)
  → Zod schema (중간 표현)
  → faker      (필드 타입에 맞는 랜덤 데이터 생성)
  → export const mockXxx: Xxx = { ... }
```

개발자는 TypeScript 인터페이스만 작성하면 됩니다.

---

## 주의사항

- `string` 필드는 기본 lorem ipsum 값이 생성됩니다. 필드명이 `name`, `email`, `city` 등 인식 가능한 이름이면 faker가 적절한 값을 생성합니다.
- `.uuid()`, `.email()` 같은 Zod refinement는 직접 Zod 스키마를 작성할 때만 적용됩니다.
- 순환 참조 타입(`interface A { self?: A }`)은 지원하지 않습니다.
