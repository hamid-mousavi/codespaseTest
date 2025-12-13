import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../components/Card'
import api from '../services/api'

type MemberDetail = {
  id: string;
  fullName: string;
  nationalCode: string;
  units: { id: string; block: string; phase: string; area: number; ownershipShare: number }[];
}

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>()
  const [member, setMember] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    api.get(`/members/${id}`)
      .then(res => { if (mounted) setMember(res.data) })
      .catch(err => { if (mounted) setError(err?.response?.data?.error || err.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [id])

  if (loading) return <div>Loading member details...</div>
  if (error) return <div className="error">Error: {error}</div>
  if (!member) return <div>Member not found.</div>

  return (
    <div>
      <Card title={`Member Details: ${member.fullName}`}>
        <p><strong>ID:</strong> {member.id}</p>
        <p><strong>National Code:</strong> {member.nationalCode}</p>
      </Card>

      <Card title="Associated Units" style={{ marginTop: '16px' }}>
        {member.units && member.units.length > 0 ? (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Unit ID</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Block</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Phase</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Area (m²)</th>
                <th style={{ border: '1px solid #ccc', padding: '8px' }}>Share (%)</th>
              </tr>
            </thead>
            <tbody>
              {member.units.map(unit => (
                <tr key={unit.id}>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{unit.id}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{unit.block}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{unit.phase}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{unit.area}</td>
                  <td style={{ border: '1px solid #ccc', padding: '8px' }}>{unit.ownershipShare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No units associated with this member.</p>
        )}
      </Card>
    </div>
  )
}
