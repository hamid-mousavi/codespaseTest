import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import api from '../services/api'

type Unit = { id: string; memberId: string; block: string; phase: string; area: number; ownershipShare: number }

export default function Units(){
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get('/units')
      .then(res => { if(mounted) setUnits(res.data) })
      .catch(err => { if(mounted) setError(err?.response?.data?.error || err.message) })
      .finally(() => { if(mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <div className="card-grid">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && units.map(u => (
          <Card key={u.id} title={`Unit ${u.block}-${u.phase}`}>
            <div style={{fontWeight:700}}>Block: {u.block} / Phase: {u.phase}</div>
            <div className="muted">Area: {u.area} m² | Share: {u.ownershipShare}%</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
