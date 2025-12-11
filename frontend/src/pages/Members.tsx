import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../services/api'

type Member = { id: string | number; fullName?: string; unit?: string; phone?: string }

export default function Members(){
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/members')
      .then(res => { if(mounted) setMembers(res.data) })
      .catch(err => { if(mounted) setError(err?.response?.data?.error || err.message) })
      .finally(() => { if(mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <div style={{display:'flex',gap:16,marginBottom:18}}>
        <Card title="Members">
          <div style={{fontSize:28,fontWeight:700}}>{loading ? '...' : members.length}</div>
          <div className="muted">Active members</div>
        </Card>
        <Card title="Contact">
          <div className="muted">Click a member to see details</div>
        </Card>
      </div>

      <Card>
        {error && <div className="error">{error}</div>}
        <Table columns={[{key:'id',title:'ID'},{key:'fullName',title:'Name'},{key:'unit',title:'Unit'},{key:'phone',title:'Phone'}]} data={members as any} />
      </Card>
    </div>
  )
}
