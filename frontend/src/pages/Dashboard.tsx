import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import SimpleChart from '../components/SimpleChart'
import Table from '../components/Table'
import api from '../services/api'

type DashboardSummary = {
  totalMembers: number;
  totalUnits: number;
  totalDebt: number;
  totalPaid: number;
}

type RecentPayment = {
  id: string;
  amount: number;
  paidAt: string;
  method: string;
  memberId: string; // Assuming we can link to member
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [recentPayments, setRecentPayments] = useState<RecentPayment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    Promise.all([
      api.get('/reports/dashboard-summary').catch(() => null), // Assuming a new API endpoint for summary
      api.get('/payments?pageSize=5').catch(() => null) // Assuming payments API exists
    ]).then(([summaryRes, paymentsRes]) => {
      if (!mounted) return
      if (summaryRes && summaryRes.data) setSummary(summaryRes.data)
      if (paymentsRes && paymentsRes.data) setRecentPayments(paymentsRes.data)
    }).catch(err => {
      if (mounted) setError(err?.response?.data?.error || err.message)
    }).finally(() => { if (mounted) setLoading(false) })

    return () => { mounted = false }
  }, [])

  // Dummy data for chart if API is not ready
  const debtTrend = [100, 95, 90, 85, 80, 75, 70] // Placeholder for debt trend

  const paymentColumns = [
    { key: 'id', title: 'ID' },
    { key: 'amount', title: 'Amount' },
    { key: 'paidAt', title: 'Date' },
    { key: 'method', title: 'Method' },
    { key: 'memberId', title: 'Member ID' },
  ]

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <div className="card-grid" style={{ marginBottom: '16px' }}>
        <Card title="Total Members">
          <div style={{ fontSize: 28, fontWeight: 700 }}>{summary?.totalMembers ?? '...'}</div>
          <div className="muted">Registered in the system</div>
        </Card>
        <Card title="Total Units">
          <div style={{ fontSize: 28, fontWeight: 700 }}>{summary?.totalUnits ?? '...'}</div>
          <div className="muted">Managed properties</div>
        </Card>
        <Card title="Total Debt">
          <div style={{ fontSize: 28, fontWeight: 700, color: '#dc3545' }}>{summary?.totalDebt ?? '...'}</div>
          <div className="muted">Outstanding amount</div>
        </Card>
        <Card title="Total Paid">
          <div style={{ fontSize: 28, fontWeight: 700, color: '#28a745' }}>{summary?.totalPaid ?? '...'}</div>
          <div className="muted">Total collected</div>
        </Card>
      </div>

      <div className="card-grid" style={{ marginBottom: '16px' }}>
        <Card title="Debt Trend (Last 7 Days)">
          <SimpleChart values={debtTrend} height={150} />
          <div className="muted" style={{ marginTop: '8px' }}>Placeholder data - replace with real API data.</div>
        </Card>
      </div>

      <Card title="Recent Payments">
        {loading && <div>Loading recent payments...</div>}
        {!loading && recentPayments.length > 0 ? (
          <Table columns={paymentColumns as any} data={recentPayments as any} />
        ) : (
          !loading && <div>No recent payments found.</div>
        )}
      </Card>
    </div>
  )
}
