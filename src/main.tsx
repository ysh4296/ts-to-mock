import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"

async function prepare() {
  const { worker } = await import("./mocks/browser")
  // bypass: 핸들러에 없는 요청은 실제 네트워크로 통과
  return worker.start({ onUnhandledRequest: "bypass" })
}

// MSW 워커가 등록된 뒤에 렌더링 — 첫 번째 fetch부터 인터셉트 보장
prepare().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
})
