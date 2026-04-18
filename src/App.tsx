import { useState } from "react"
import { SCHEMAS }         from "./models/index"
import { SCHEMA_SOURCE }   from "./models/source"
import { toOpenAPI }       from "./core/to-openapi"
import { toMock }          from "./core/to-mock"
import { zodToTypeScript } from "./core/to-typescript"

// ── pipeline stage metadata ──────────────────────────────────────────────────
const STAGES = [
  {
    key:         "source",
    label:       "Zod Schema",
    color:       "#3b82f6",
    description: "Developer defines the schema using Zod's builder API. No separate TypeScript interface needed.",
  },
  {
    key:         "typescript",
    label:       "TypeScript Type",
    color:       "#8b5cf6",
    description: "z.infer<typeof Schema> derives the TypeScript type automatically. Shown here as a human-readable interface.",
  },
  {
    key:         "openapi",
    label:       "OpenAPI 3.0",
    color:       "#f59e0b",
    description: "The Zod schema is converted to a standard OpenAPI 3.0 document — compatible with Swagger UI, Postman, and API gateways.",
  },
  {
    key:         "mock",
    label:       "Mock Data",
    color:       "#10b981",
    description: "Realistic mock objects generated using @faker-js/faker. Click Regenerate for a fresh sample.",
  },
] as const

type StageKey = (typeof STAGES)[number]["key"]

// ── MSW endpoint registry ────────────────────────────────────────────────────
// Fixed UUID used as :id in demo fetch calls — MSW ignores the actual value.
const DEMO_ID = "550e8400-e29b-41d4-a716-446655440000"

type Endpoint = {
  method: string
  display: string   // path shown in UI  (e.g. /api/users/:id)
  url:     string   // actual fetch URL  (e.g. /api/users/550e8400-...)
  desc:    string
}

const ENDPOINTS: Endpoint[] = Object.keys(SCHEMAS).flatMap(name => {
  const plural = name.toLowerCase() + "s"
  return [
    {
      method:  "GET",
      display: `/api/${plural}`,
      url:     `/api/${plural}`,
      desc:    `Returns 5 mock ${name} objects`,
    },
    {
      method:  "GET",
      display: `/api/${plural}/:id`,
      url:     `/api/${plural}/${DEMO_ID}`,
      desc:    `Returns a single mock ${name}`,
    },
  ]
})

// ── sub-components ───────────────────────────────────────────────────────────
function CodeBlock({ content }: { content: string }) {
  return (
    <pre className="code-block">
      <code>{content}</code>
    </pre>
  )
}

function PipelineFlow() {
  return (
    <div className="pipeline-flow">
      {STAGES.map((stage, i) => (
        <span key={stage.key} className="flow-item">
          <span className="flow-dot" style={{ background: stage.color }} />
          <span className="flow-label">{stage.label}</span>
          {i < STAGES.length - 1 && <span className="flow-arrow">→</span>}
        </span>
      ))}
    </div>
  )
}

function EndpointCard({ ep }: { ep: Endpoint }) {
  const [loading,  setLoading]  = useState(false)
  const [response, setResponse] = useState<string | null>(null)

  async function handleFetch() {
    setLoading(true)
    try {
      const res  = await fetch(ep.url)
      const data = await res.json() as unknown
      setResponse(JSON.stringify(data, null, 2))
    } catch (e) {
      setResponse(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="endpoint-card">
      <div className="endpoint-header">
        <span className="method-badge">GET</span>
        <code className="endpoint-path">{ep.display}</code>
        <button className="btn-fetch" onClick={handleFetch} disabled={loading}>
          {loading ? "…" : response ? "↺" : "Fetch →"}
        </button>
      </div>
      <p className="endpoint-desc">{ep.desc}</p>
      {response !== null && (
        <pre className="response-block"><code>{response}</code></pre>
      )}
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [selected, setSelected] = useState("User")
  const [mockJson, setMockJson] = useState<string>(
    () => JSON.stringify(toMock(SCHEMAS["User"]), null, 2)
  )

  const schema = SCHEMAS[selected]

  function handleSelect(name: string) {
    setSelected(name)
    setMockJson(JSON.stringify(toMock(SCHEMAS[name]), null, 2))
  }

  function handleRegenerate() {
    setMockJson(JSON.stringify(toMock(schema), null, 2))
  }

  const stageContent: Record<StageKey, string> = {
    source:     SCHEMA_SOURCE[selected] ?? "",
    typescript: zodToTypeScript(schema, selected),
    openapi:    JSON.stringify(toOpenAPI(schema, selected), null, 2),
    mock:       mockJson,
  }

  return (
    <div className="app">
      {/* ── header ─────────────────────────────────────────────────────── */}
      <header className="app-header">
        <div>
          <h1 className="app-title">ts-to-mock</h1>
          <p className="app-subtitle">Zod → TypeScript Type → OpenAPI 3.0 → Mock Data → MSW</p>
        </div>
        <div className="controls">
          <div className="tab-group">
            {Object.keys(SCHEMAS).map(name => (
              <button
                key={name}
                className={`tab${selected === name ? " tab-active" : ""}`}
                onClick={() => handleSelect(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <button className="btn-regenerate" onClick={handleRegenerate}>
            ↺ Regenerate Mock
          </button>
        </div>
      </header>

      {/* ── pipeline flow indicator ─────────────────────────────────────── */}
      <PipelineFlow />

      {/* ── 4-stage pipeline ────────────────────────────────────────────── */}
      <main className="pipeline">
        {STAGES.map((stage, i) => (
          <div key={stage.key} className="stage">
            <div className="stage-header" style={{ background: stage.color }}>
              <span className="stage-number">{i + 1}</span>
              <span className="stage-label">{stage.label}</span>
            </div>
            <p className="stage-description">{stage.description}</p>
            <CodeBlock content={stageContent[stage.key]} />
          </div>
        ))}
      </main>

      {/* ── MSW mock API section ─────────────────────────────────────────── */}
      <section className="api-section">
        <div className="api-section-header">
          <h2 className="api-section-title">Mock API</h2>
          <span className="msw-badge">MSW</span>
          <span className="api-section-sub">
            실제 서버 없이 Service Worker가 요청을 인터셉트합니다.
            Fetch 버튼을 누르면 브라우저 DevTools Network 탭에서 확인할 수 있습니다.
          </span>
        </div>
        <div className="endpoint-grid">
          {ENDPOINTS.map(ep => (
            <EndpointCard key={ep.display} ep={ep} />
          ))}
        </div>
      </section>
    </div>
  )
}
