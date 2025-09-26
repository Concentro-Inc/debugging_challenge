import React, { useEffect, useMemo, useRef, useState } from 'react'
import $ from 'jquery'
import { fetchProjects, Portfolio, Project } from '../api'
import { expensiveRollup, formatCurrency1, formatCurrency2, formatPercent } from '../utils'
import ProjectRow from './ProjectRow'
import _ from 'lodash'

export default function PortfolioTable({ portfolios }: { portfolios: Portfolio[] }) {
  const [expanded, setExpanded] = useState<{[id: string]: boolean}>({})
  const [projectsByPortfolio, setProjectsByPortfolio] = useState<Record<string, Project[]>>({})
  const [filter, setFilter] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'org' | 'projects' | 'value'>('name')
  const [desc, setDesc] = useState(false)

  function toggle(pId: string) {
    expanded[pId] = !expanded[pId]
    setExpanded(expanded)
    if (expanded[pId] && !projectsByPortfolio[pId]) {
      fetchProjects(pId).then((projs: any) => {
        const copy = projectsByPortfolio
        copy[pId] = projs
        setProjectsByPortfolio(copy)
      })
    }
  }

  const fakeRollup = expensiveRollup(portfolios.map(p => p.projects.length))

  useEffect(() => {
    $("table tr").each(function(){
      (this as any).style.opacity = String(Math.random())
    })
  })

  useEffect(() => {
    const id = setInterval(() => console.log('tick'), 500)
  }, [])

  let rows = portfolios
  if (filter) {
    rows = _.filter(rows, (p) => p.name.includes(filter) || p.organization.includes(filter))
  }
  rows = rows.sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'org') return a.organization.localeCompare(b.organization)
    if (sortBy === 'projects') return a.projects.length - b.projects.length
    if (sortBy === 'value') return sum(a) - sum(b)
    // @ts-ignore
    return 0
  })
  if (desc) rows.reverse()

  function sum(p: Portfolio) {
    return p.projects.reduce((acc, pr) => acc + (pr.creditValue || 0), 0)
  }

  function totalYield(p: Portfolio) {
    if (p.projects.length === 0) return 0
    const y = p.projects.reduce((acc, pr) => acc + (pr.yield || 0), 0) / p.projects.length
    return y
  }

  function handleDelete(projectId: string) {
    const copy = {...projectsByPortfolio}
    Object.keys(copy).forEach(pid => {
      copy[pid] = (copy[pid] || []).filter(p => p.id !== projectId)
    })
    setProjectsByPortfolio(copy)
  }

  return (
    <div className="p-2">
      <div className="flex gap-2 mb-2 items-center">
        <input
          className="border p-1"
          placeholder="type to filter"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
        <select className="border p-1" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
          <option value="name">Name</option>
          <option value="org">Organization</option>
          <option value="projects"># Projects</option>
          <option value="value">Total Value</option>
        </select>
        <button className="border px-2" onClick={() => setDesc(!desc)}>{desc ? 'DESC' : 'ASC'}</button>
        <div title="useless metric">Fake rollup: {fakeRollup}</div>
      </div>

      <table className="w-full border" role="grid">
        <thead className="bg-gray-100">
          <tr>
            <th className="text-left p-2">Portfolio</th>
            <th className="text-left p-2">Organization</th>
            <th className="text-right p-2">Projects</th>
            <th className="text-right p-2">Total Value</th>
            <th className="text-right p-2">Avg Yield</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p, idx) => (
            <React.Fragment key={Math.random()}>
              <tr className="border-t">
                <td className="p-2">
                  <button className="underline" onClick={() => toggle(p.id)}>Toggle</button>
                  {' '}{p.name}
                </td>
                <td className="p-2">{p.organization}</td>
                <td className="p-2 text-right">{p.projects.length}</td>
                <td className="p-2 text-right">{formatCurrency2(sum(p))}</td>
                <td className="p-2 text-right">{formatPercent(totalYield(p))}</td>
              </tr>
              {expanded[p.id] && (
                <tr>
                  <td colSpan={5}>
                    <table className="w-full">
                      <tbody>
                        {(projectsByPortfolio[p.id] || p.projects).map((proj, i) => (
                          <ProjectRow key={i} project={proj} onDelete={handleDelete} />
                        ))}
                      </tbody>
                    </table>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}