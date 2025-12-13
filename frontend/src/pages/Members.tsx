import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Table from '../components/Table'
import ModalForm from '../components/ModalForm'
import api from '../services/api'

type Member = { id: string; fullName: string; nationalCode: string }

const memberFields = [
  { name: 'fullName', label: 'Full Name', type: 'text' as const, required: true },
  { name: 'nationalCode', label: 'National Code', type: 'text' as const, required: true },
]

export default function Members() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentMember, setCurrentMember] = useState<Member | null>(null)

  const fetchMembers = useCallback(() => {
    setLoading(true)
    api.get('/members')
      .then(res => { setMembers(res.data) })
      .catch(err => { setError(err?.response?.data?.error || err.message) })
      .finally(() => { setLoading(false) })
  }, [])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  const handleCreate = (data: any) => api.post('/members', data)
  const handleUpdate = (data: any) => api.put(`/members/${currentMember?.id}`, data)
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await api.delete(`/members/${id}`)
        fetchMembers()
      } catch (err: any) {
        alert(err?.response?.data?.error || err.message || 'Failed to delete member.')
      }
    }
  }

  const openCreateModal = () => {
    setCurrentMember(null)
    setIsModalOpen(true)
  }

  const openEditModal = (member: Member) => {
    setCurrentMember(member)
    setIsModalOpen(true)
  }

  const memberColumns = [
    { key: 'id', title: 'ID' },
    { key: 'fullName', title: 'Name' },
    { key: 'nationalCode', title: 'National Code' },
    {
      key: 'actions', title: 'Actions', render: (m: Member) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to={`/members/${m.id}`} style={{ color: '#007bff', textDecoration: 'none' }}>View</Link>
          <button onClick={() => openEditModal(m)} style={{ background: 'none', border: 'none', color: '#ffc107', cursor: 'pointer', padding: 0 }}>Edit</button>
          <button onClick={() => handleDelete(m.id)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', padding: 0 }}>Delete</button>
        </div>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2>Members Management</h2>
        <button onClick={openCreateModal} style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          + Add New Member
        </button>
      </div>

      <Card>
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <Table columns={memberColumns as any} data={members as any} />
        )}
      </Card>

      <ModalForm
        title={currentMember ? 'Edit Member' : 'Create New Member'}
        fields={memberFields}
        initialData={currentMember}
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchMembers() }}
        onSubmit={currentMember ? handleUpdate : handleCreate}
      />
    </div>
  )
}
