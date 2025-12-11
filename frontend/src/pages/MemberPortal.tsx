import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../services/api'

export default function MemberPortal(){
  const [member, setMember] = useState<any>(null)
  const [debtItems, setDebtItems] = useState<any[]>([])
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    // For demo: fetch members and pick the first as current member
    api.get('/members').then(r => {
      if(!mounted) return
      const first = r.data && r.data.length ? r.data[0] : null
      setMember(first)
      if(first) {
        api.get(`/members/${first.id}`).then(mr => { if(mounted) {
          // extract debts/payments if available on member payload
          setDebtItems(mr.data.debtItems || [])
          setPayments(mr.data.payments || [])
        }}).catch(() => {})
      }
    }).catch(() => {})
    .finally(() => { if(mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  return (
    <div>
      <div style={{display:'flex',gap:16,marginBottom:18}}>
        <Card title="My Balance">
          <div style={{fontSize:22,fontWeight:700}}>{debtItems.reduce((s,d)=>s+(d.amount||0),0) - payments.reduce((s,p)=>s+(p.amount||0),0)}</div>
          <div className="muted">You owe</div>
        </Card>
        <Card title="Next Due">
          <div className="muted">{debtItems[0]?.dueDate || '—'}</div>
        </Card>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16}}>
        <Card title="My Debts">
          <Table columns={[{key:'id',title:'ID'},{key:'description',title:'Description'},{key:'amount',title:'Amount'},{key:'dueDate',title:'Due'}]} data={debtItems as any} />
        </Card>

        <Card title="My Payments">
          <Table columns={[{key:'id',title:'ID'},{key:'amount',title:'Amount'},{key:'date',title:'Date'},{key:'method',title:'Method'}]} data={payments as any} />
        </Card>
      </div>
    </div>
  )
}
