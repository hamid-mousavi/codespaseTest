import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend)

const SimpleChart: React.FC<{values:number[], height?:number}> = ({values, height=80}) => {
  if(!values || values.length === 0) return null
  const labels = values.map((_, i) => String(i+1))
  const data = {
    labels,
    datasets: [
      {
        data: values,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.08)',
        tension: 0.3,
        fill: true,
        pointRadius: 0,
      },
    ],
  }
  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } },
  }

  return (
    <div style={{height}}>
      <Line data={data} options={options} />
    </div>
  )
}

export default SimpleChart
