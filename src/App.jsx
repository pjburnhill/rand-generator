import { useEffect, useMemo, useState } from 'react'
import { ClipboardCopy, Dice5, RotateCcw, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'rand-generator.history'

function createSecureHex(bytes = 16) {
  const buffer = new Uint8Array(bytes)
  crypto.getRandomValues(buffer)
  return Array.from(buffer, (n) => n.toString(16).padStart(2, '0')).join('')
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
    <main style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 720, margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        <ShieldCheck size={20} /> Secure Random Generator
      </h1>

      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        <button onClick={generateValue}>
          <Dice5 size={16} /> Generate
        </button>
        <button onClick={copyValue} disabled={!value}>
          <ClipboardCopy size={16} /> {copied ? 'Copied' : 'Copy'}
        </button>
        <button onClick={clearHistory} disabled={!history.length}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <p><strong>Current:</strong> {value || 'Generate a value to begin.'}</p>
      <p><strong>Latest ID:</strong> {latestId || '—'}</p>

      <h2>Recent values</h2>
      <ul>
        {history.map((item) => (
          <li key={item.id}>
            <code>{item.value}</code> <small>({new Date(item.createdAt).toLocaleString()})</small>
          </li>
        ))}
      </ul>
    </main>
  )
}
