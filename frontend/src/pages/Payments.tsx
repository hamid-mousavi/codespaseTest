import React, { useEffect, useState, useCallback } from 'react'
import Card from '../components/Card'
import Table from '../components/Table'
import api from '../services/api'

type Payment = { id: string; debtItemId: string; amount: number; paidAt: string; method: string; transactionRef: string | null }

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPayments = useCallback(() => {
    setLoading(true)
    api.get('/payments') // Assuming /payments returns a list of PaymentDto
      .then(res => { setPayments(res.data) })
      .catch(err => { setError(err?.response?.data?.error || err.message) })
      .finally(() => { setLoading(false) })
  }, [])

  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0)

  const paymentColumns = [
    { key: 'id', title: 'ID' },
    { key: 'debtItemId', title: 'Debt Item ID' },
    { key: 'amount', title: 'Amount' },
    { key: 'paidAt', title: 'Date' },
    { key: 'method', title: 'Method' },
    { key: 'transactionRef', title: 'Ref' },
  ]

  return (
    <div>
      <div className="card-grid" style={{ marginBottom: 18 }}>
        <Card title="Total Collected">
          <div style={{ fontSize: 28, fontWeight: 700 }}>{totalAmount.toLocaleString()}</div>
          <div className="muted">Total amount from {payments.length} transactions</div>
        </Card>
        <Card title="Average Payment">
          <div style={{ fontSize: 28, fontWeight: 700 }}>{payments.length > 0 ? (totalAmount / payments.length).toLocaleString() : '0'}</div>
          <div className="muted">Average amount per transaction</div>
        </Card>
      </div>

      <Card title="All Payments">
        {loading && <div>Loading...</div>}
        {error && <div className="error">{error}</div>}
        {!loading && !error && (
          <Table columns={paymentColumns as any} data={payments as any} />
        )}
      </Card>
    </div>
  )
}
