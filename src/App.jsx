import { useEffect, useMemo, useState } from 'react'
import { ClipboardCopy, Dice5, RotateCcw, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'rand-generator.history'

function createSecureHex(bytes = 16) {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return Array.from(buffer, (n) => n.toString(16).padStart(2, '0')).join('')
}

function ActionButton({ children, ...props }) {
  return (
    <button
      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
      {...props}
    >
      {children}
    </button>
  )
}

export default function App() {
  const [value, setValue] = useState('')
  const [history, setHistory] = useState([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) return

    try {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        setHistory(parsed)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
  }, [history])

  const latestId = useMemo(() => history[0]?.id ?? null, [history])

  const generateValue = () => {
    const next = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      value: createSecureHex(16),
    }

    setValue(next.value)
    setHistory((prev) => [next, ...prev].slice(0, 10))
    setCopied(false)
  }

  const copyValue = async () => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopied(true)
  }

  const clearHistory = () => {
    setHistory([])
    setValue('')
    setCopied(false)
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl p-4 sm:p-8">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="mb-6 flex items-center gap-2 text-2xl font-bold text-slate-900 sm:text-3xl">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          Secure Random Generator
        </h1>

        <div className="mb-6 flex flex-wrap gap-3">
          <ActionButton onClick={generateValue}>
            <Dice5 className="h-4 w-4" /> Generate
          </ActionButton>
          <ActionButton onClick={copyValue} disabled={!value}>
            <ClipboardCopy className="h-4 w-4" /> {copied ? 'Copied' : 'Copy'}
          </ActionButton>
          <ActionButton onClick={clearHistory} disabled={!history.length}>
            <RotateCcw className="h-4 w-4" /> Reset
          </ActionButton>
        </div>

        <div className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm sm:text-base">
          <p>
            <span className="font-semibold text-slate-700">Current:</span>{' '}
            <code className="break-all rounded bg-slate-200/70 px-1.5 py-0.5 text-slate-800">{value || 'Generate a value to begin.'}</code>
          </p>
          <p>
            <span className="font-semibold text-slate-700">Latest ID:</span>{' '}
            <span className="break-all text-slate-600">{latestId || '—'}</span>
          </p>
        </div>

        <h2 className="mb-3 mt-8 text-lg font-semibold text-slate-900">Recent values</h2>
        <ul className="space-y-2">
          {history.map((item) => (
            <li key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <code className="break-all text-slate-900">{item.value}</code>
              <small className="mt-1 block text-slate-500">{new Date(item.createdAt).toLocaleString()}</small>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
