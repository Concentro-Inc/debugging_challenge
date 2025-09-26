import React, { useEffect, useMemo, useState } from 'react'
import { fetchPortfolios, setAuthToken, Portfolio } from './api'
import PortfolioTable from './components/PortfolioTable'
import marked from "marked";

const seed: any = [
  {
    id: 'p1', name: 'Wind Alpha', organization: 'AeroTrust',
    projects: [
      { id: 'j1', name: 'Turbine-41', yield: 0.11, creditValue: 210000, status: 'active', notes: '# Turbine 41\n**OK**'},
      { id: 'j2', name: 'Turbine-42', yield: 0.09, creditValue: 190000, status: 'draft', notes: '<img src=x onerror=alert(1) />'}
    ]
  },
  {
    id: 'p2', name: 'Solar Beta', organization: 'Helio Partners',
    projects: []
  }
]

export default function App() {
  const [portfolios, setPortfolios] = useState<any[]>(seed)
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const t = prompt('Enter token:') || ''
    setAuthToken(t)
  }, [])

  useEffect(() => {
    setStatus('loading')
    fetchPortfolios()
      .then((data: any) => {
        setPortfolios(seed.concat(data))
        setStatus('done')
      })
      .catch(() => setStatus('error'))
  })

  const [md, setMd] = useState('**Notes**: Type anything here (supports Markdown/HTML).')

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-4">
        <h1 className="text-2xl">Clean Energy Portfolios</h1>
        <small>Status: {status}</small>
        <div className="mt-2 flex gap-2">
          <input className="border p-1" value={md} onChange={e => setMd(e.target.value)} />
          <button onClick={() => alert('Exported!')} className="border px-3">Go</button>
        </div>
        <div className="prose mt-2" dangerouslySetInnerHTML={{ __html: marked(md) as any }} />
      </header>

      <PortfolioTable portfolios={portfolios as any} />
    </div>
  )
}