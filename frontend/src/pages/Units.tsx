import React, { useEffect, useState, useCallback } from 'react'
import Card from '../components/Card'
import ModalForm from '../components/ModalForm'
import Table from '../components/Table'
import api from '../services/api'

type Unit = { id: string; memberId: string; block: string; phase: string; area: number; ownershipShare: number }

const unitFields = [
  { name: 'memberId', label: 'Member ID (Owner)', type: 'text' as const, required: true },
  { name: 'block', label: 'Block', type: 'text' as const, required: true },
  { name: 'phase', label: 'Phase', type: 'text' as const, required: true },
  { name: 'area', label: 'Area (m²)', type: 'number' as const, required: true },
  { name: 'ownershipShare', label: 'Ownership Share (%)', type: 'number' as const, required: true },
]

export default function Units() {
  const [units, setUnits] = useState<Unit[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentUnit, setCurrentUnit] = useState<Unit | null>(null)

  const fetchUnits = useCallback(() => {
    setLoading(true)
    api.get('/units')
      .then(res => { setUnits(res.data) })
      .catch(err => { setError(err?.response?.data?.error || err.message) })
      .finally(() => { setLoading(false) })
  }, [])

  useEffect(() => {
    fetchUnits()
  }, [fetchUnits])

  const handleCreate = (data: any) => api.post('/units', data)
  const handleUpdate = (data: any) => api.put(`/units/${currentUnit?.id}`, data)
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await api.delete(`/units/${id}`)
        fetchUnits()
      } catch (err: any) {
        alert(err?.response?.data?.error || err.message || 'Failed to delete unit.')
      }
    }
  }

  const openCreateModal = () => {
    setCurrentUnit(null)
    setIsModalOpen(true)
  }

  const openEditModal = (unit: Unit) => {
    setCurrentUnit(unit)
    setIsModalOpen(true)
  }

  const unitColumns = [
    { key: 'id', title: 'ID' },
    { key: 'memberId', title: 'Owner ID' },
    { key: 'block', title: 'Block' },
    { key: 'phase', title: 'Phase' },
    { key: 'area', title: 'Area (m²)' },
    { key: 'ownershipShare', title: 'Share (%)' },
    {
      key: 'actions', title: 'Actions', render: (u: Unit) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => openEditModal(u)} style={{ background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer', padding: 0 }}>Edit</button>
          <button onClick={() => handleDelete(u.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0 }}>Delete</button>
        </div>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Units Management</h2>
        <button onClick={openCreateModal} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Add New Unit
        </button>
      </div>

      <Card>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <Table columns={unitColumns as any} data={units as any} />
        )}
      </Card>

      <ModalForm
        title={currentUnit ? 'Edit Unit' : 'Create New Unit'}
        fields={unitFields}
        initialData={currentUnit}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchUnits() }}
        onSubmit={currentUnit ? handleUpdate : handleCreate}
      />
    </div>
  )
}
