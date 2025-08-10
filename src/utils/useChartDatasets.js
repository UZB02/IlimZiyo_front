// composables/useChartDatasets.js

export const createApplicationDataset = (data) => ({
  labels: data.labels,
  datasets: [
    {
      label: 'Arizalar',
      data: data.values,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgb(59, 130, 246)',
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
})

export const createPaymentDataset = (data) => ({
  labels: data.labels,
  datasets: [
    {
      label: "To'lovlar",
      data: data.values,
      backgroundColor: 'rgba(34, 197, 94, 0.8)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
})

export const createExpenseDataset = (data) => ({
  labels: data.labels,
  datasets: [
    {
      label: 'Xarajatlar',
      data: data.values,
      backgroundColor: 'rgba(239, 68, 68, 0.8)',
      borderColor: 'rgb(239, 68, 68)',
      borderWidth: 2,
      borderRadius: 4,
      borderSkipped: false,
    },
  ],
})

export const createBalanceDataset = (data) => ({
  labels: data.labels,
  datasets: [
    {
      label: 'Balans',
      data: data.values,
      borderColor: 'rgb(249, 115, 22)',
      backgroundColor: 'rgba(249, 115, 22, 0.1)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: 'rgb(249, 115, 22)',
      pointBorderColor: '#fff',
      pointBorderWidth: 2,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
  ],
})
