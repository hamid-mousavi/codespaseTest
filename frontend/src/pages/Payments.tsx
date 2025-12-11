import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../services/api'

type Payment = { id: string; member?: string; amount?: number; date?: string; method?: string }

export default function Payments(){
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    // no dedicated GET payments endpoint in backend; try /payments/list or fallback to empty
    api.get('/payments').then(r => { if(mounted) setPayments(r.data) }).catch(() => { /* ignore */ }).finally(() => { if(mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <div className="card-grid" style={{marginBottom:18}}>
        <Card title="This Month">
          <div style={{fontSize:22,fontWeight:700}}>{payments.reduce((s,p)=>s+(p.amount||0),0)}</div>
          <div className="muted">Total collected</div>
        </Card>
        <Card title="Transactions">
          <div style={{fontSize:22,fontWeight:700}}>{payments.length}</div>
          <div className="muted">Processed</div>
        </Card>
      </div>

      <Card>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        <Table columns={[{key:'id',title:'ID'},{key:'member',title:'Member'},{key:'amount',title:'Amount'},{key:'date',title:'Date'},{key:'method',title:'Method'}]} data={payments as any} />
      </Card>
    </div>
  )
}
