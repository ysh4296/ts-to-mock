// ---------------------------------------------------------------------------
// 실제 개발 환경에서 작성하는 TypeScript 타입 파일 예시
//
// Zod나 다른 라이브러리 없이 순수 TypeScript interface만 사용합니다.
// CLI의 `generate` 명령으로 Zod 스키마를 자동 생성할 수 있습니다.
// ---------------------------------------------------------------------------

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
