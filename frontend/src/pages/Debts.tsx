import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import SimpleChart from '../components/SimpleChart'
import api from '../services/api'

type DebtSummary = { totalDebt: number; totalPaid: number; debtors: number }
type DebtItem = { id: string; unit?: string; amount?: number; dueDate?: string; paid?: boolean }

export default function Debts(){
  const [summary, setSummary] = useState<DebtSummary | null>(null)
  const [debtItems, setDebtItems] = useState<DebtItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      api.get('/reports/debt-summary').catch(() => null),
      // try to fetch debt items endpoint if exists
      api.get('/debtitems').catch(() => null)
    ]).then(([sRes, itemsRes]) => {
      if(!mounted) return
      if(sRes && sRes.data) setSummary(sRes.data)
      if(itemsRes && itemsRes.data) setDebtItems(itemsRes.data)
    }).catch(err => {
      if(mounted) setError(err?.response?.data?.error || err.message)
    }).finally(() => { if(mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  const trend = [30,40,35,50,45,60,55]

  return (
    <div>
      <div className="card-grid">
        <Card title="Total Outstanding">
          <div style={{fontSize:22,fontWeight:700}}>{summary ? `${summary.totalDebt}` : '—'}</div>
          <div className="muted">Debtors: {summary ? summary.debtors : '—'}</div>
        </Card>
        <Card title="Trend">
          <SimpleChart values={trend} height={60} />
        </Card>
      </div>

      <Card>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <Table columns={[{key:'id',title:'ID'},{key:'unit',title:'Unit'},{key:'amount',title:'Amount'},{key:'dueDate',title:'Due'}]} data={debtItems as any} />
        )}
      </Card>
    </div>
  )
}
